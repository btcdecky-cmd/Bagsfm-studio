import { useState, useEffect } from 'react'
import { useRealtimeFeed } from '../hooks/useRealtimeFeed'
import type { FeedItem } from '../lib/types'

const ACTION_ICONS: Record<string, string> = {
  deploy:    '⚡',
  token:     '🪙',
  nft:       '🎨',
  vote:      '⭐',
  update:    '🔄',
  follow:    '👤',
  milestone: '🏆',
}

const ACTION_COLORS: Record<string, string> = {
  deploy:    '#00ff88',
  token:     '#fbbf24',
  nft:       '#a78bfa',
  vote:      '#60a5fa',
  update:    '#9ca3af',
  follow:    '#34d399',
  milestone: '#f59e0b',
}

function timeAgo(ts: string) {
  const s = Math.floor((Date.now() - new Date(ts).getTime()) / 1000)
  if (s < 60) return `${s}s ago`
  if (s < 3600) return `${Math.floor(s / 60)}m ago`
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`
  return `${Math.floor(s / 86400)}d ago`
}

function FeedRow({ item, isNew }: { item: FeedItem; isNew: boolean }) {
  const [flash, setFlash] = useState(isNew)

  useEffect(() => {
    if (!isNew) return
    const t = setTimeout(() => setFlash(false), 2000)
    return () => clearTimeout(t)
  }, [isNew])

  return (
    <div style={{
      display: 'flex', gap: '12px', padding: '12px 0',
      borderBottom: '1px solid var(--bg-hover)',
      animation: flash ? 'feedFlash 2s ease-out forwards' : 'none',
    }}>
      <div style={{
        width: '32px', height: '32px', borderRadius: '50%',
        background: 'var(--bg-hover)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '15px', flexShrink: 0,
        border: `1px solid ${ACTION_COLORS[item.action_type] ?? '#333'}22`,
      }}>
        {ACTION_ICONS[item.action_type] ?? '•'}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          <span style={{ fontWeight: 600, fontSize: '13px', color: 'var(--green)' }}>{item.author}</span>
          {item.project_name && (
            <>
              <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>in</span>
              <span style={{
                fontSize: '11px', padding: '1px 7px', borderRadius: '999px',
                background: `${ACTION_COLORS[item.action_type] ?? '#333'}22`,
                color: ACTION_COLORS[item.action_type] ?? '#888',
                fontWeight: 600,
              }}>{item.project_name}</span>
            </>
          )}
        </div>
        <div style={{ fontSize: '13px', marginTop: '3px', fontWeight: 500 }}>{item.title}</div>
        {item.description && (
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px', lineHeight: 1.4 }}>
            {item.description}
          </div>
        )}
        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>{timeAgo(item.created_at)}</div>
      </div>
    </div>
  )
}

export default function LiveFeed({ limit = 10 }: { limit?: number }) {
  const { items, loading, live } = useRealtimeFeed(limit)
  const [newIds, setNewIds] = useState<Set<string>>(new Set())
  const [prevFirst, setPrevFirst] = useState<string | null>(null)

  useEffect(() => {
    if (items.length > 0 && prevFirst && items[0].id !== prevFirst) {
      setNewIds(new Set([items[0].id]))
      const t = setTimeout(() => setNewIds(new Set()), 3000)
      return () => clearTimeout(t)
    }
    if (items.length > 0) setPrevFirst(items[0].id)
  }, [items, prevFirst])

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
        <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Builder Feed</span>
        <span style={{
          display: 'flex', alignItems: 'center', gap: '5px',
          fontSize: '11px',
          color: live ? 'var(--green)' : 'var(--text-muted)',
        }}>
          <span style={{
            width: '6px', height: '6px', borderRadius: '50%',
            background: live ? 'var(--green)' : '#555',
            animation: live ? 'pulse 2s infinite' : 'none',
          }} />
          {live ? 'LIVE' : 'DEMO'}
        </span>
      </div>

      {loading ? (
        <div style={{ padding: '24px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: '14px' }}>Loading feed…</div>
      ) : (
        items.slice(0, limit).map(item => (
          <FeedRow key={item.id} item={item} isNew={newIds.has(item.id)} />
        ))
      )}

      <style>{`
        @keyframes feedFlash {
          0%   { background: rgba(0,255,136,0.12); }
          100% { background: transparent; }
        }
      `}</style>
    </div>
  )
}
