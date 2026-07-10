import { describe, it, expect } from 'vitest'
import type { Festival } from '../types'
import { festivalStatus } from './festivalStatus'

function fest(partial: Partial<Festival>): Festival {
  return {
    id: 't',
    name: '테스트축제',
    region: 'seoul',
    location: '',
    period: '',
    description: '',
    homepage: '',
    imageUrl: '',
    lat: null,
    lng: null,
    ...partial,
  }
}

describe('festivalStatus', () => {
  const today = new Date(2026, 6, 10) // 2026-07-10

  it('marks a festival within concrete dates as ongoing', () => {
    const s = festivalStatus(fest({ startDate: '2026-07-03', endDate: '2026-07-12' }), today)
    expect(s.phase).toBe('ongoing')
    expect(s.label).toBe('지금 진행 중')
  })

  it('computes D-day for an upcoming festival', () => {
    const s = festivalStatus(fest({ startDate: '2026-07-17', endDate: '2026-07-20' }), today)
    expect(s.phase).toBe('upcoming')
    expect(s.label).toBe('D-7')
    expect(s.daysUntilStart).toBe(7)
  })

  it('uses recurring months and projects to next year when past', () => {
    // A January festival, viewed in July → should project to next January.
    const s = festivalStatus(fest({ startMonth: 1, endMonth: 1 }), today)
    expect(s.phase).toBe('upcoming')
    expect(s.daysUntilStart).toBeGreaterThan(150)
  })

  it('is unknown without any date info', () => {
    expect(festivalStatus(fest({}), today).phase).toBe('unknown')
  })
})
