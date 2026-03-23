import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect, useCallback, useRef } from 'react'
import { IconDeployments, IconBuilder, IconShowcase, IconEvents } from '../components/Icons'
import LiveFeed from '../components/LiveFeed'
import type { Project } from '../lib/types'

const DEFAULT_PROJECTS: { name: string; cat: string; status: string; net: string; last: string; txns: number; votes: number }[] = []

const ACTIONS = [
  { label: 'Deployments',      href: '/deployments', Icon: IconDeployments },
  { label: 'Explore Builders', href: '/showcase',    Icon: IconShowcase    },
  { label: 'Activity Feed',    href: '/events',      Icon: IconEvents      },
  { label: 'AI Builder',       href: '/builder',     Icon: IconBuilder     },
]

export default function Dashboard() {
  const [modal, setModal] = useState(false)
  const [projects, setProjects] = useState(DEFAULT_PROJECTS)
  const [stats, setStats] = useState({ votes: 154, calls: 87521, followers: 320, deploys: 14 })
  const [live, setLive] = useState(false)

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const loadProjects = useCallback(async () => {
    try {
      const resp = await fetch('/api/data/projects?limit=5')
      if (!resp.ok) return
      const data: Project[] = await resp.json()
      if (data.length > 0) {
        setProjects(data.map((p: Project) => ({
          name: p.name, cat: p.category, status: p.status, net: p.network,
          last: timeAgo(p.updated_at), txns: p.tx_count, votes: p.votes,
        })))
        setStats({
          votes: data.reduce((s: number, p: Project) => s + p.votes, 0),
          calls: data.reduce((s: number, p: Project) => s + p.tx_count, 0),
          followers: 320,
          deploys: data.length,
        })
        setLive(true)
      }
    } catch {}
  }, [])

  useEffect(() => {
    loadProjects()
    intervalRef.current = setInterval(loadProjects, 8000)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [loadProjects])

  const ANALYTICS = [
    { label: 'Total Votes',   value: stats.votes.toLocaleString(),   change: '+16 this week', up: true  },
    { label: 'Program Calls', value: stats.calls.toLocaleString(),   change: '+2,310 today',  up: true  },
    { label: 'Followers',     value: stats.followers.toLocaleString(), change: '+24 this week', up: true  },
    { label: 'Deploys',       value: stats.deploys.toString(),        change: '3 pending',     up: false },
  ]

  return (
    <>
      <Head><title>bagsfm Studio — Dashboard</title></Head>

      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
          onClick={() => setModal(false)}>
          <div className="card" style={{ width: '100%', maxWidth: 480, padding: 28 }} onClick={e => e.stopPropagation()}>
            <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 6 }}>Create New Project</div>
            <div className="green-line" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div><label className="label">Project Name</label><input className="input" placeholder="e.g. My Solana DeFi Protocol" /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label className="label">Category</label>
                  <select className="input">
                    {['DeFi','NFT','DAO','Gaming','Infrastructure','Staking'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Network</label>
                  <select className="input">
                    <option value="devnet">Devnet</option>
                    <option value="mainnet-beta">Mainnet</option>
                  </select>
                </div>
              </div>
              <div><label className="label">Description</label><textarea className="input" style={{ minHeight: 80, resize: 'vertical' }} placeholder="What are you building?" /></div>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => setModal(false)}>Create Project</button>
              <button className="btn btn-secondary" onClick={() => setModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 className="page-title">Developer Dashboard</h1>
          <p className="page-subtitle">
            Manage your projects, track activity, and monitor your progress.
            {live && (
              <span style={{ marginLeft: 8, display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green)', display: 'inline-block', animation: 'pulsate 2s infinite' }} />
                <span style={{ color: 'var(--green)', fontWeight: 600 }}>LIVE</span>
              </span>
            )}
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setModal(true)}>+ New Project</button>
      </div>

      <div className="grid grid-4" style={{ marginBottom: 20 }}>
        {ANALYTICS.map(a => (
          <div key={a.label} className={`card${a.label === 'Total Votes' ? ' card-green' : ''}`}>
            <div className="card-title">{a.label}</div>
            <div className="stat-value">{a.value}</div>
            <div className={`stat-change ${a.up ? 'up' : 'down'}`}>{a.change}</div>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-title" style={{ marginBottom: 12 }}>Quick Actions</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 10 }}>
          <button className="btn btn-primary" style={{ flexDirection: 'column', gap: 6, height: 72, fontSize: 12 }} onClick={() => setModal(true)}>
            <span style={{ fontSize: 20 }}>+</span>Create Project
          </button>
          {ACTIONS.map(({ label, href, Icon }) => (
            <Link key={label} href={href} className="btn btn-secondary" style={{ flexDirection: 'column', gap: 6, height: 72, fontSize: 12 }}>
              <Icon size={20} />
              {label}
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-2" style={{ marginBottom: 20 }}>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div className="card-title" style={{ marginBottom: 0 }}>Your Projects</div>
            <Link href="/deployments" style={{ fontSize: 12, color: 'var(--green)', fontWeight: 600 }}>View all →</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {projects.map(p => (
              <div key={p.name} style={{
                padding: '14px 16px', borderRadius: 10,
                background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12,
              }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    <span className={`badge ${p.net === 'mainnet-beta' ? 'badge-success' : 'badge-warning'}`}>{p.net === 'mainnet-beta' ? 'mainnet' : 'devnet'}</span>
                    <span className={`badge ${p.status === 'active' ? 'badge-success' : 'badge-neutral'}`}>{p.status}</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontWeight: 700, color: 'var(--green)', fontSize: 15 }}>{p.txns.toLocaleString()}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>txns · {p.last}</div>
                </div>
              </div>
            ))}
            <button className="btn btn-secondary btn-block" style={{ fontSize: 13, marginTop: 2 }} onClick={() => setModal(true)}>+ Add project</button>
          </div>
        </div>

        <div className="card">
          <LiveFeed limit={7} />
        </div>
      </div>

      <div className="grid grid-2">
        <div className="card">
          <div className="card-title" style={{ marginBottom: 16 }}>Project Analytics</div>
          {projects.map(p => (
            <div key={p.name} style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8 }}>
                <span style={{ fontWeight: 700 }}>{p.name}</span>
                <span style={{ color: 'var(--green)', fontWeight: 700 }}>{p.txns.toLocaleString()} txns</span>
              </div>
              <div style={{ height: 8, background: 'var(--bg-elevated)', borderRadius: 99, overflow: 'hidden', marginBottom: 8 }}>
                <div style={{
                  height: '100%', borderRadius: 99,
                  background: 'linear-gradient(90deg, var(--green), var(--green-deep))',
                  width: `${Math.min((p.txns / 100000) * 100, 100)}%`,
                  boxShadow: '0 0 8px rgba(0,255,136,0.4)',
                  transition: 'width 0.6s ease',
                }} />
              </div>
              <div style={{ display: 'flex', gap: 14, fontSize: 11, color: 'var(--text-3)' }}>
                <span>{p.votes} votes</span>
                <span>Last active {p.last}</span>
                <span className={`badge ${p.status === 'active' ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: 10 }}>{p.status}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div className="card-title" style={{ marginBottom: 0 }}>On-Chain Pulse</div>
            <Link href="/events" style={{ fontSize: 12, color: 'var(--green)', fontWeight: 600 }}>Events →</Link>
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { type: 'SWAP',       prog: 'SolSwap AMM',       amt: '12,450 USDC → 48.2 SOL', time: '8s ago',  color: '#00ff88' },
              { type: 'STAKE',      prog: 'Token Staking',      amt: '5,000 $TSOL staked',     time: '22s ago', color: '#60a5fa' },
              { type: 'NFT_MINT',   prog: 'PixelDao',           amt: 'NFT #4821 minted',       time: '45s ago', color: '#a78bfa' },
              { type: 'LIQUIDITY',  prog: 'LiquidityPool Pro',  amt: '250K USDC added',        time: '1m ago',  color: '#fbbf24' },
              { type: 'VOTE',       prog: 'SolDAO',             amt: 'Proposal #14 — YES',     time: '3m ago',  color: '#fb923c' },
            ].map((e, i) => (
              <div key={i} style={{
                display: 'flex', gap: 10, alignItems: 'center',
                padding: '8px 10px', borderRadius: 8,
                background: 'var(--bg-elevated)', border: '1px solid var(--border)',
              }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 6,
                  background: e.color + '18', border: `1px solid ${e.color}33`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 9, fontWeight: 800, color: e.color, flexShrink: 0,
                }}>
                  {e.type.slice(0, 2)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 600 }}>{e.amt}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-3)' }}>{e.prog}</div>
                </div>
                <div style={{ fontSize: 10, color: 'var(--text-3)', flexShrink: 0 }}>{e.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

function timeAgo(ts: string) {
  const s = Math.floor((Date.now() - new Date(ts).getTime()) / 1000)
  if (s < 60) return `${s}s ago`
  if (s < 3600) return `${Math.floor(s / 60)}m ago`
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`
  return `${Math.floor(s / 86400)}d ago`
}
