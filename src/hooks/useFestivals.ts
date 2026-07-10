import { useEffect, useState } from 'react'
import type { Festival } from '../types'
import { loadLiveFestivals } from '../data/festivals'

interface State {
  live: Festival[]
  loading: boolean
  error: string | null
}

export function useFestivals(): State {
  const [state, setState] = useState<State>({ live: [], loading: true, error: null })

  useEffect(() => {
    const controller = new AbortController()
    loadLiveFestivals(controller.signal)
      .then((res) => {
        if (controller.signal.aborted) return
        setState({ live: res.festivals, loading: false, error: res.error })
      })
      .catch((e: unknown) => {
        if (controller.signal.aborted) return
        const message = e instanceof Error ? e.message : String(e)
        setState({ live: [], loading: false, error: message })
      })
    return () => controller.abort()
  }, [])

  return state
}
