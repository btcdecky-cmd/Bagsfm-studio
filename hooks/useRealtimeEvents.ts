import { useEffect, useState, useCallback, useRef } from 'react'
import type { OnChainEvent } from '../lib/types'

const EVENT_COLORS: Record<string, string> = {
  SWAP: '#00ff88',
  STAKE: '#60a5fa',
  NFT_MINT: '#a78bfa',
  LIQUIDITY: '#fbbf24',
  VOTE: '#fb923c',
  TOKEN_CREATE: '#34d399',
  DEPLOY: '#f472b6',
}

export function eventColor(type: string) {
  return EVENT_COLORS[type] ?? '#888'
}

export function useRealtimeEvents(limit = 50) {
  const [events, setEvents] = useState<OnChainEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [live, setLive] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const load = useCallback(async () => {
    try {
      const resp = await fetch(`/api/data/events?limit=${limit}`)
      if (!resp.ok) return
      const data = await resp.json()
      if (Array.isArray(data) && data.length > 0) {
        setEvents(data)
        setLive(true)
      }
    } catch {}
    setLoading(false)
  }, [limit])

  useEffect(() => {
    load()
    intervalRef.current = setInterval(load, 3000)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [load])

  return { events, loading, live }
}
