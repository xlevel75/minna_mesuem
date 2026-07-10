import { useState } from 'react'
import type { EventItem } from '../../types'
import { RegionBadge } from '../../components/Badge'
import './EventCard.css'

interface Props {
  event: EventItem
  onShowOnMap: (event: EventItem) => void
  canShowOnMap: boolean
}

export function EventCard({ event, onShowOnMap, canShowOnMap }: Props) {
  const [imgFailed, setImgFailed] = useState(false)
  const showImage = Boolean(event.imageUrl) && !imgFailed

  return (
    <article className="event-card">
      {showImage && (
        <div className="event-card__media">
          <img
            src={event.imageUrl}
            alt={event.title}
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={() => setImgFailed(true)}
          />
        </div>
      )}

      <div className="event-card__body">
        <div className="event-card__top">
          <strong className="event-card__place">{event.place || event.title}</strong>
          <RegionBadge region={event.region} />
        </div>

        <h3 className="event-card__title">{event.title}</h3>

        <p className="event-card__addr">📍 {event.address || event.place || '주소 정보 없음'}</p>
        {event.period && <p className="event-card__period">🗓 {event.period}</p>}
        {event.charge && <p className="event-card__charge">💳 {event.charge}</p>}

        <div className="event-card__actions">
          {canShowOnMap && (
            <button type="button" className="event-card__btn" onClick={() => onShowOnMap(event)}>
              🧭 지도로 보기
            </button>
          )}
          {event.homepage && (
            <a
              href={event.homepage}
              target="_blank"
              rel="noreferrer"
              className="event-card__btn event-card__btn--ghost"
            >
              🌐 홈페이지
            </a>
          )}
        </div>
      </div>
    </article>
  )
}
