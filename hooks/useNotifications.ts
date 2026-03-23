import { useEffect, useState, useCallback, useRef } from 'react'
import type { Notification } from '../lib/types'

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [live, setLive] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const unread = notifications.filter(n => !n.read).length

  const load = useCallback(async () => {
    try {
      const resp = await fetch('/api/data/notifications')
      if (!resp.ok) return
      const data = await resp.json()
      if (Array.isArray(data) && data.length > 0) {
        setNotifications(data)
        setLive(true)
      }
    } catch {}
  }, [])

  const markRead = useCallback(async (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
    try { await fetch('/api/data/notifications', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) }) } catch {}
  }, [])

  const markAllRead = useCallback(async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    try { await fetch('/api/data/notifications', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ markAll: true }) }) } catch {}
  }, [])

  useEffect(() => {
    load()
    intervalRef.current = setInterval(load, 8000)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [load])

  return { notifications, unread, live, markRead, markAllRead }
}
