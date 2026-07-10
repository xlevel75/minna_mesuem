import type { EventItem } from '../types'
import { deriveCategory, deriveRegion } from '../lib/categories'
import { normalizeUrl } from '../lib/format'
import { KCISA, PAGE_ROWS } from './apiConfig'
import { fetchKcisaItems, field, type KcisaRecord } from './kcisaClient'

/**
 * culture.go.kr serves the same poster images over https (the http URL just
 * 302-redirects to https). Upgrade the scheme so they aren't blocked as mixed
 * content on an https deployment. Images load cross-origin without CORS.
 */
function upgradeImage(url: string): string {
  return url.replace(/^http:\/\/www\.culture\.go\.kr/i, 'https://www.culture.go.kr')
}

function buildUrl(path: string, serviceKey: string): string {
  const params = new URLSearchParams({
    serviceKey,
    numOfRows: String(PAGE_ROWS),
    pageNo: '1',
  })
  return `${KCISA.base}${path}?${params.toString()}`
}

function toEvent(
  record: KcisaRecord,
  source: EventItem['source'],
  index: number,
): EventItem {
  const title = field(record, ['TITLE', 'title'])
  const place = field(record, [
    'EVENT_SITE',
    'CNTC_INSTT_NM',
    'SPATIAL',
    'PLACE',
    'place',
  ])
  const address = field(record, [
    'EVENT_SITE',
    'ADDRESS',
    'SPATIAL_COVERAGE',
    'spatialCoverage',
  ])
  const period =
    field(record, ['PERIOD', 'period']) ||
    field(record, ['EVENT_PERIOD', 'temporalCoverage'])

  const regionSource = address || place || title
  const catSource = `${title} ${place}`

  return {
    id: `${source}-${index}`,
    source,
    title,
    place,
    address,
    region: regionSource ? deriveRegion(regionSource) : null,
    category: title ? deriveCategory(catSource) : null,
    period,
    viewingTime: field(record, ['DURATION', 'GUIDANCE']),
    charge: field(record, ['CHARGE', 'charge']) || '무료',
    homepage: normalizeUrl(field(record, ['URL', 'url', 'sourceUrl'])),
    imageUrl: upgradeImage(field(record, ['IMAGE_OBJECT', 'imageObject', 'IMAGE', 'referenceIdentifier'])),
    lat: null,
    lng: null,
  }
}

async function fetchSource(
  path: string,
  serviceKey: string,
  source: EventItem['source'],
): Promise<EventItem[]> {
  const records = await fetchKcisaItems(buildUrl(path, serviceKey))
  return records
    .map((r, i) => toEvent(r, source, i))
    .filter((e) => e.title)
}

export interface EventsResult {
  exhibitions: EventItem[]
  performances: EventItem[]
  errors: string[]
}

let cache: EventsResult | null = null
let inflight: Promise<EventsResult> | null = null

/**
 * Fetch both event sources once and share the result (both the Map and Events
 * tabs consume it). The shared fetch is intentionally NOT tied to any caller's
 * abort signal — otherwise one consumer unmounting (e.g. React StrictMode's
 * double-mount in dev) would abort the fetch for everyone. Only a fully
 * successful result is cached, so a transient failure can retry.
 */
export async function loadEvents(): Promise<EventsResult> {
  if (cache) return cache
  if (!inflight) {
    inflight = fetchEvents()
      .then((r) => {
        if (r.errors.length === 0) cache = r
        return r
      })
      .finally(() => {
        inflight = null
      })
  }
  return inflight
}

async function fetchEvents(): Promise<EventsResult> {
  const errors: string[] = []

  const [exhibitions, performances] = await Promise.all([
    fetchSource(KCISA.paths.exhibition, KCISA.keys.exhibition, 'exhibition').catch(
      (e: unknown) => {
        errors.push(`전시 정보를 불러오지 못했습니다 (${describe(e)})`)
        return [] as EventItem[]
      },
    ),
    fetchSource(KCISA.paths.performance, KCISA.keys.performance, 'performance').catch(
      (e: unknown) => {
        errors.push(`공연 정보를 불러오지 못했습니다 (${describe(e)})`)
        return [] as EventItem[]
      },
    ),
  ])

  return { exhibitions, performances, errors }
}

function describe(e: unknown): string {
  return e instanceof Error ? e.message : String(e)
}
