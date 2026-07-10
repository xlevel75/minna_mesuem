import { describe, it, expect } from 'vitest'
import { deriveCategory, deriveRegion } from './categories'

describe('deriveCategory', () => {
  it('classifies art galleries', () => {
    expect(deriveCategory('국립현대미술관')).toBe('art')
  })

  it('classifies science / nature museums', () => {
    expect(deriveCategory('국립과천과학관')).toBe('science')
    expect(deriveCategory('서대문자연사박물관')).toBe('science')
  })

  it('classifies folk / life museums', () => {
    expect(deriveCategory('국립민속박물관')).toBe('folk')
  })

  it('defaults history for generic 박물관', () => {
    expect(deriveCategory('국립경주박물관')).toBe('history')
  })

  it('falls back to theme when nothing matches', () => {
    expect(deriveCategory('세계장신구관')).toBe('theme')
  })
})

describe('deriveRegion', () => {
  it('normalizes province variants into region groups', () => {
    expect(deriveRegion('서울특별시 용산구 서빙고로 137')).toBe('seoul')
    expect(deriveRegion('전북특별자치도 김제시')).toBe('jeolla')
    expect(deriveRegion('전라남도 함평군')).toBe('jeolla')
    expect(deriveRegion('충청북도 청주시')).toBe('chungcheong')
    expect(deriveRegion('세종특별자치시')).toBe('chungcheong')
    expect(deriveRegion('대구광역시 수성구')).toBe('gyeongbuk')
    expect(deriveRegion('부산광역시 해운대구')).toBe('gyeongnam')
    expect(deriveRegion('제주특별자치도 제주시')).toBe('jeju')
  })
})
