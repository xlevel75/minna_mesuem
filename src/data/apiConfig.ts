/**
 * KCISA open-API service keys. These are public-data service keys; in a client
 * app they are inevitably exposed. For production move the calls behind a
 * backend proxy that injects the key server-side.
 *
 * All requests go through the Vite dev proxy (`/kcisa` → https://api.kcisa.kr,
 * configured in vite.config.ts) to avoid CORS / mixed-content.
 */
export const KCISA = {
  base: '/kcisa',
  keys: {
    exhibition: '5764917b-135d-434e-bf84-808109bca847', // API_CCA_145
    performance: 'b2647545-bf03-4007-a49c-9ee1446c0417', // CNV_060
  },
  paths: {
    exhibition: '/openapi/API_CCA_145/request',
    performance: '/openapi/CNV_060/request',
  },
} as const

/** Records requested per API page. */
export const PAGE_ROWS = 100

/**
 * 한국관광공사 TourAPI (KorService2) — real-time festival data with images
 * (firstimage) and coordinates (mapx=lng / mapy=lat). Routed through the
 * `/tourapi` dev proxy (vite.config.ts). Requires an approved data.go.kr key
 * for service 15101578 (국문 관광정보 서비스). Same client-key exposure caveat
 * as KCISA — move behind a backend proxy for production.
 */
export const TOURAPI = {
  base: '/tourapi',
  serviceKey: '69536a172789cfd34346bee8a57472d8480d719387cac3d873e0193197adc8d8',
  festivalPath: '/B551011/KorService2/searchFestival2',
} as const
