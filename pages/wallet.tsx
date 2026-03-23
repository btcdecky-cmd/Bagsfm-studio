import Head from 'next/head'
import { useState } from 'react'

const ADDR = 'DYw8jCTfwHNRJhhmFcbXvVDTqWMEVFBX6ZKUmG5CNSKH'

const TOKENS = [
  { sym: 'SOL',  name: 'Solana',   bal: '12.458',      val: '$1,493.36', change: '+4.2%', up: true  },
  { sym: 'USDC', name: 'USD Coin', bal: '2,840.00',    val: '$2,840.00', change: '0.0%',  up: true  },
  { sym: 'BONK', name: 'Bonk',     bal: '14,200,000',  val: '$142.00',   change: '-2.1%', up: false },
  { sym: 'JTO',  name: 'Jito',     bal: '85.5',        val: '$256.50',   change: '+1.8%', up: true  },
  { sym: 'WIF',  name: 'dogwifhat',bal: '210',         val: '$378.00',   change: '-0.7%', up: false },
]

const TXS = [
  { sig: '3TqP...hX9z', type: 'Received',       amount: '+2.5 SOL',   time: '2m ago',  ok: true  },
  { sig: 'Ax3L...w8Yz', type: 'Sent',           amount: '-0.1 SOL',   time: '18m ago', ok: true  },
  { sig: 'Nm7H...4Svb', type: 'Token Transfer', amount: '+500 USDC',  time: '1h ago',  ok: true  },
  { sig: 'Wq4T...9Plm', type: 'NFT Mint',       amount: '1 NFT',      time: '3h ago',  ok: true  },
  { sig: 'Bx6Y...2Pqr', type: 'Staking',        amount: '-50 SOL',    time: '1d ago',  ok: true  },
]

export default function Wallet() {
  const [copied, setCopied] = useState(false)
  const copy = () => { navigator.clipboard.writeText(ADDR); setCopied(true); setTimeout(() => setCopied(false), 2000) }

  return (
    <>
      <Head><title>bagsfm Studio — Wallet</title></Head>

      <div className="page-header">
        <h1 className="page-title">Wallet</h1>
        <p className="page-subtitle">Portfolio overview and transaction history</p>
      </div>

      {/* Portfolio card */}
      <div className="card card-green" style={{ marginBottom: 20, padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 20 }}>
          <div>
            <div className="card-title">Connected Wallet</div>
            <div className="hash" style={{ fontSize: 11, marginBottom: 14, wordBreak: 'break-all', maxWidth: 380 }}>{ADDR}</div>
            <button className="btn btn-secondary btn-sm" onClick={copy}>{copied ? '✓ Copied' : '⎘ Copy'}</button>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className="card-title">Total Portfolio</div>
            <div style={{ fontSize: 'clamp(28px,5vw,38px)', fontWeight: 900, letterSpacing: '-1.5px', color: 'var(--text)', lineHeight: 1 }}>$5,109.86</div>
            <div className="stat-change up" style={{ marginTop: 6 }}>+$198.34 (4.0%) today</div>
          </div>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-4" style={{ marginBottom: 20 }}>
        {[
          { label: 'Total Assets',    value: TOKENS.length.toString() },
          { label: 'Gainers',         value: TOKENS.filter(t => t.up).length.toString() },
          { label: 'Transactions',    value: TXS.length.toString() },
          { label: 'Active Since',    value: 'Mar 2024' },
        ].map(s => (
          <div key={s.label} className="card">
            <div className="card-title">{s.label}</div>
            <div className="stat-value">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-2">
        {/* Tokens */}
        <div className="card">
          <div className="card-title" style={{ marginBottom: 16 }}>Token Balances</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {TOKENS.map((t, i) => (
              <div key={t.sym} style={{
                display: 'flex', alignItems: 'center', gap: 14, padding: '13px 0',
                borderBottom: i < TOKENS.length - 1 ? '1px solid var(--border)' : 'none',
              }}>
                <div style={{
                  width: 38, height: 38, borderRadius: '50%', flexShrink: 0,
                  background: 'var(--green-subtle)', border: '1px solid var(--green-border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 900, fontSize: 10, color: 'var(--green)',
                }}>{t.sym.slice(0,3)}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{t.sym}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-3)', fontFamily: 'monospace', marginTop: 1 }}>{t.bal}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 700 }}>{t.val}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: t.up ? 'var(--green)' : 'var(--red)', marginTop: 2 }}>{t.change}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Transactions */}
        <div className="card">
          <div className="card-title" style={{ marginBottom: 16 }}>Recent Transactions</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {TXS.map((tx, i) => (
              <div key={tx.sig} style={{
                display: 'flex', alignItems: 'center', gap: 14, padding: '13px 0',
                borderBottom: i < TXS.length - 1 ? '1px solid var(--border)' : 'none',
              }}>
                <div style={{
                  width: 38, height: 38, borderRadius: '50%', flexShrink: 0,
                  background: tx.amount.startsWith('+') ? 'rgba(0,255,136,0.1)' : 'rgba(255,69,69,0.08)',
                  border: `1px solid ${tx.amount.startsWith('+') ? 'rgba(0,255,136,0.2)' : 'rgba(255,69,69,0.15)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 16, color: tx.amount.startsWith('+') ? 'var(--green)' : 'var(--red)',
                }}>
                  {tx.amount.startsWith('+') ? '↓' : tx.amount.startsWith('-') ? '↑' : '↔'}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{tx.type}</div>
                  <div className="hash" style={{ fontSize: 11, marginTop: 1 }}>{tx.sig}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{
                    fontWeight: 700, fontSize: 14,
                    color: tx.amount.startsWith('+') ? 'var(--green)' : tx.amount.startsWith('-') ? 'var(--red)' : 'var(--text)',
                  }}>{tx.amount}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>{tx.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
