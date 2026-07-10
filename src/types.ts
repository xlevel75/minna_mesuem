/** Subject category shown as map icons and filter chips. */
export type Category =
  | 'history' // 역사
  | 'art' // 미술
  | 'science' // 과학·자연
  | 'folk' // 민속·생활
  | 'theme' // 테마·전문

/** Region groups used across the map / event / festival filters. */
export type Region =
  | 'seoul' // 서울
  | 'gyeonggi' // 경기·인천
  | 'chungcheong' // 충청·대전·세종
  | 'jeolla' // 전라·광주
  | 'gyeongbuk' // 경북·대구
  | 'gangwon' // 강원
  | 'gyeongnam' // 경남·부산·울산
  | 'jeju' // 제주

/** A single museum / art gallery from the standard public dataset. */
export interface Museum {
  id: string
  name: string
  /** Ownership type from the raw data (국립/공립/사립/대학). */
  ownership: string
  /** Derived subject category (used for the map icon). */
  category: Category
  region: Region
  roadAddress: string
  lotAddress: string
  lat: number
  lng: number
  phone: string
  homepage: string
  /** Weekday opening/closing time, e.g. "09:00" / "18:00". */
  weekdayOpen: string
  weekdayClose: string
  holidayInfo: string
  feeAdult: string
  feeYouth: string
  feeChild: string
  feeEtc: string
  description: string
}

/** A cultural event / exhibition (KCISA exhibition & performance APIs). */
export interface EventItem {
  id: string
  /** Which upstream source produced this item. */
  source: 'exhibition' | 'performance'
  title: string
  place: string
  address: string
  region: Region | null
  category: Category | null
  period: string
  viewingTime: string
  charge: string
  homepage: string
  imageUrl: string
  lat: number | null
  lng: number | null
}

/** A festival, either live (KCISA API) or a curated representative festival. */
export interface Festival {
  id: string
  name: string
  region: Region
  location: string
  period: string
  /** Representative recurring months (1-12); used for D-day / status. */
  startMonth?: number
  endMonth?: number
  /** Concrete dates when known (live festivals). */
  startDate?: string
  endDate?: string
  description: string
  homepage: string
  imageUrl: string
  lat: number | null
  lng: number | null
}
