import { useMemo, useState } from 'react'
import type { Festival } from '../types'
import { resolveTarget } from '../lib/matchLocation'
import { festivalStatus } from '../lib/festivalStatus'
import { REPRESENTATIVE_FESTIVALS } from '../data/representativeFestivals'
import { useFestivals } from '../hooks/useFestivals'
import { useMuseums } from '../hooks/useMuseums'
import { useApp } from '../store/appStore'
import { FilterChips, type ChipOption } from '../components/FilterChips'
import { Accordion } from '../components/Accordion'
import { FestivalCard } from './festivals/FestivalCard'
import './FestivalsTab.css'

type StatusFilter = 'ongoing' | 'soon'

const STATUS_OPTIONS: ChipOption<StatusFilter>[] = [
  { value: 'ongoing', label: '진행 중' },
  { value: 'soon', label: '한 달 내 시작' },
]

export function FestivalsTab() {
  const { live, loading, error } = useFestivals()
  const { museums } = useMuseums()
  const { focusOnMap } = useApp()

  const today = useMemo(() => new Date(), [])
  const [status, setStatus] = useState<StatusFilter | null>(null)

  const matchesStatus = useMemo(() => {
    return (f: Festival) => {
      if (!status) return true
      const s = festivalStatus(f, today)
      if (status === 'ongoing') return s.phase === 'ongoing'
      return s.phase === 'upcoming' && s.daysUntilStart !== null && s.daysUntilStart <= 30
    }
  }, [status, today])

  const showOnMap = (f: Festival) => {
    if (f.lat != null && f.lng != null) {
      focusOnMap({ lat: f.lat, lng: f.lng, name: f.name })
      return
    }
    const target = resolveTarget(f.location, f.region, museums)
    if (target) focusOnMap({ ...target, name: f.name })
  }

  const representatives = REPRESENTATIVE_FESTIVALS.filter(matchesStatus)
  const liveFestivals = live.filter(matchesStatus)

  const renderList = (items: Festival[], emptyText: string) => {
    if (items.length === 0) return <p className="festivals-tab__empty">{emptyText}</p>
    return items.map((f) => (
      <FestivalCard key={f.id} festival={f} today={today} onShowOnMap={showOnMap} />
    ))
  }

  return (
    <div className="festivals-tab">
      <header className="festivals-tab__header">
        <h1 className="festivals-tab__title">전국 축제</h1>
        <p className="festivals-tab__lead">계절마다 달라지는 대한민국의 아름다운 축제들</p>
        <FilterChips
          options={STATUS_OPTIONS}
          value={status}
          onChange={setStatus}
          allLabel="전체보기"
        />
      </header>

      <div className="festivals-tab__body">
        <Accordion
          title="실시간 지역 축제 소식"
          subtitle="한국관광공사 제공 전국 지역 축제 현황"
          icon="📡"
          accent="#e74c3c"
          defaultOpen
        >
          {loading && <p className="festivals-tab__empty">불러오는 중…</p>}
          {error && (
            <div className="festivals-tab__notice">
              <p>⚠️ {error}</p>
              <p className="festivals-tab__muted">
                실시간 축제 API는 개발 서버 프록시에서만 동작합니다. 아래 대표 축제는 항상 표시됩니다.
              </p>
            </div>
          )}
          {!loading && !error && renderList(liveFestivals, '조건에 맞는 실시간 축제가 없습니다.')}
        </Accordion>

        <Accordion
          title="한국의 대표 축제"
          subtitle="꼭 가봐야 할 계절별 전국구 축제"
          icon="🎆"
          accent="#1f9d63"
          defaultOpen
        >
          {renderList(representatives, '조건에 맞는 대표 축제가 없습니다.')}
        </Accordion>
      </div>
    </div>
  )
}
