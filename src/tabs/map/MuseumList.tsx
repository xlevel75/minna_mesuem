import type { Museum } from '../../types'
import { CategoryBadge } from '../../components/Badge'
import { formatHoursAndFee } from '../../lib/format'
import './MuseumList.css'

interface Props {
  museums: Museum[]
  onSelect: (museum: Museum) => void
  onClose: () => void
}

export function MuseumList({ museums, onSelect, onClose }: Props) {
  return (
    <div className="museum-list">
      <div className="museum-list__head">
        <button type="button" className="museum-list__back" onClick={onClose}>
          ← 지도로 돌아가기
        </button>
        <span className="museum-list__count">{museums.length.toLocaleString('ko-KR')}곳</span>
      </div>

      <ul className="museum-list__items">
        {museums.map((m) => (
          <li key={m.id}>
            <button type="button" className="museum-list__item" onClick={() => onSelect(m)}>
              <div className="museum-list__row">
                <CategoryBadge category={m.category} />
                <strong className="museum-list__name">{m.name}</strong>
              </div>
              <p className="museum-list__addr">{m.roadAddress || m.lotAddress}</p>
              <p className="museum-list__meta">{formatHoursAndFee(m)}</p>
            </button>
          </li>
        ))}
        {museums.length === 0 && (
          <li className="museum-list__empty">검색 결과가 없습니다.</li>
        )}
      </ul>
    </div>
  )
}
