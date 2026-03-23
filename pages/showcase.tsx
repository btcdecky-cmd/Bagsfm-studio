import Head from 'next/head'
import { useState } from 'react'

type Project = { id: number; name: string; desc: string; author: string; cat: string; tags: string[]; votes: number; voted: boolean; date: string; net: 'mainnet-beta' | 'devnet'; pid: string; txCount: number }

const INITIAL: Project[] = [
  { id: 1, name: 'SolSwap AMM',      desc: 'Constant-product AMM with concentrated liquidity and dynamic fees. Supports any SPL token pair.',   author: 'cryptodev.sol',  cat: 'DeFi',    tags: ['AMM','DeFi','Liquidity'], votes: 142, voted: false, date: '2024-03-14', net: 'mainnet-beta', pid: '5ey8...3fKm',     txCount: 84321 },
  { id: 2, name: 'PixelPunks',       desc: '10,000 unique pixel art NFTs with on-chain trait generation. Holders get DAO access and revenue share.',author: 'nftbuilder.sol', cat: 'NFT',     tags: ['NFT','DAO','Art'],        votes: 97,  voted: false, date: '2024-03-12', net: 'mainnet-beta', pid: 'BPFLo...11111',   txCount: 12480 },
  { id: 3, name: 'SolVault Staking', desc: 'Non-custodial staking with liquid staking tokens. Deposit SOL and receive vSOL auto-compounding rewards.', author: 'stakingpro.sol', cat: 'DeFi',    tags: ['Staking','Yield'],        votes: 88,  voted: false, date: '2024-03-10', net: 'mainnet-beta', pid: 'TokenkegQ...YYw',  txCount: 39200 },
  { id: 4, name: 'ChainQuest RPG',   desc: 'Fully on-chain RPG — characters, items and battles live on Solana. VRF-based provably fair combat.',  author: 'gamedev.sol',    cat: 'Gaming',  tags: ['Gaming','NFT','VRF'],     votes: 76,  voted: false, date: '2024-03-08', net: 'devnet',       pid: 'Gov1La8...gNDe',  txCount: 5840  },
  { id: 5, name: 'SolDAO Gov',       desc: 'Open-source DAO framework with multi-sig treasury, proposal voting, and timelock execution.',          author: 'daobuidler.sol', cat: 'DAO',     tags: ['DAO','Governance'],       votes: 63,  voted: false, date: '2024-03-05', net: 'mainnet-beta', pid: 'whirLbMi...Raq5', txCount: 2910  },
  { id: 6, name: 'Helius Router',    desc: 'Composable on-chain event routing. Subscribe to program logs and trigger conditional CPI calls.',      author: 'infra_dev.sol',  cat: 'Infra',   tags: ['Infra','Events'],         votes: 51,  voted: false, date: '2024-03-02', net: 'devnet',       pid: 'Prog11...1111',   txCount: 1240  },
]

const CATS = ['All', 'DeFi', 'NFT', 'DAO', 'Gaming', 'Infra']

const FV = { name: '', desc: '', cat: 'DeFi', pid: '', net: 'mainnet-beta', tags: '' }

