import { useEffect, useState } from 'react'
import type { EventItem } from '../types'
import { loadEvents } from '../data/events'

interface State {
  exhibitions: EventItem[]
  performances: EventItem[]
  loading: boolean
  errors: string[]
}

export function useEvents(): State {
  const [state, setState] = useState<State>({
    exhibitions: [],
    performances: [],
    loading: true,
    errors: [],
  })

  useEffect(() => {
    // loadEvents owns a shared, un-abortable fetch; we just ignore the result
    // if this consumer unmounted (rather than aborting the shared request).
    let cancelled = false
    loadEvents()
      .then((res) => {
        if (cancelled) return
        setState({
          exhibitions: res.exhibitions,
          performances: res.performances,
          loading: false,
          errors: res.errors,
        })
      })
      .catch((e: unknown) => {
        if (cancelled) return
        const message = e instanceof Error ? e.message : String(e)
        setState({ exhibitions: [], performances: [], loading: false, errors: [message] })
      })
    return () => {
      cancelled = true
    }
  }, [])

  return state
}
