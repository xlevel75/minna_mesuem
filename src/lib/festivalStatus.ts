import type { Festival } from '../types'

export type FestivalPhase = 'ongoing' | 'upcoming' | 'ended' | 'unknown'

export interface FestivalStatus {
  phase: FestivalPhase
  /** Short badge label, e.g. "지금 진행 중", "D-7". */
  label: string
  /** Days until start (upcoming) — used for "한 달 내 시작" filtering. */
  daysUntilStart: number | null
}

function atMidnight(d: Date): number {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()
}

const DAY = 86_400_000

/**
 * Resolve a festival's status against `today`. Concrete start/end dates win;
 * otherwise fall back to recurring start/end months for representative
 * festivals (a month range projected onto the current or next year).
 */
export function festivalStatus(f: Festival, today: Date): FestivalStatus {
  const range = resolveRange(f, today)
  if (!range) return { phase: 'unknown', label: '', daysUntilStart: null }

  const now = atMidnight(today)
  const { start, end } = range

  if (now >= start && now <= end) {
    return { phase: 'ongoing', label: '지금 진행 중', daysUntilStart: 0 }
  }
  if (now < start) {
    const days = Math.round((start - now) / DAY)
    return { phase: 'upcoming', label: `D-${days}`, daysUntilStart: days }
  }
  return { phase: 'ended', label: '종료', daysUntilStart: null }
}

function resolveRange(
  f: Festival,
  today: Date,
): { start: number; end: number } | null {
  if (f.startDate && f.endDate) {
    const start = Date.parse(f.startDate)
    const end = Date.parse(f.endDate)
    if (!Number.isNaN(start) && !Number.isNaN(end)) {
      return { start: atMidnight(new Date(start)), end: atMidnight(new Date(end)) }
    }
  }

  if (f.startMonth && f.endMonth) {
    const year = today.getFullYear()
    let start = new Date(year, f.startMonth - 1, 1)
    let end = new Date(year, f.endMonth, 0) // last day of end month
    // If this year's window already passed, project to next year.
    if (atMidnight(end) < atMidnight(today)) {
      start = new Date(year + 1, f.startMonth - 1, 1)
      end = new Date(year + 1, f.endMonth, 0)
    }
    return { start: atMidnight(start), end: atMidnight(end) }
  }

  return null
}
