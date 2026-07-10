import { useMemo, useState } from 'react'
import type { Category, EventItem, Region } from '../types'
import { CATEGORIES, REGIONS } from '../lib/categories'
import { matchMuseum, resolveTarget } from '../lib/matchLocation'
import { useEvents } from '../hooks/useEvents'
import { useMuseums } from '../hooks/useMuseums'
import { useApp } from '../store/appStore'
import { SearchInput } from '../components/SearchInput'
import { Select } from '../components/Select'
import { Accordion } from '../components/Accordion'
import { EventCard } from './events/EventCard'
import './EventsTab.css'

const CATEGORY_OPTIONS = CATEGORIES.map((c) => ({ value: c.key, label: c.label }))
const REGION_OPTIONS = REGIONS.map((r) => ({ value: r.key, label: r.label }))

export function EventsTab() {
  const { exhibitions, performances, loading, errors } = useEvents()
  const { museums } = useMuseums()
  const { focusOnMap } = useApp()

  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<Category | null>(null)
  const [region, setRegion] = useState<Region | null>(null)

  // The exhibition API only carries a venue name, so infer an accurate region
  // (and later, map coords) by matching each event to a known museum.
  const enrich = useMemo(() => {
    return (e: EventItem): EventItem => {
      const museum = matchMuseum(`${e.place} ${e.title}`, museums)
      if (!museum) return e
      // Fill in an accurate region + full road address from the matched museum.
      return {
        ...e,
        region: museum.region,
        address: e.address || museum.roadAddress,
        place: e.place || museum.name,
      }
    }
  }, [museums])

  const filterFn = useMemo(() => {
    const q = query.trim().toLowerCase()
    return (e: EventItem) => {
      if (category && e.category !== category) return false
      if (region && e.region !== region) return false
      if (q) {
        const hay = `${e.title} ${e.place} ${e.address}`.toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    }
  }, [query, category, region])

  const filteredPerformances = performances.map(enrich).filter(filterFn)
  const filteredExhibitions = exhibitions.map(enrich).filter(filterFn)

  const showOnMap = (e: EventItem) => {
    const target = resolveTarget(`${e.place} ${e.address} ${e.title}`, e.region, museums)
    if (target) focusOnMap(target)
  }

  const canShowOnMap = (e: EventItem) =>
    Boolean(resolveTarget(`${e.place} ${e.address} ${e.title}`, e.region, museums))

  const renderList = (items: EventItem[]) => {
    if (items.length === 0) {
      return <p className="events-tab__empty">해당 조건의 행사가 없습니다.</p>
    }
    return items.map((e) => (
      <EventCard key={e.id} event={e} onShowOnMap={showOnMap} canShowOnMap={canShowOnMap(e)} />
    ))
  }

  return (
    <div className="events-tab">
      <header className="events-tab__header">
        <h1 className="events-tab__title">문화 행사 소식</h1>
        <p className="events-tab__lead">전국 박물관과 문화 공간에서 열리는 다채로운 전시와 공연</p>
        <SearchInput value={query} onChange={setQuery} placeholder="행사 이름 또는 지역 검색" />
        <div className="events-tab__filters">
          <Select
            value={category}
            options={CATEGORY_OPTIONS}
            onChange={setCategory}
            allLabel="전체 카테고리"
          />
          <Select
            value={region}
            options={REGION_OPTIONS}
            onChange={setRegion}
            allLabel="전체 지역"
          />
        </div>
      </header>

      <div className="events-tab__body">
        {loading && <p className="events-tab__state">행사 정보를 불러오는 중…</p>}

        {errors.length > 0 && (
          <div className="events-tab__notice">
            {errors.map((msg) => (
              <p key={msg}>⚠️ {msg}</p>
            ))}
            <p className="events-tab__muted">
              KCISA 오픈 API는 개발 서버 프록시를 통해서만 호출됩니다. (프로덕션은 별도 프록시 필요)
            </p>
          </div>
        )}

        {!loading && (
          <>
            <Accordion
              title="전국 문화예술공연·전시"
              subtitle="문화포털에 등록된 전국 주요 문화 행사"
              icon="🎭"
              accent="#e74c3c"
              defaultOpen
            >
              {renderList(filteredPerformances)}
            </Accordion>

            <Accordion
              title="박물관 주요 행사"
              subtitle="국립 박물관·미술관에서 진행 중인 전시"
              icon="🏛️"
              accent="#1f9d63"
              defaultOpen
            >
              {renderList(filteredExhibitions)}
            </Accordion>
          </>
        )}
      </div>
    </div>
  )
}
