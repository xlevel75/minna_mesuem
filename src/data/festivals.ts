import type { Festival } from '../types'
import { deriveRegion } from '../lib/categories'
import { TOURAPI, PAGE_ROWS } from './apiConfig'
import { fetchWithRetry } from './http'

/**
 * Live festivals from 한국관광공사 TourAPI `searchFestival2`. Returns current +
 * upcoming festivals (from the start of the current month) with images and
 * coordinates. Replaces the stale KCISA 지역축제 archive.
 */

interface TourItem {
  title?: string
  addr1?: string
  addr2?: string
  eventstartdate?: string
  eventenddate?: string
  firstimage?: string
  firstimage2?: string
  mapx?: string // longitude
  mapy?: string // latitude
  tel?: string
  contentid?: string
}

/** "20260703" → "2026-07-03". */
function normalizeDate(v: string | undefined): string | undefined {
  const digits = (v ?? '').replace(/[^\d]/g, '')
  if (digits.length !== 8) return undefined
  return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6, 8)}`
}

function joinDates(start?: string, end?: string): string {
  if (start && end) return `${start} ~ ${end}`
  return start ?? ''
}

function parseNum(v: string | undefined): number | null {
  const n = Number(v)
  return Number.isFinite(n) && n !== 0 ? n : null
}

function toFestival(item: TourItem, index: number): Festival | null {
  const name = (item.title ?? '').trim()
  if (!name) return null

  const addr = [item.addr1, item.addr2].filter(Boolean).join(' ').trim()
  const start = normalizeDate(item.eventstartdate)
  const end = normalizeDate(item.eventenddate)

  return {
    id: `fest-tour-${item.contentid ?? index}`,
    name,
    region: deriveRegion(addr || name),
    location: addr,
    period: joinDates(start, end),
    startDate: start,
    endDate: end,
    description: item.tel ? `문의: ${item.tel}` : '',
    homepage: '',
    imageUrl: (item.firstimage || item.firstimage2 || '').trim(),
    lat: parseNum(item.mapy), // mapy = latitude
    lng: parseNum(item.mapx), // mapx = longitude
  }
}

/** First day of the current month as YYYYMMDD (inclusive window for ongoing). */
function monthStart(): string {
  const now = new Date()
  const mm = String(now.getMonth() + 1).padStart(2, '0')
  return `${now.getFullYear()}${mm}01`
}

function buildUrl(): string {
  const params = new URLSearchParams({
    serviceKey: TOURAPI.serviceKey,
    MobileOS: 'ETC',
    MobileApp: 'miseum',
    _type: 'json',
    arrange: 'A',
    eventStartDate: monthStart(),
    numOfRows: String(PAGE_ROWS),
    pageNo: '1',
  })
  return `${TOURAPI.base}${TOURAPI.festivalPath}?${params.toString()}`
}

function extractItems(json: unknown): TourItem[] {
  const item = (json as Record<string, unknown> | undefined)?.response as
    | Record<string, unknown>
    | undefined
  const body = item?.body as Record<string, unknown> | undefined
  const items = body?.items as Record<string, unknown> | '' | undefined
  // TourAPI returns items as "" (empty string) when there are no results.
  if (!items || typeof items !== 'object') return []
  const raw = (items as Record<string, unknown>).item
  if (Array.isArray(raw)) return raw as TourItem[]
  if (raw && typeof raw === 'object') return [raw as TourItem]
  return []
}

/** Fetch live festivals; on failure returns an empty list plus an error string. */
export async function loadLiveFestivals(
  signal?: AbortSignal,
): Promise<{ festivals: Festival[]; error: string | null }> {
  try {
    const res = await fetchWithRetry(buildUrl(), signal)
    if (!res.ok) throw new Error(`TourAPI ${res.status}`)

    const text = await res.text()
    if (!text.trimStart().startsWith('{')) {
      // Auth/gateway errors come back as plain text ("Forbidden" etc).
      throw new Error(text.slice(0, 60).trim() || 'unexpected response')
    }

    const festivals = extractItems(JSON.parse(text))
      .map((it, i) => toFestival(it, i))
      .filter((f): f is Festival => f !== null)
      .sort((a, b) => (a.startDate ?? '').localeCompare(b.startDate ?? ''))

    return { festivals, error: null }
  } catch (e) {
    if (signal?.aborted) return { festivals: [], error: null }
    const message = e instanceof Error ? e.message : String(e)
    return { festivals: [], error: `실시간 축제 정보를 불러오지 못했습니다 (${message})` }
  }
}
