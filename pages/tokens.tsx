import Head from 'next/head'
import { useState } from 'react'

const TOKENS = [
  { sym: 'SOL',  name: 'Solana',       price: '$119.87', change: '+4.2%', up: true,  vol: '$1.2B',  mcap: '$55.8B', holders: '2.1M' },
  { sym: 'USDC', name: 'USD Coin',     price: '$1.00',   change: '0.0%', up: true,  vol: '$892M',  mcap: '$31.2B', holders: '8.4M' },
  { sym: 'RAY',  name: 'Raydium',      price: '$2.18',   change: '+6.7%', up: true,  vol: '$148M',  mcap: '$620M',  holders: '390K' },
  { sym: 'JTO',  name: 'Jito',         price: '$3.00',   change: '+1.8%', up: true,  vol: '$84M',   mcap: '$400M',  holders: '210K' },
  { sym: 'BONK', name: 'Bonk',         price: '$0.00001',change: '-2.1%', up: false, vol: '$62M',   mcap: '$680M',  holders: '1.1M' },
  { sym: 'WIF',  name: 'dogwifhat',    price: '$1.80',   change: '-0.7%', up: false, vol: '$210M',  mcap: '$1.8B',  holders: '480K' },
  { sym: 'JUP',  name: 'Jupiter',      price: '$0.82',   change: '+3.4%', up: true,  vol: '$97M',   mcap: '$1.1B',  holders: '620K' },
  { sym: 'PYTH', name: 'Pyth Network', price: '$0.31',   change: '-1.2%', up: false, vol: '$43M',   mcap: '$480M',  holders: '170K' },
  { sym: 'ORCA', name: 'Orca',         price: '$2.91',   change: '+2.0%', up: true,  vol: '$29M',   mcap: '$210M',  holders: '95K'  },
  { sym: 'MNGO', name: 'Mango',        price: '$0.014',  change: '-3.8%', up: false, vol: '$18M',   mcap: '$42M',   holders: '78K'  },
]

export default function Tokens() {
  const [search, setSearch] = useState('')

  const filtered = TOKENS.filter(t =>
    t.sym.toLowerCase().includes(search.toLowerCase()) ||
    t.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <Head><title>bagsfm Studio — Tokens</title></Head>

      <div className="page-header">
        <h1 className="page-title">Tokens</h1>
        <p className="page-subtitle">Solana token market overview and analytics</p>
      </div>

      <div className="grid grid-4" style={{ marginBottom: 20 }}>
        {[
          { label: 'Tracked Tokens', value: TOKENS.length.toString() },
          { label: 'Gainers Today',  value: TOKENS.filter(t => t.up).length.toString() },
          { label: 'Losers Today',   value: TOKENS.filter(t => !t.up).length.toString() },
          { label: '24h Volume',     value: '$2.9B' },
        ].map(s => (
          <div key={s.label} className={`card ${s.label === 'Gainers Today' ? 'card-green' : ''}`}>
            <div className="card-title">{s.label}</div>
            <div className="stat-value">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <input className="input" style={{ maxWidth: 320 }} placeholder="Search tokens…" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {/* Mobile */}
      <div className="show-mobile" style={{ flexDirection: 'column', gap: 10 }}>
        {filtered.map((t, i) => (
          <div key={t.sym} className="mobile-card" style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
            <div style={{ fontSize: 16, fontWeight: 900, color: 'var(--text-3)', minWidth: 28, fontFamily: 'monospace' }}>#{i+1}</div>
            <div style={{
              width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
              background: 'var(--green-subtle)', border: '1px solid var(--green-border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 900, fontSize: 11, color: 'var(--green)', letterSpacing: '-0.5px',
            }}>{t.sym.slice(0,3)}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 14 }}>{t.sym}</div>
              <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{t.name}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 700, fontSize: 14 }}>{t.price}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: t.up ? 'var(--green)' : 'var(--red)', marginTop: 2 }}>{t.change}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop */}
      <div className="card show-desktop" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>#</th><th>Token</th><th>Price</th><th>24h Change</th><th>24h Volume</th><th>Market Cap</th><th>Holders</th></tr></thead>
            <tbody>
              {filtered.map((t, i) => (
                <tr key={t.sym}>
                  <td style={{ color: 'var(--text-3)', fontSize: 12 }}>{i+1}</td>
                  <td>
                    <div style={{ fontWeight: 700, color: 'var(--text)' }}>{t.sym}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{t.name}</div>
                  </td>
                  <td style={{ fontWeight: 700 }}>{t.price}</td>
                  <td style={{ fontWeight: 700, color: t.up ? 'var(--green)' : 'var(--red)' }}>{t.change}</td>
                  <td>{t.vol}</td>
                  <td>{t.mcap}</td>
                  <td>{t.holders}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </>
  )
}
