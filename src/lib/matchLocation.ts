import type { EventItem, Museum, Region } from '../types'
import { REGION_CENTROID } from './geo'

export interface MapTarget {
  lat: number
  lng: number
  name: string
}

/** Events whose venue/title contains this museum's name (its exhibitions). */
export function eventsForMuseum(museum: Museum, events: EventItem[]): EventItem[] {
  const name = museum.name.replace(/\s+/g, '')
  if (name.length < 3) return []
  return events.filter((e) => {
    const hay = `${e.place} ${e.title} ${e.address}`.replace(/\s+/g, '')
    return hay.includes(name)
  })
}

/** Find a museum whose (whitespace-stripped) name appears in the given text. */
export function matchMuseum(text: string, museums: Museum[]): Museum | null {
  const haystack = (text || '').replace(/\s+/g, '')
  if (!haystack) return null
  for (const m of museums) {
    const name = m.name.replace(/\s+/g, '')
    if (name.length >= 3 && haystack.includes(name)) return m
  }
  return null
}

/**
 * Resolve a text location (event place / festival site) to map coordinates.
 * First tries to match a known museum by name, then falls back to the region
 * centroid so "지도로 보기" always lands somewhere sensible.
 */
export function resolveTarget(
  text: string,
  region: Region | null,
  museums: Museum[],
): MapTarget | null {
  const museum = matchMuseum(text, museums)
  if (museum) return { lat: museum.lat, lng: museum.lng, name: museum.name }

  if (region) {
    const [lat, lng] = REGION_CENTROID[region]
    return { lat, lng, name: text || '' }
  }

  return null
}
