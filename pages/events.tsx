import Head from 'next/head'
import { useState } from 'react'
import { useRealtimeEvents, eventColor } from '../hooks/useRealtimeEvents'

const TYPE_BADGE: Record<string, string> = {
  SWAP:         'badge-success',
  STAKE:        'badge-accent',
  NFT_MINT:     'badge-warning',
  LIQUIDITY:    'badge-warning',
  VOTE:         'badge-accent',
  TOKEN_CREATE: 'badge-success',
  DEPLOY:       'badge-error',
  PROGRAM_DEPLOY: 'badge-error',
  UNKNOWN:      'badge-neutral',
}

function timeAgo(ts: string) {
  const s = Math.floor((Date.now() - new Date(ts).getTime()) / 1000)
  if (s < 5)   return 'just now'
  if (s < 60)  return `${s}s ago`
  if (s < 3600) return `${Math.floor(s / 60)}m ago`
  return `${Math.floor(s / 3600)}h ago`
}

export default function Events() {
  const { events, loading, live } = useRealtimeEvents(60)
  const [typeFilter, setTypeFilter] = useState('all')

  const allTypes = Array.from(new Set(events.map(e => e.type)))
  const filtered = typeFilter === 'all' ? events : events.filter(e => e.type === typeFilter)

  const finalized = events.filter(e => e.status === 'finalized').length
  const confirmed = events.filter(e => e.status === 'confirmed').length

  return (
    <>
      <Head><title>bagsfm Studio — On-Chain Events</title></Head>

      <div className="page-header">
        <div>
          <h1 className="page-title">On-Chain Events</h1>
          <p className="page-subtitle">
            Live Solana activity via Helius webhooks
            {live && (
              <span style={{ marginLeft: 8, display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green)', display: 'inline-block', animation: 'pulse 2s infinite' }} />
                <span style={{ color: 'var(--green)', fontWeight: 600 }}>LIVE — Database connected</span>
              </span>
            )}
          </p>
        </div>
      </div>

      <div className="grid grid-4" style={{ marginBottom: 20 }}>
        {[
          { label: 'Total Events', value: events.length.toString(), sub: 'in feed', green: true },
          { label: 'Finalized',    value: finalized.toString(),     sub: `${events.length ? Math.round(finalized / events.length * 100) : 0}%` },
          { label: 'Confirmed',    value: confirmed.toString(),      sub: 'pending finality' },
          { label: 'Event Types',  value: allTypes.length.toString(), sub: 'distinct types' },
        ].map(s => (
          <div key={s.label} className={`card ${s.green ? 'card-green' : ''}`}>
            <div className="card-title">{s.label}</div>
            <div className="stat-value">{s.value}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', flex: 1 }}>
            {['all', ...allTypes].map(t => (
              <button
                key={t}
                className={`btn btn-sm ${typeFilter === t ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setTypeFilter(t)}
                style={typeFilter !== t && t !== 'all' ? { borderColor: eventColor(t) + '44', color: eventColor(t) } : {}}
              >
                {t === 'all' ? 'All Types' : t.replace(/_/g, ' ')}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
            <span style={{
              width: 8, height: 8, borderRadius: '50%',
              background: live ? 'var(--green)' : '#555',
              display: 'inline-block',
              animation: live ? 'pulse 2s infinite' : 'none',
            }} />
            <span style={{ fontSize: 12, color: live ? 'var(--green)' : 'var(--text-muted)', fontWeight: 600 }}>
              {live ? 'LIVE' : 'DEMO'}
            </span>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="card" style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>
          Loading events…
        </div>
      ) : (
        <>
          {/* Mobile cards */}
          <div className="show-mobile" style={{ flexDirection: 'column', gap: 8 }}>
            {filtered.slice(0, 25).map(e => (
              <div key={e.id} className="mobile-card" style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 8,
                  background: eventColor(e.type) + '18',
                  border: `1px solid ${eventColor(e.type)}44`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 700, color: eventColor(e.type),
                  flexShrink: 0,
                }}>
                  {e.type.slice(0, 2)}
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 4, flexWrap: 'wrap' }}>
                    <span className={`badge ${TYPE_BADGE[e.type] ?? 'badge-neutral'}`}>{e.type.replace(/_/g, ' ')}</span>
                    <span className={`badge ${e.status === 'finalized' ? 'badge-success' : 'badge-warning'}`}>{e.status}</span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-2)', marginBottom: 3 }}>{e.program ?? '—'}</div>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <span className="hash">{e.signature?.slice(0, 12) ?? '—'}…</span>
                    {e.amount && <span style={{ fontSize: 12, color: 'var(--green)', fontWeight: 600 }}>{e.amount}</span>}
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: 11, fontFamily: 'monospace', color: 'var(--text-3)' }}>{e.slot?.toLocaleString() ?? '—'}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 3 }}>{timeAgo(e.created_at)}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop table */}
          <div className="card show-desktop" style={{ padding: 0, overflow: 'hidden' }}>
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Type</th><th>Program</th><th>Signature</th>
                    <th>Amount</th><th>Slot</th><th>Age</th><th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(e => (
                    <tr key={e.id} style={{ borderLeft: `3px solid ${eventColor(e.type)}44` }}>
                      <td>
                        <span className={`badge ${TYPE_BADGE[e.type] ?? 'badge-neutral'}`} style={{ borderColor: eventColor(e.type) + '55' }}>
                          {e.type.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td style={{ fontSize: 12 }}>{e.program ?? '—'}</td>
                      <td className="hash">{e.signature?.slice(0, 14) ?? '—'}…</td>
                      <td style={{ color: 'var(--green)', fontWeight: 600, fontSize: 12 }}>{e.amount ?? '—'}</td>
                      <td style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--text-3)' }}>{e.slot?.toLocaleString() ?? '—'}</td>
                      <td style={{ fontSize: 11, color: 'var(--text-3)' }}>{timeAgo(e.created_at)}</td>
                      <td><span className={`badge ${e.status === 'finalized' ? 'badge-success' : 'badge-warning'}`}>{e.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {!live && (
        <div style={{
          marginTop: 16, padding: '12px 16px', borderRadius: 10,
          background: 'rgba(0,255,136,0.06)', border: '1px solid var(--green-border)',
          fontSize: 13, color: 'var(--text-muted)',
        }}>
          <strong style={{ color: 'var(--green)' }}>Connect Helius</strong> to receive live on-chain events.
          Point your Helius webhook to <code style={{ color: 'var(--green)' }}>POST /api/webhook/helius</code> to stream transaction data.
        </div>
      )}
    </>
  )
}
