import { useState } from 'react'
import type { Festival } from '../../types'
import { RegionBadge, StatusBadge } from '../../components/Badge'
import { categoryMeta, regionLabel } from '../../lib/categories'
import { festivalStatus, type FestivalPhase } from '../../lib/festivalStatus'
import './FestivalCard.css'

interface Props {
  festival: Festival
  today: Date
  onShowOnMap: (festival: Festival) => void
}

const TONE: Record<FestivalPhase, 'ongoing' | 'upcoming' | 'muted'> = {
  ongoing: 'ongoing',
  upcoming: 'upcoming',
  ended: 'muted',
  unknown: 'muted',
}

/** Deterministic gradient fallback when a festival has no image. */
function gradientFor(name: string): string {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) % 360
  return `linear-gradient(135deg, hsl(${hash} 55% 40%), hsl(${(hash + 40) % 360} 60% 28%))`
}

export function FestivalCard({ festival, today, onShowOnMap }: Props) {
  const [imgFailed, setImgFailed] = useState(false)
  const status = festivalStatus(festival, today)
  const showImage = festival.imageUrl && !imgFailed

  return (
    <article className="festival-card">
      <div
        className="festival-card__media"
        style={showImage ? undefined : { backgroundImage: gradientFor(festival.name) }}
      >
        {showImage && (
          <img
            src={festival.imageUrl}
            alt={festival.name}
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={() => setImgFailed(true)}
          />
        )}
        <div className="festival-card__badges">
          <RegionBadge region={festival.region} />
          <StatusBadge label={status.label} tone={TONE[status.phase]} />
        </div>
        {!showImage && (
          <span className="festival-card__glyph" aria-hidden="true">
            {categoryMeta('theme').icon}
          </span>
        )}
      </div>

      <div className="festival-card__body">
        <h3 className="festival-card__name">{festival.name}</h3>
        {festival.description && (
          <p className="festival-card__desc">{festival.description}</p>
        )}
        {festival.period && <p className="festival-card__meta">🗓 {festival.period}</p>}
        <p className="festival-card__meta">
          📍 {festival.location || regionLabel(festival.region)}
        </p>

        <div className="festival-card__actions">
          <button
            type="button"
            className="festival-card__btn"
            onClick={() => onShowOnMap(festival)}
          >
            🧭 위치 바로가기
          </button>
          {festival.homepage && (
            <a
              href={festival.homepage}
              target="_blank"
              rel="noreferrer"
              className="festival-card__btn festival-card__btn--ghost"
            >
              🌐 홈페이지 가기
            </a>
          )}
        </div>
      </div>
    </article>
  )
}
