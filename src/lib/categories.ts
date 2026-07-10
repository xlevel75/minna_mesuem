import type { Category, Region } from '../types'

export interface CategoryMeta {
  key: Category
  label: string
  /** Emoji used inside the map marker + badges. */
  icon: string
  color: string
}

export const CATEGORIES: CategoryMeta[] = [
  { key: 'history', label: '역사', icon: '🏛️', color: '#c0392b' },
  { key: 'art', label: '미술', icon: '🎨', color: '#8e44ad' },
  { key: 'science', label: '과학·자연', icon: '🔬', color: '#2e86de' },
  { key: 'folk', label: '민속·생활', icon: '🪕', color: '#e67e22' },
  { key: 'theme', label: '테마·전문', icon: '🎭', color: '#16a085' },
]

const CATEGORY_BY_KEY = new Map(CATEGORIES.map((c) => [c.key, c]))

export function categoryMeta(key: Category): CategoryMeta {
  return CATEGORY_BY_KEY.get(key) ?? CATEGORIES[0]
}

export interface RegionMeta {
  key: Region
  label: string
}

export const REGIONS: RegionMeta[] = [
  { key: 'seoul', label: '서울' },
  { key: 'gyeonggi', label: '경기·인천' },
  { key: 'chungcheong', label: '충청·대전·세종' },
  { key: 'jeolla', label: '전라·광주' },
  { key: 'gyeongbuk', label: '경북·대구' },
  { key: 'gangwon', label: '강원' },
  { key: 'gyeongnam', label: '경남·부산·울산' },
  { key: 'jeju', label: '제주' },
]

const REGION_BY_KEY = new Map(REGIONS.map((r) => [r.key, r]))

export function regionLabel(key: Region | null): string {
  if (!key) return ''
  return REGION_BY_KEY.get(key)?.label ?? ''
}

/**
 * The raw dataset only carries ownership (국립/공립/사립/대학), not subject
 * category, so we infer the subject from the facility name / description with
 * keyword heuristics. Order matters: more specific keywords win first.
 */
export function deriveCategory(name: string, description = ''): Category {
  const text = `${name} ${description}`

  if (/(미술관|갤러리|아트|회화|조각|공예|서예|사진)/.test(text)) return 'art'
  if (/(과학|자연사|천문|우주|생태|동물|식물|해양|공룡|지질|산업|철도|자동차|항공|에너지|전기|화석)/.test(text))
    return 'science'
  if (/(민속|생활|향토|농경|전통|한옥|김치|음식|의복|주거|생업|풍속)/.test(text))
    return 'folk'
  if (/(역사|유적|고분|왕릉|박물관|기념관|유물|고고|선사)/.test(text)) return 'history'

  return 'theme'
}

/** Normalize the leading province token of a road address into a Region group. */
export function deriveRegion(address: string): Region {
  const a = (address || '').replace(/\s+/g, '')

  if (a.startsWith('서울')) return 'seoul'
  if (a.startsWith('경기') || a.startsWith('인천')) return 'gyeonggi'
  if (a.startsWith('충청') || a.startsWith('충남') || a.startsWith('충북') || a.startsWith('대전') || a.startsWith('세종'))
    return 'chungcheong'
  if (a.startsWith('전라') || a.startsWith('전남') || a.startsWith('전북') || a.startsWith('광주'))
    return 'jeolla'
  if (a.startsWith('강원')) return 'gangwon'
  if (a.startsWith('제주')) return 'jeju'
  // 경상: split into 경북·대구 vs 경남·부산·울산
  if (a.startsWith('경북') || a.startsWith('경상북') || a.startsWith('대구')) return 'gyeongbuk'
  if (
    a.startsWith('경남') ||
    a.startsWith('경상남') ||
    a.startsWith('부산') ||
    a.startsWith('울산')
  )
    return 'gyeongnam'

  return 'seoul'
}
