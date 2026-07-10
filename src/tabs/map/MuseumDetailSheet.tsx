import type { ReactNode } from 'react'
import type { Museum } from '../../types'
import { CategoryBadge, RegionBadge } from '../../components/Badge'
import { formatHours, formatFee, normalizeUrl } from '../../lib/format'
import './MuseumDetailSheet.css'

interface Props {
  museum: Museum | null
  onClose: () => void
}

export function MuseumDetailSheet({ museum, onClose }: Props) {
  if (!museum) return null

  const hours = formatHours(museum.weekdayOpen, museum.weekdayClose)
  const homepage = normalizeUrl(museum.homepage)

  return (
    <>
      <div className="sheet-scrim" onClick={onClose} />
      <div className="detail-sheet" role="dialog" aria-label={`${museum.name} 상세 정보`}>
        <div className="detail-sheet__handle" />
        <button type="button" className="detail-sheet__close" onClick={onClose} aria-label="닫기">
          ✕
        </button>

        <div className="detail-sheet__badges">
          <CategoryBadge category={museum.category} />
          <RegionBadge region={museum.region} />
          {museum.ownership && <span className="detail-sheet__own">{museum.ownership}</span>}
        </div>

        <h2 className="detail-sheet__name">{museum.name}</h2>

        <dl className="detail-sheet__info">
          <Row icon="📍" label="주소">
            {museum.roadAddress || museum.lotAddress || '정보 없음'}
          </Row>
          <Row icon="🕘" label="운영시간">
            {hours ? `${hours}` : '정보 없음'}
            {museum.holidayInfo && (
              <span className="detail-sheet__muted"> · 휴관 {museum.holidayInfo}</span>
            )}
          </Row>
          <Row icon="💳" label="관람료">
            {formatFee(museum)}
            {museum.feeEtc && <span className="detail-sheet__muted"> · {museum.feeEtc}</span>}
          </Row>
          {museum.phone && (
            <Row icon="📞" label="전화">
              <a href={`tel:${museum.phone}`}>{museum.phone}</a>
            </Row>
          )}
          {homepage && (
            <Row icon="🌐" label="웹사이트">
              <a href={homepage} target="_blank" rel="noreferrer" className="detail-sheet__link">
                {museum.homepage}
              </a>
            </Row>
          )}
        </dl>

        {museum.description && <p className="detail-sheet__desc">{museum.description}</p>}
      </div>
    </>
  )
}

function Row({
  icon,
  label,
  children,
}: {
  icon: string
  label: string
  children: ReactNode
}) {
  return (
    <div className="detail-sheet__row">
      <dt>
        <span aria-hidden="true">{icon}</span>
        <span className="sr-only">{label}</span>
      </dt>
      <dd>{children}</dd>
    </div>
  )
}
