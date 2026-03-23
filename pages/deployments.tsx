import Head from 'next/head'
import { useState } from 'react'

const DEPLOYMENTS = [
  { name: 'anchor-counter',  ver: 'v0.3.1', id: '5ey8h4f...3fKm',    net: 'mainnet-beta', status: 'active',   deployed: '2024-03-15', upgradeable: true  },
  { name: 'nft-marketplace', ver: 'v1.2.0', id: 'BPFLoade...11111',   net: 'mainnet-beta', status: 'active',   deployed: '2024-03-10', upgradeable: true  },
  { name: 'token-staking',   ver: 'v2.0.0', id: 'TokenkegQ...feYYw',  net: 'devnet',       status: 'testing',  deployed: '2024-03-14', upgradeable: false },
  { name: 'dao-voting',      ver: 'v0.1.0', id: 'Gov1La8...gNDe',     net: 'devnet',       status: 'paused',   deployed: '2024-03-12', upgradeable: true  },
  { name: 'liquidity-pool',  ver: 'v3.1.2', id: 'whirLbMi...Raq5',    net: 'mainnet-beta', status: 'active',   deployed: '2024-02-28', upgradeable: true  },
]

const STATUS_CLASS: Record<string, string> = {
  active: 'badge-success',
  testing: 'badge-warning',
  paused: 'badge-neutral',
  failed: 'badge-error',
}

export default function Deployments() {
  const [search, setSearch] = useState('')
  const [net, setNet] = useState('all')

  const filtered = DEPLOYMENTS.filter(d =>
    (net === 'all' || d.net === net) &&
    (d.name.toLowerCase().includes(search.toLowerCase()) ||
     d.id.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <>
      <Head><title>bagsfm Studio — Deployments</title></Head>

      <div className="page-header">
        <h1 className="page-title">Deployments</h1>
        <p className="page-subtitle">Track and manage your deployed Solana programs</p>
      </div>

      {/* Stats */}
      <div className="grid grid-4" style={{ marginBottom: 20 }}>
        {[
          { label: 'Total Programs', value: DEPLOYMENTS.length.toString() },
          { label: 'On Mainnet',     value: DEPLOYMENTS.filter(d => d.net === 'mainnet-beta').length.toString() },
          { label: 'Active',         value: DEPLOYMENTS.filter(d => d.status === 'active').length.toString() },
          { label: 'Upgradeable',    value: DEPLOYMENTS.filter(d => d.upgradeable).length.toString() },
        ].map(s => (
          <div key={s.label} className="card">
            <div className="card-title">{s.label}</div>
            <div className="stat-value">{s.value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          <input
            className="input"
            style={{ maxWidth: 300, flex: '1 1 200px' }}
            placeholder="Search by name or program ID…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select
            className="input"
            style={{ maxWidth: 180, flex: '0 0 auto' }}
            value={net}
            onChange={e => setNet(e.target.value)}
          >
            <option value="all">All Networks</option>
            <option value="mainnet-beta">Mainnet</option>
            <option value="devnet">Devnet</option>
          </select>
          <button className="btn btn-primary" style={{ marginLeft: 'auto' }}>
            + New Deployment
          </button>
        </div>
      </div>

      {/* Desktop table */}
      <div className="card show-desktop" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Program</th>
                <th>Version</th>
                <th>Program ID</th>
                <th>Network</th>
                <th>Deployed</th>
                <th>Upgradeable</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(d => (
                <tr key={d.name} style={{ cursor: 'pointer' }}>
                  <td style={{ fontWeight: 700, color: 'var(--text)', fontFamily: 'monospace', fontSize: 13 }}>{d.name}</td>
                  <td style={{ color: 'var(--text-2)' }}>{d.ver}</td>
                  <td className="hash">{d.id}</td>
                  <td>
                    <span className={`badge ${d.net === 'mainnet-beta' ? 'badge-accent' : 'badge-neutral'}`}>
                      {d.net === 'mainnet-beta' ? 'mainnet' : 'devnet'}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-3)', fontSize: 12 }}>{d.deployed}</td>
                  <td>
                    <span className={`badge ${d.upgradeable ? 'badge-success' : 'badge-neutral'}`}>
                      {d.upgradeable ? 'yes' : 'no'}
                    </span>
                  </td>
                  <td><span className={`badge ${STATUS_CLASS[d.status]}`}>{d.status}</span></td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: 40, color: 'var(--text-3)' }}>
                    No deployments found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile card list */}
      <div className="show-mobile" style={{ flexDirection: 'column', gap: 10 }}>
        {filtered.map(d => (
          <div key={d.name + '-mob'} className="mobile-card" style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontFamily: 'monospace', fontSize: 14, marginBottom: 6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {d.name}
              </div>
              <div className="hash" style={{ marginBottom: 8, fontSize: 11 }}>{d.id}</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                <span className={`badge ${d.net === 'mainnet-beta' ? 'badge-accent' : 'badge-neutral'}`}>
                  {d.net === 'mainnet-beta' ? 'mainnet' : 'devnet'}
                </span>
                <span className={`badge ${STATUS_CLASS[d.status]}`}>{d.status}</span>
                {d.upgradeable && <span className="badge badge-success">upgradeable</span>}
              </div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontWeight: 700, color: 'var(--green)' }}>{d.ver}</div>
              <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 4 }}>{d.deployed}</div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="card" style={{ textAlign: 'center', padding: 40, color: 'var(--text-3)' }}>
            No deployments found
          </div>
        )}
      </div>

    </>
  )
}
