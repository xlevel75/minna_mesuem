import type { Region } from '../types'

/** Map default view — centered on South Korea. */
export const KOREA_CENTER: [number, number] = [36.2, 127.9]
export const KOREA_ZOOM = 7

/** Approximate region centroids, used as a focus fallback when an item has
 * no precise coordinates (e.g. a festival located only by region). */
export const REGION_CENTROID: Record<Region, [number, number]> = {
  seoul: [37.5665, 126.978],
  gyeonggi: [37.4, 127.1],
  chungcheong: [36.5, 127.4],
  jeolla: [35.2, 126.9],
  gyeongbuk: [36.1, 128.7],
  gangwon: [37.8, 128.3],
  gyeongnam: [35.2, 128.8],
  jeju: [33.38, 126.55],
}
