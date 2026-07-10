import { useEffect, useState } from 'react'
import type { Museum } from '../types'
import { loadMuseums } from '../data/museums'

interface State {
  museums: Museum[]
  loading: boolean
  error: string | null
}

export function useMuseums(): State {
  const [state, setState] = useState<State>({
    museums: [],
    loading: true,
    error: null,
  })

  useEffect(() => {
    let cancelled = false
    loadMuseums()
      .then((museums) => {
        if (!cancelled) setState({ museums, loading: false, error: null })
      })
      .catch((e: unknown) => {
        if (!cancelled) {
          const message = e instanceof Error ? e.message : String(e)
          setState({ museums: [], loading: false, error: message })
        }
      })
    return () => {
      cancelled = true
    }
  }, [])

  return state
}
