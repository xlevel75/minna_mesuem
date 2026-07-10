import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

export type TabKey = 'map' | 'events' | 'festivals'

/** A location the map tab should fly to when opened from another tab. */
export interface MapFocus {
  lat: number
  lng: number
  name: string
  /** Bumps on every request so the map re-focuses even for the same target. */
  nonce: number
}

interface AppState {
  tab: TabKey
  setTab: (tab: TabKey) => void
  mapFocus: MapFocus | null
  /** Switch to the map tab and fly to a location ("지도로 보기"). */
  focusOnMap: (target: { lat: number; lng: number; name: string }) => void
}

const AppContext = createContext<AppState | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [tab, setTab] = useState<TabKey>('map')
  const [mapFocus, setMapFocus] = useState<MapFocus | null>(null)

  const focusOnMap = useCallback<AppState['focusOnMap']>((target) => {
    setMapFocus({ ...target, nonce: performance.now() })
    setTab('map')
  }, [])

  const value = useMemo<AppState>(
    () => ({ tab, setTab, mapFocus, focusOnMap }),
    [tab, mapFocus, focusOnMap],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useApp(): AppState {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
