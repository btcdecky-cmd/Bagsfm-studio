import Head from 'next/head'
import { useState } from 'react'

const PROGRAMS = [
  {
    name: 'anchor-counter', pid: '5ey8h4fGz3fKmQ7tPLr9Xu2VsBnWqDa1oYkJcHM8Npwv',
    fw: 'Anchor', ver: 'v0.3.1', net: 'mainnet-beta',
    ixs: ['initialize', 'increment', 'decrement', 'reset'],
    accounts: ['Counter'], last: '2m ago', txns: 18421,
  },
  {
    name: 'nft-marketplace', pid: 'BPFLoader2111111111111111111111111111111111',
    fw: 'Anchor', ver: 'v1.2.0', net: 'mainnet-beta',
    ixs: ['listNft', 'buyNft', 'cancelListing', 'updatePrice'],
    accounts: ['Marketplace', 'Listing', 'Escrow'], last: '14m ago', txns: 94032,
  },
  {
    name: 'token-staking', pid: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
    fw: 'Native', ver: 'v2.0.0', net: 'devnet',
    ixs: ['stake', 'unstake', 'claimRewards', 'updatePool'],
    accounts: ['StakePool', 'UserStake', 'RewardVault'], last: '1h ago', txns: 3210,
  },
]

export default function Programs() {
  const [selected, setSelected] = useState<typeof PROGRAMS[0] | null>(null)
  const [search, setSearch] = useState('')

  const filtered = PROGRAMS.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.pid.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <Head><title>bagsfm Studio — Programs</title></Head>

      <div className="page-header">
        <h1 className="page-title">Programs</h1>
        <p className="page-subtitle">Explore and inspect your deployed programs and IDLs</p>
      </div>

      <div className="grid grid-4" style={{ marginBottom: 20 }}>
        {[
          { label: 'Total Programs', value: PROGRAMS.length.toString() },
          { label: 'On Mainnet',     value: PROGRAMS.filter(p => p.net === 'mainnet-beta').length.toString() },
          { label: 'Anchor',         value: PROGRAMS.filter(p => p.fw === 'Anchor').length.toString() },
          { label: 'Total Txns',     value: PROGRAMS.reduce((s, p) => s + p.txns, 0).toLocaleString() },
        ].map(s => (
          <div key={s.label} className={`card ${s.label === 'Total Txns' ? 'card-green' : ''}`}>
            <div className="card-title">{s.label}</div>
            <div className="stat-value">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="programs-grid" style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 1fr' : '1fr', gap: 16 }}>
        <div>
          <div className="card" style={{ marginBottom: 14 }}>
            <input className="input" placeholder="Search programs…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filtered.map(p => (
              <div key={p.name} className="card" onClick={() => setSelected(selected?.name === p.name ? null : p)}
                style={{ cursor: 'pointer', borderColor: selected?.name === p.name ? 'var(--green-border)' : 'var(--border)', borderLeft: selected?.name === p.name ? '3px solid var(--green)' : '1px solid var(--border)', background: selected?.name === p.name ? 'var(--green-subtle)' : 'var(--bg-card)', transition: 'all 0.15s' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 15, fontFamily: 'monospace', marginBottom: 4 }}>{p.name}</div>
                    <div className="hash" style={{ fontSize: 11 }}>{p.pid.slice(0,22)}…</div>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <span className="badge badge-accent">{p.fw}</span>
                    <span className={`badge ${p.net === 'mainnet-beta' ? 'badge-success' : 'badge-warning'}`}>{p.net === 'mainnet-beta' ? 'mainnet' : 'devnet'}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 24, fontSize: 13 }}>
                  {[
                    { l: 'Instructions', v: p.ixs.length },
                    { l: 'Accounts', v: p.accounts.length },
                    { l: 'Transactions', v: p.txns.toLocaleString() },
                    { l: 'Last Activity', v: p.last },
                  ].map(item => (
                    <div key={item.l}>
                      <div style={{ fontSize: 10, color: 'var(--text-3)', marginBottom: 2, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>{item.l}</div>
                      <div style={{ fontWeight: 700, color: 'var(--text)' }}>{item.v}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {selected && (
          <div className="card" style={{ height: 'fit-content', position: 'sticky', top: 80, borderColor: 'var(--green-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <div style={{ fontWeight: 800, fontSize: 16, fontFamily: 'monospace' }}>{selected.name}</div>
              <button className="btn btn-ghost btn-sm" onClick={() => setSelected(null)}>✕</button>
            </div>
            <div className="green-line" />
            <div style={{ marginBottom: 16 }}>
              <div className="card-title">Program ID</div>
              <div className="hash" style={{ fontSize: 11, wordBreak: 'break-all' }}>{selected.pid}</div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <div className="card-title" style={{ marginBottom: 10 }}>Instructions</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {selected.ixs.map(ix => (
                  <div key={ix} style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 8, padding: '9px 12px', fontSize: 12, fontFamily: 'monospace', color: 'var(--green)', borderLeft: '2px solid var(--green)' }}>
                    fn {ix}(ctx: Context) → Result
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="card-title" style={{ marginBottom: 10 }}>Account Types</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {selected.accounts.map(a => <span key={a} className="badge badge-accent">{a}</span>)}
              </div>
            </div>
          </div>
        )}
      </div>

    </>
  )
}
