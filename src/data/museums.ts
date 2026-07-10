import type { Museum } from '../types'
import { deriveCategory, deriveRegion } from '../lib/categories'

interface RawMuseum {
  시설명: string
  박물관미술관구분: string
  소재지도로명주소: string
  소재지지번주소: string
  위도: string
  경도: string
  운영기관전화번호: string
  운영홈페이지: string
  평일관람시작시각: string
  평일관람종료시각: string
  휴관정보: string
  어른관람료: string
  청소년관람료: string
  어린이관람료: string
  관람료기타정보: string
  박물관미술관소개: string
}

interface RawFile {
  records: RawMuseum[]
}

/** Korea's bounding box — used to drop records with junk coordinates. */
function hasValidCoords(lat: number, lng: number): boolean {
  return lat > 32 && lat < 39.6 && lng > 124 && lng < 132
}

function normalize(raw: RawMuseum, index: number): Museum | null {
  const lat = parseFloat(raw.위도)
  const lng = parseFloat(raw.경도)
  if (!hasValidCoords(lat, lng)) return null

  const name = (raw.시설명 || '').trim()
  const roadAddress = (raw.소재지도로명주소 || '').trim()
  const description = (raw.박물관미술관소개 || '').trim()

  return {
    id: `m-${index}`,
    name,
    ownership: (raw.박물관미술관구분 || '').trim(),
    category: deriveCategory(name, description),
    region: deriveRegion(roadAddress || raw.소재지지번주소 || ''),
    roadAddress,
    lotAddress: (raw.소재지지번주소 || '').trim(),
    lat,
    lng,
    phone: (raw.운영기관전화번호 || '').trim(),
    homepage: (raw.운영홈페이지 || '').trim(),
    weekdayOpen: (raw.평일관람시작시각 || '').trim(),
    weekdayClose: (raw.평일관람종료시각 || '').trim(),
    holidayInfo: (raw.휴관정보 || '').trim(),
    feeAdult: (raw.어른관람료 || '').trim(),
    feeYouth: (raw.청소년관람료 || '').trim(),
    feeChild: (raw.어린이관람료 || '').trim(),
    feeEtc: (raw.관람료기타정보 || '').trim(),
    description,
  }
}

let cache: Museum[] | null = null

/** Fetch + normalize the museum dataset once, then serve from memory. */
export async function loadMuseums(): Promise<Museum[]> {
  if (cache) return cache

  const res = await fetch(`${import.meta.env.BASE_URL}data/museums.json`)
  if (!res.ok) throw new Error(`museum data load failed: ${res.status}`)

  const json: RawFile = await res.json()
  const museums = json.records
    .map((r, i) => normalize(r, i))
    .filter((m): m is Museum => m !== null)

  cache = museums
  return museums
}
