import { useMemo, useState } from 'react'
import type { Category, Museum } from '../types'
import { CATEGORIES } from '../lib/categories'
import { useMuseums } from '../hooks/useMuseums'
import { useApp } from '../store/appStore'
import { SearchInput } from '../components/SearchInput'
import { FilterChips, type ChipOption } from '../components/FilterChips'
import { MuseumMap } from './map/MuseumMap'
import { MuseumDetailSheet } from './map/MuseumDetailSheet'
import { MuseumList } from './map/MuseumList'
import './MapTab.css'

const CATEGORY_OPTIONS: ChipOption<Category>[] = CATEGORIES.map((c) => ({
  value: c.key,
  label: c.label,
  icon: c.icon,
}))

export function MapTab({ active }: { active: boolean }) {
  const { museums, loading, error } = useMuseums()
  const { mapFocus } = useApp()

  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<Category | null>(null)
  const [selected, setSelected] = useState<Museum | null>(null)
  const [showList, setShowList] = useState(false)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return museums.filter((m) => {
      if (category && m.category !== category) return false
      if (q) {
        const hay = `${m.name} ${m.roadAddress} ${m.lotAddress}`.toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })
  }, [museums, query, category])

  const selectFromList = (m: Museum) => {
    setSelected(m)
    setShowList(false)
  }

  return (
    <div className="map-tab">
      <header className="map-tab__header">
        <h1 className="map-tab__title">박물관·미술관 지도</h1>
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="박물관 이름 또는 지역 검색"
        />
        <FilterChips options={CATEGORY_OPTIONS} value={category} onChange={setCategory} />
      </header>

      <div className="map-tab__body">
        {/* Only mount the map once the tab is first shown so Leaflet sizes correctly. */}
        {active && !error && (
          <MuseumMap museums={filtered} focus={mapFocus} onSelect={setSelected} />
        )}

        {error && (
          <div className="map-tab__state">
            지도 데이터를 불러오지 못했습니다.
            <br />
            <span className="map-tab__muted">{error}</span>
          </div>
        )}
        {loading && !error && <div className="map-tab__state">지도를 불러오는 중…</div>}

        {!loading && !error && (
          <button
            type="button"
            className="map-tab__list-btn"
            onClick={() => setShowList(true)}
          >
            목록 보기 ({filtered.length.toLocaleString('ko-KR')})
          </button>
        )}

        {showList && (
          <MuseumList
            museums={filtered}
            onSelect={selectFromList}
            onClose={() => setShowList(false)}
          />
        )}

        <MuseumDetailSheet museum={selected} onClose={() => setSelected(null)} />
      </div>
    </div>
  )
}