export default function Showcase() {
  const [projects, setProjects] = useState<Project[]>(INITIAL)
  const [cat, setCat] = useState('All')
  const [sort, setSort] = useState<'votes'|'recent'|'txCount'>('votes')
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [done, setDone] = useState(false)
  const [form, setForm] = useState(FV)

  const vote = (id: number) =>
    setProjects(p => p.map(x => x.id === id ? { ...x, votes: x.voted ? x.votes - 1 : x.votes + 1, voted: !x.voted } : x))

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    setProjects(p => [{
      id: p.length + 1, name: form.name, desc: form.desc, author: 'you.sol',
      cat: form.cat, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      votes: 0, voted: false, date: new Date().toISOString().slice(0,10),
      net: form.net as 'mainnet-beta'|'devnet', pid: form.pid || '—', txCount: 0,
    }, ...p])
    setDone(true); setShowForm(false); setForm(FV)
  }

  const filtered = projects
    .filter(p => (cat === 'All' || p.cat === cat) && (
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.desc.toLowerCase().includes(search.toLowerCase()) ||
      p.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
    ))
    .sort((a, b) => sort === 'votes' ? b.votes - a.votes : sort === 'txCount' ? b.txCount - a.txCount : new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <>
      <Head><title>bagsfm Studio — Showcase</title></Head>

      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 className="page-title">Community Showcase</h1>
          <p className="page-subtitle">Browse deployed Solana projects and vote for your favourites</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>+ Submit Project</button>
      </div>

      {done && (
        <div style={{ background: 'var(--green-subtle)', border: '1px solid var(--green-border)', borderRadius: 10, padding: '12px 18px', marginBottom: 20, color: 'var(--green)', fontSize: 13, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Your project has been submitted!
          <button onClick={() => setDone(false)} style={{ background: 'none', border: 'none', color: 'var(--text-3)', cursor: 'pointer', fontSize: 18 }}>✕</button>
        </div>
      )}

      {showForm && (
        <div className="card" style={{ marginBottom: 20, borderColor: 'var(--green-border)' }}>
          <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 6 }}>Submit Your Project</div>
          <div className="green-line" />
          <form onSubmit={submit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14, marginBottom: 14 }}>
              <div><label className="label">Project Name *</label><input className="input" placeholder="e.g. SolSwap AMM" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required /></div>
              <div><label className="label">Category *</label><select className="input" value={form.cat} onChange={e => setForm({...form, cat: e.target.value})}>{CATS.filter(c => c !== 'All').map(c => <option key={c}>{c}</option>)}</select></div>
              <div><label className="label">Program ID</label><input className="input" placeholder="5ey8..." value={form.pid} onChange={e => setForm({...form, pid: e.target.value})} /></div>
              <div><label className="label">Network</label><select className="input" value={form.net} onChange={e => setForm({...form, net: e.target.value})}><option value="mainnet-beta">Mainnet</option><option value="devnet">Devnet</option></select></div>
            </div>
            <div style={{ marginBottom: 14 }}><label className="label">Description *</label><textarea className="input" style={{ minHeight: 80, resize: 'vertical' }} placeholder="Describe your project…" value={form.desc} onChange={e => setForm({...form, desc: e.target.value})} required /></div>
            <div style={{ marginBottom: 20 }}><label className="label">Tags (comma-separated)</label><input className="input" placeholder="DeFi, AMM, Yield" value={form.tags} onChange={e => setForm({...form, tags: e.target.value})} /></div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button type="submit" className="btn btn-primary">Submit Project</button>
              <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-4" style={{ marginBottom: 20 }}>
        {[
          { label: 'Projects',    value: projects.length.toString() },
          { label: 'Total Votes', value: projects.reduce((s, p) => s + p.votes, 0).toString() },
          { label: 'On Mainnet',  value: projects.filter(p => p.net === 'mainnet-beta').length.toString() },
          { label: 'Categories',  value: (CATS.length - 1).toString() },
        ].map(s => (
          <div key={s.label} className={`card ${s.label === 'Total Votes' ? 'card-green' : ''}`}>
            <div className="card-title">{s.label}</div>
            <div className="stat-value">{s.value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 18, flexWrap: 'wrap', alignItems: 'center' }}>
        <input className="input" style={{ maxWidth: 220, flex: '1 1 160px' }} placeholder="Search projects…" value={search} onChange={e => setSearch(e.target.value)} />
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {CATS.map(c => <button key={c} className={`btn btn-sm ${cat === c ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setCat(c)}>{c}</button>)}
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
          {([['votes','Top Voted'],['recent','Newest'],['txCount','Most Active']] as const).map(([v,l]) => (
            <button key={v} className={`btn btn-sm ${sort === v ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setSort(v)}>{l}</button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filtered.map((p, i) => (
          <div key={p.id} className="card" style={{
            display: 'flex', gap: 16, alignItems: 'flex-start',
            borderLeft: `3px solid ${p.voted ? 'var(--green)' : 'transparent'}`,
            transition: 'border-color 0.2s',
          }}>
            <div style={{ fontSize: 15, fontWeight: 900, minWidth: 28, color: i < 3 ? 'var(--green)' : 'var(--text-3)', fontFamily: 'monospace', paddingTop: 3 }}>
              {String(i+1).padStart(2,'0')}
            </div>
            {/* Vote */}
            <button onClick={() => vote(p.id)} style={{
              width: 44, height: 52, borderRadius: 10, flexShrink: 0,
              border: `1px solid ${p.voted ? 'var(--green-border)' : 'var(--border)'}`,
              background: p.voted ? 'var(--green-subtle)' : 'var(--bg-elevated)',
              color: p.voted ? 'var(--green)' : 'var(--text-3)',
              cursor: 'pointer', display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: 2,
              transition: 'all 0.15s', fontSize: 10, fontWeight: 800,
              boxShadow: p.voted ? 'var(--shadow-green)' : 'none',
            }}>
              <span style={{ fontSize: 16 }}>▲</span>
              {p.votes}
            </button>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6, flexWrap: 'wrap' }}>
                <span style={{ fontWeight: 800, fontSize: 15 }}>{p.name}</span>
                <span className={`badge ${p.net === 'mainnet-beta' ? 'badge-success' : 'badge-warning'}`}>{p.net === 'mainnet-beta' ? 'mainnet' : 'devnet'}</span>
                <span className="badge badge-accent">{p.cat}</span>
                {p.tags.map(t => <span key={t} className="badge badge-neutral" style={{ fontSize: 10 }}>{t}</span>)}
              </div>
              <p style={{ color: 'var(--text-2)', fontSize: 13, lineHeight: 1.6, marginBottom: 8 }}>{p.desc}</p>
              <div style={{ display: 'flex', gap: 16, fontSize: 11, color: 'var(--text-3)', flexWrap: 'wrap' }}>
                <span>by <span style={{ color: 'var(--green)', fontWeight: 700 }}>{p.author}</span></span>
                <span className="hash">{p.pid}</span>
                <span>{p.txCount.toLocaleString()} txns</span>
                <span>{p.date}</span>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="card" style={{ textAlign: 'center', padding: 48, color: 'var(--text-3)' }}>
            No projects found. Be the first to submit one!
          </div>
        )}
      </div>
    </>
  )
}
