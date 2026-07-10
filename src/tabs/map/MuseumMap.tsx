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
  /** Museum to mark as selected (highlighted pin). */
  selectedId: string | null
  onSelect: (museum: Museum) => void
}

function markerIcon(museum: Museum, selected: boolean): L.DivIcon {
  const meta = categoryMeta(museum.category)
  const size = selected ? 42 : 30
  return L.divIcon({
    className: 'museum-pin-wrap',
    html: `<div class="museum-pin${selected ? ' museum-pin--selected' : ''}" style="--pin:${meta.color}"><span>${meta.icon}</span></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
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

export function MuseumMap({ museums, focus, selectedId, onSelect }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const clusterRef = useRef<L.MarkerClusterGroup | null>(null)
  const byId = useRef(new Map<string, Museum>())
  const markersById = useRef(new Map<string, L.Marker>())
  const focusMarkerRef = useRef<L.Marker | null>(null)
  const onSelectRef = useRef(onSelect)
  onSelectRef.current = onSelect
  const selectedIdRef = useRef(selectedId)
  selectedIdRef.current = selectedId
  const prevSelectedId = useRef<string | null>(null)

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
      focusMarkerRef.current = null
    }
  }, [])

  // Rebuild markers whenever the filtered set changes.
  useEffect(() => {
    const cluster = clusterRef.current
    if (!cluster) return

    cluster.clearLayers()
    byId.current.clear()
    markersById.current.clear()

    const markers = museums.map((museum) => {
      byId.current.set(museum.id, museum)
      const selected = museum.id === selectedIdRef.current
      const marker = L.marker([museum.lat, museum.lng], { icon: markerIcon(museum, selected) })
      if (selected) marker.setZIndexOffset(1000)
      marker.bindPopup(popupHtml(museum), { closeButton: true, offset: [0, -8] })
      markersById.current.set(museum.id, marker)
      return marker
    })
    cluster.addLayers(markers)
  }, [museums])

  // Move the "selected" highlight between markers as the selection changes.
  useEffect(() => {
    const prev = prevSelectedId.current
    if (prev && prev !== selectedId) {
      const marker = markersById.current.get(prev)
      const museum = byId.current.get(prev)
      if (marker && museum) {
        marker.setIcon(markerIcon(museum, false))
        marker.setZIndexOffset(0)
      }
    }
    if (selectedId) {
      const marker = markersById.current.get(selectedId)
      const museum = byId.current.get(selectedId)
      if (marker && museum) {
        marker.setIcon(markerIcon(museum, true))
        marker.setZIndexOffset(1000)
      }
    }
    prevSelectedId.current = selectedId
  }, [selectedId, museums])

  // React to focus requests. A 'location' focus (event/festival site) drops a
  // blinking red dot; a 'museum' focus just flies (its pin is highlighted via
  // selectedId) and clears any existing dot.
  useEffect(() => {
    const map = mapRef.current
    if (!map || !focus) return
    map.flyTo([focus.lat, focus.lng], 14, { duration: 0.8 })

    if (focus.kind === 'location') {
      if (!focusMarkerRef.current) {
        focusMarkerRef.current = L.marker([focus.lat, focus.lng], {
          icon: L.divIcon({
            className: 'focus-dot-wrap',
            html: '<div class="focus-dot"></div>',
            iconSize: [16, 16],
            iconAnchor: [8, 8],
          }),
          zIndexOffset: 2000,
          interactive: false,
        }).addTo(map)
      } else {
        focusMarkerRef.current.setLatLng([focus.lat, focus.lng])
      }
    } else if (focusMarkerRef.current) {
      focusMarkerRef.current.remove()
      focusMarkerRef.current = null
    }
  }, [focus])

  return <div ref={containerRef} className="museum-map" />
}
