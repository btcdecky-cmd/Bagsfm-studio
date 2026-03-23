import { useEffect, useState, useCallback, useRef } from 'react'
import type { FeedItem } from '../lib/types'

export function useRealtimeFeed(limit = 20) {
  const [items, setItems] = useState<FeedItem[]>([])
  const [loading, setLoading] = useState(true)
  const [live, setLive] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const load = useCallback(async () => {
    try {
      const resp = await fetch(`/api/data/feed?limit=${limit}`)
      if (!resp.ok) return
      const data = await resp.json()
      if (Array.isArray(data) && data.length > 0) {
        setItems(data)
        setLive(true)
      }
    } catch {}
    setLoading(false)
  }, [limit])

  useEffect(() => {
    load()
    intervalRef.current = setInterval(load, 5000)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [load])

  return { items, loading, live }
}
