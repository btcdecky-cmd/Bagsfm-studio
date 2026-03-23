import { useState, useRef, useEffect } from 'react'
import { useNotifications } from '../hooks/useNotifications'
import type { Notification } from '../lib/types'

const TYPE_ICONS: Record<string, string> = {
  deploy: '⚡',
  vote: '⭐',
  follow: '👤',
  event: '🔔',
  milestone: '🏆',
}

function timeAgo(ts: string) {
  const s = Math.floor((Date.now() - new Date(ts).getTime()) / 1000)
  if (s < 60) return `${s}s ago`
  if (s < 3600) return `${Math.floor(s / 60)}m ago`
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`
  return `${Math.floor(s / 86400)}d ago`
}

export default function NotificationBell() {
  const { notifications, unread, markRead, markAllRead } = useNotifications()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [])

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          padding: '6px', borderRadius: '8px', position: 'relative',
          color: 'var(--text-muted)', display: 'flex', alignItems: 'center',
          transition: 'color 0.2s',
        }}
        onMouseEnter={e => (e.currentTarget.style.color = 'var(--green)')}
        onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
        {unread > 0 && (
          <span style={{
            position: 'absolute', top: '2px', right: '2px',
            background: 'var(--green)', color: '#000',
            fontSize: '10px', fontWeight: 700,
            borderRadius: '999px', minWidth: '16px', height: '16px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '0 3px', lineHeight: 1,
          }}>
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div style={{
          position: 'absolute', right: 0, top: 'calc(100% + 8px)',
          width: '340px', maxHeight: '420px',
          background: 'var(--bg-card)', border: '1px solid var(--green-border)',
          borderRadius: '12px', overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(0,255,136,0.12)',
          zIndex: 200,
        }}>
          <div style={{
            padding: '12px 16px', borderBottom: '1px solid var(--bg-hover)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <span style={{ fontWeight: 600, fontSize: '14px' }}>Notifications</span>
            {unread > 0 && (
              <button onClick={markAllRead} style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--green)', fontSize: '12px', padding: 0,
              }}>
                Mark all read
              </button>
            )}
          </div>

          <div style={{ overflowY: 'auto', maxHeight: '360px' }}>
            {notifications.length === 0 ? (
              <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '14px' }}>
                No notifications yet
              </div>
            ) : notifications.map((n: Notification) => (
              <div
                key={n.id}
                onClick={() => markRead(n.id)}
                style={{
                  padding: '12px 16px', cursor: 'pointer',
                  borderBottom: '1px solid var(--bg-hover)',
                  background: n.read ? 'transparent' : 'rgba(0,255,136,0.04)',
                  display: 'flex', gap: '10px', alignItems: 'flex-start',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-hover)')}
                onMouseLeave={e => (e.currentTarget.style.background = n.read ? 'transparent' : 'rgba(0,255,136,0.04)')}
              >
                <span style={{ fontSize: '18px', marginTop: '1px' }}>{TYPE_ICONS[n.type] ?? '🔔'}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontWeight: n.read ? 400 : 600, fontSize: '13px' }}>{n.title}</span>
                    {!n.read && (
                      <span style={{
                        width: '6px', height: '6px', borderRadius: '50%',
                        background: 'var(--green)', flexShrink: 0,
                      }} />
                    )}
                  </div>
                  {n.message && (
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{n.message}</div>
                  )}
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>{timeAgo(n.created_at)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
