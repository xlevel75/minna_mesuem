import type { Museum } from '../types'

/** "09:00"~"18:00" → "9-18시"; blank/00:00 pairs are treated as unknown. */
export function formatHours(open: string, close: string): string {
  const o = toHour(open)
  const c = toHour(close)
  if (o === null || c === null || (o === 0 && c === 0)) return ''
  return `${o}-${c}시`
}

function toHour(t: string): number | null {
  if (!t) return null
  const m = /^(\d{1,2})/.exec(t.trim())
  return m ? Number(m[1]) : null
}

/** Numeric string → "10,000원"; 0 / blank → "무료". */
function formatWon(v: string): string {
  const n = Number(String(v).replace(/[^\d]/g, ''))
  if (!n) return '무료'
  return `${n.toLocaleString('ko-KR')}원`
}

/** Compact fee summary for the list/detail view. */
export function formatFee(m: Pick<Museum, 'feeAdult'>): string {
  return formatWon(m.feeAdult)
}

/** "9-18시 · 무료" style line combining hours and adult fee. */
export function formatHoursAndFee(m: Museum): string {
  const hours = formatHours(m.weekdayOpen, m.weekdayClose)
  const fee = formatFee(m)
  return [hours, fee].filter(Boolean).join(' · ')
}

/** Ensure a homepage string is a clickable absolute URL. */
export function normalizeUrl(url: string): string {
  const u = (url || '').trim()
  if (!u) return ''
  if (/^https?:\/\//i.test(u)) return u
  return `https://${u}`
}
