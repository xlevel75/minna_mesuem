# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**Museum Contents** — a mobile-first web app (React + Vite + TypeScript) for exploring Korea's museums, cultural events, and festivals. Three tabs, bottom-nav driven:

- **지도 (Map)** — Leaflet map of all ~1074 national museums/galleries, clustered, with category-colored pins, popup → detail sheet, and search + category filter.
- **행사 (Events)** — current exhibitions/performances (KCISA APIs) in collapsible sections, with category + region filters and "지도로 보기" that jumps to the Map tab.
- **축제 (Festivals)** — live regional festivals (KCISA API) + a curated list of representative festivals, with D-day/ongoing status badges and image cards.

The UI targets a phone-width viewport (480px shell, centered on desktop). Always build and review at mobile width first.

## Commands

```bash
npm run dev        # Vite dev server (has the /kcisa API proxy — see below)
npm run build      # tsc -b type-check, then vite build → dist/
npm run lint       # ESLint (flat config)
npm test           # Vitest run (happy-dom)
npm run test:watch # Vitest watch mode
```

Run a single test file: `npx vitest run src/lib/festivalStatus.test.ts`.

## Toolchain constraints (important)

- **Node 20.15.0.** The stack is pinned to versions that run on this Node.
  - **Do not upgrade to Vite 7/8** — they need Node ≥20.19 and the rolldown native binary, which fails to install here. Stay on Vite 6.
  - Test env is **happy-dom, not jsdom** — jsdom's `html-encoding-sniffer` pulls an ESM-only dep that Node 20.15's `require` can't load.
  - `package.json` has `"overrides": { "vite": "^6.3.5" }` to force a single Vite copy (Vitest otherwise nests a second one, breaking config types). Keep it.
- `npm audit` reports the dev-only esbuild advisory (transitive, whole Vite-6 line). Do **not** run `npm audit fix --force` — it jumps to Vite 7 and breaks the above.

## Architecture

Data flows **source → data layer → hook → tab**. Tabs stay mounted (hidden via CSS) so map/scroll state survives switches; cross-tab navigation goes through a small context store.

- `src/store/appStore.tsx` — context holding the active tab and a `mapFocus` target. `focusOnMap({lat,lng,name})` switches to the Map tab and flies there; this is how "지도로 보기" works from Events/Festivals.
- `src/types.ts` — domain model (`Museum`, `EventItem`, `Festival`, `Category`, `Region`).
- `src/lib/categories.ts` — the 5 subject categories + 8 region groups, plus **the derivation heuristics**:
  - The raw museum data only has *ownership* (국립/공립/사립/대학), **not** subject category. `deriveCategory(name, description)` infers 역사/미술/과학·자연/민속·생활/테마·전문 from keywords (order matters — art/science/folk match before the generic 역사 fallback).
  - `deriveRegion(address)` normalizes province-name variants (전북특별자치도 vs 전라북도, etc.) into the 8 region groups, and splits 경상 into 경북·대구 / 경남·부산·울산.
- `src/lib/festivalStatus.ts` — resolves ongoing/upcoming/D-day. Concrete `startDate`/`endDate` win; representative festivals use recurring `startMonth`/`endMonth` projected onto the current or next year. Pure + unit-tested; pass `today` in (don't call `Date.now()` inside).
- `src/lib/matchLocation.ts` — matches an event/festival's venue text to a known museum by name (`includes`), used both to enrich events with an accurate region and to resolve map coordinates. Falls back to `REGION_CENTROID` (`src/lib/geo.ts`).

### Data sources

- **Museums**: static `public/data/museums.json` (전국박물관미술관정보표준데이터, ~1074 records, all with valid 위도/경도). Fetched + normalized once in `src/data/museums.ts` (in-memory cache). The raw JSON also lives in `refrence/`.
- **Events**: KCISA open APIs (exhibitions/performances), via `src/data/events.ts` + the shared `kcisaClient.ts` (handles both JSON and XML; use `field(record, [keys])` for case-insensitive lookup).
- **Festivals (live)**: 한국관광공사 **TourAPI `searchFestival2`** (KorService2), via `src/data/festivals.ts`. Returns current+upcoming festivals with `firstimage` (image), `mapx`/`mapy` (lng/lat → precise "위치 바로가기"), and event dates. Replaced the stale KCISA 지역축제 archive (data stopped ~2016). Keys/paths for both are in `src/data/apiConfig.ts`.
- **Representative festivals**: curated in `src/data/representativeFestivals.ts` (web-researched; recurring months, no live dependency).

### KCISA API proxy (CORS / mixed-content)

The external APIs block direct browser calls (CORS / http). `vite.config.ts` proxies `/kcisa` → `https://api.kcisa.kr` and `/tourapi` → `https://apis.data.go.kr` **for dev only**. In production both need a real backend proxy — the API calls will otherwise fail (the Events/Festivals tabs degrade gracefully with an error notice; the Map tab and representative festivals still work fully offline of the API).

TourAPI needs an approved data.go.kr key for service 15101578 (국문 관광정보 서비스) — applied per-API in data.go.kr 마이페이지; a 403 (vs 401) means the key is valid but that service isn't approved yet.

Verified response shapes: exhibition venue is `CNTC_INSTT_NM` (EVENT_SITE is empty); festival region is `spatialCoverage`, image is `referenceIdentifier` — note KCISA mixes UPPER_SNAKE and camelCase tag names, so `field()` lookups list both.

### The Leaflet map

`src/tabs/map/MuseumMap.tsx` integrates Leaflet **imperatively** (not react-leaflet — avoids React 19 version churn) with `leaflet.markercluster` for the ~1074 markers. Import Leaflet as `import * as L from 'leaflet'` (CJS `export =` under `verbatimModuleSyntax`). Pins are `L.divIcon` (category color + emoji), so the default marker-image 404 never occurs. The map only mounts while the Map tab is active (so Leaflet sizes against a visible container).

## Mobile-first conventions

- **Design tokens** in `src/index.css` `:root` (spacing `--space-*`, colors `--color-*`, `--radius`, safe-area insets). Use tokens, not hardcoded px/hex.
- App shell width capped by `--app-max-width` on `#root`. Use `100dvh` (not `100vh`) and pad against `--safe-top`/`--safe-bottom`.
- Component styles are colocated `.css` files imported by their component.
