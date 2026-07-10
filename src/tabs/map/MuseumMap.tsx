import { useEffect, useRef } from 'react'
import * as L from 'leaflet'
import 'leaflet.markercluster'
import 'leaflet/dist/leaflet.css'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import type { Museum } from '../../types'
import { categoryMeta } from '../../lib/categories'
import { KOREA_CENTER, KOREA_ZOOM } from '../../lib/geo'
import type { MapFocus } from '../../store/appStore'
import './MuseumMap.css'

interface Props {
  museums: Museum[]
  focus: MapFocus | null
  onSelect: (museum: Museum) => void
}

function markerIcon(museum: Museum): L.DivIcon {
  const meta = categoryMeta(museum.category)
  return L.divIcon({
    className: 'museum-pin-wrap',
    html: `<div class="museum-pin" style="--pin:${meta.color}"><span>${meta.icon}</span></div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
  })
}

function popupHtml(museum: Museum): string {
  const meta = categoryMeta(museum.category)
  return `
    <div class="museum-popup">
      <span class="museum-popup__cat" style="background:${meta.color}">
        ${meta.icon} ${meta.label}
      </span>
      <strong class="museum-popup__name">${escapeHtml(museum.name)}</strong>
      <button type="button" class="museum-popup__more" data-museum-id="${museum.id}">
        자세히 보기 ↓
      </button>
    </div>`
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => {
    switch (c) {
      case '&':
        return '&amp;'
      case '<':
        return '&lt;'
      case '>':
        return '&gt;'
      case '"':
        return '&quot;'
      default:
        return '&#39;'
    }
  })
}

export function MuseumMap({ museums, focus, onSelect }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const clusterRef = useRef<L.MarkerClusterGroup | null>(null)
  const byId = useRef(new Map<string, Museum>())
  const onSelectRef = useRef(onSelect)
  onSelectRef.current = onSelect

  // Initialize the map once.
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    const map = L.map(containerRef.current, {
      center: KOREA_CENTER,
      zoom: KOREA_ZOOM,
      zoomControl: false,
    })
    L.control.zoom({ position: 'topright' }).addTo(map)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map)

    const cluster = L.markerClusterGroup({
      maxClusterRadius: 55,
      chunkedLoading: true,
      showCoverageOnHover: false,
    })
    map.addLayer(cluster)

    // Delegate clicks on the popup "자세히 보기" button.
    map.on('popupopen', (e) => {
      const btn = (e.popup.getElement() as HTMLElement | undefined)?.querySelector<HTMLButtonElement>(
        '.museum-popup__more',
      )
      btn?.addEventListener('click', () => {
        const id = btn.dataset.museumId
        const museum = id ? byId.current.get(id) : undefined
        if (museum) onSelectRef.current(museum)
      })
    })

    mapRef.current = map
    clusterRef.current = cluster

    return () => {
      map.remove()
      mapRef.current = null
      clusterRef.current = null
    }
  }, [])

  // Rebuild markers whenever the filtered set changes.
  useEffect(() => {
    const cluster = clusterRef.current
    if (!cluster) return

    cluster.clearLayers()
    byId.current.clear()

    const markers = museums.map((museum) => {
      byId.current.set(museum.id, museum)
      const marker = L.marker([museum.lat, museum.lng], { icon: markerIcon(museum) })
      marker.bindPopup(popupHtml(museum), { closeButton: true, offset: [0, -8] })
      return marker
    })
    cluster.addLayers(markers)
  }, [museums])

  // React to cross-tab focus requests ("지도로 보기").
  useEffect(() => {
    const map = mapRef.current
    if (!map || !focus) return
    map.flyTo([focus.lat, focus.lng], 14, { duration: 0.8 })
  }, [focus])

  return <div ref={containerRef} className="museum-map" />
}
