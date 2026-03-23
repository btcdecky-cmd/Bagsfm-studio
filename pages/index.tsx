import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect } from 'react'

const TRENDING = [
  { name: 'SolSwap AMM',     author: 'cryptodev.sol',   cat: 'DeFi',    votes: 142, activity: 'Deployed v2.1 liquidity pools',          time: '4m ago',  live: true  },
  { name: 'PixelPunks',      author: 'nftbuilder.sol',  cat: 'NFT',     votes: 97,  activity: 'Minted batch #3 — 500 NFTs live',        time: '11m ago', live: true  },
  { name: 'SolVault',        author: 'stakingpro.sol',  cat: 'Staking', votes: 88,  activity: 'Epoch rewards distributed (+12% APY)',   time: '23m ago', live: false },
  { name: 'ChainQuest RPG',  author: 'gamedev.sol',     cat: 'Gaming',  votes: 76,  activity: 'New dungeon map deployed on-chain',      time: '45m ago', live: false },
  { name: 'SolDAO Gov',      author: 'daobuidler.sol',  cat: 'DAO',     votes: 63,  activity: 'Proposal #14 passed — 87% approval',    time: '1h ago',  live: false },
]

const FEED = [
  { b: 'cryptodev.sol',   p: 'SolSwap AMM',   d: 'v2.1 — concentrated liquidity live on mainnet',  t: '4m ago'  },
  { b: 'nftbuilder.sol',  p: 'PixelPunks',    d: '500 NFTs minted, 1,200 on waitlist',              t: '11m ago' },
  { b: 'stakingpro.sol',  p: 'SolVault',      d: 'Epoch 621 rewards: 12.4% APY distributed',       t: '23m ago' },
  { b: 'gamedev.sol',     p: 'ChainQuest RPG',d: 'On-chain dungeon generator using VRF',            t: '45m ago' },
  { b: 'infra_dev.sol',   p: 'Helius Router', d: 'Event routing SDK now MIT licensed',              t: '1h ago'  },
  { b: 'daobuidler.sol',  p: 'SolDAO',        d: 'Timelock executor — 72hr delay on treasury',     t: '2h ago'  },
]

const BUILDERS = [
  { h: 'cryptodev.sol',    projects: 4, followers: '1.2K', spec: 'DeFi',           latest: 'SolSwap AMM'   },
  { h: 'nftbuilder.sol',   projects: 7, followers: '890',  spec: 'NFT',            latest: 'PixelPunks'    },
  { h: 'stakingpro.sol',   projects: 3, followers: '740',  spec: 'Staking',        latest: 'SolVault'      },
  { h: 'gamedev.sol',      projects: 2, followers: '620',  spec: 'Gaming',         latest: 'ChainQuest RPG'},
  { h: 'daobuidler.sol',   projects: 5, followers: '510',  spec: 'Governance',     latest: 'SolDAO'        },
  { h: 'infra_dev.sol',    projects: 6, followers: '480',  spec: 'Infrastructure', latest: 'Helius Router' },
]

const STEPS = [
  { n: '01', title: 'Create a project',            desc: 'Name your project, pick a category, and add a program ID. Your builder profile goes live instantly.' },
  { n: '02', title: 'Build and share updates',     desc: 'Push deployments, mint tokens, or ship features — every action streams to your followers in real time.' },
  { n: '03', title: 'Launch and grow',             desc: 'Earn votes, attract contributors, and build an audience that follows your journey from zero to mainnet.' },
]

const STATS = [
  { label: 'Builders',      value: 3847   },
  { label: 'Projects Live', value: 1249   },
  { label: 'On-Chain Txns', value: 928400 },
  { label: 'Votes Cast',    value: 54200  },
]

function Counter({ target }: { target: number }) {
  const [v, setV] = useState(0)
  useEffect(() => {
    let n = 0
    const step = target / 60
    const t = setInterval(() => { n += step; if (n >= target) { setV(target); clearInterval(t) } else setV(Math.floor(n)) }, 22)
    return () => clearInterval(t)
  }, [target])
  return <>{v.toLocaleString()}</>
}

export default function Home() {
  const [fi, setFi] = useState(0)
  useEffect(() => { const t = setInterval(() => setFi(i => (i + 1) % FEED.length), 2800); return () => clearInterval(t) }, [])

  return (
    <>
      <Head>
        <title>bagsfm Studio — Build in Public on Solana</title>
        <meta name="description" content="Real-time builder platform for Solana developers." />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </Head>

      <div style={{ background: 'var(--bg)', minHeight: '100vh', color: 'var(--text)' }}>

        {/* ── NAV ── */}
        <nav style={{
          position: 'sticky', top: 0, zIndex: 100,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 clamp(16px, 5vw, 48px)',
          height: 62,
          background: 'rgba(6,6,6,0.88)',
          backdropFilter: 'blur(18px)',
          WebkitBackdropFilter: 'blur(18px)',
          borderBottom: '1px solid var(--border)',
        }}>
          <div style={{ fontWeight: 800, fontSize: 20, letterSpacing: '-0.6px' }}>
            bags<span style={{ color: 'var(--green)', filter: 'drop-shadow(0 0 8px rgba(0,255,136,0.6))' }}>fm</span>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Link href="/showcase" style={{ padding: '8px 14px', fontSize: 13, color: 'var(--text-2)', borderRadius: 8, fontWeight: 500 }}>
              Explore
            </Link>
            <Link href="/dashboard" style={{
              padding: '9px 18px', fontSize: 13, fontWeight: 700,
              background: 'var(--green)', color: '#050a05', borderRadius: 8,
              boxShadow: '0 2px 12px rgba(0,255,136,0.3)',
            }}>
              Start Building
            </Link>
          </div>
        </nav>

        {/* ── HERO ── */}
        <section style={{ padding: 'clamp(56px,10vw,100px) clamp(16px,6vw,48px) clamp(48px,8vw,80px)', textAlign: 'center', maxWidth: 800, margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 14px', borderRadius: 100,
            border: '1px solid var(--green-border)',
            background: 'var(--green-subtle)',
            fontSize: 12, fontWeight: 700, color: 'var(--green)',
            marginBottom: 28, letterSpacing: 0.3,
          }}>
            <span className="pulse" style={{ width: 7, height: 7 }} />
            Live builder activity on Solana
          </div>

          <h1 style={{
            fontSize: 'clamp(38px, 7vw, 62px)',
            fontWeight: 900,
            letterSpacing: '-2.5px',
            lineHeight: 1.05,
            marginBottom: 22,
          }}>
            Build in Public<br />
            <span style={{
              background: 'linear-gradient(90deg, var(--green) 0%, #ffffff 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              on Solana
            </span>
          </h1>

          <p style={{ fontSize: 'clamp(15px,2.5vw,18px)', color: 'var(--text-2)', lineHeight: 1.7, marginBottom: 10, maxWidth: 580, margin: '0 auto 10px' }}>
            Dev Studio is a real-time builder platform where developers create projects, track on-chain activity, and showcase what they are building.
          </p>
          <p style={{ fontSize: 14, color: 'var(--text-3)', marginBottom: 36, marginTop: 10 }}>
            Follow builders, discover new projects early, and watch products evolve from idea to launch.
          </p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/dashboard" className="btn btn-primary btn-lg">
              Start Building
            </Link>
            <Link href="/showcase" className="btn btn-secondary btn-lg">
              Explore Projects
            </Link>
          </div>
        </section>

        {/* ── STATS ── */}
        <section style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '28px clamp(16px,5vw,48px)' }}>
          <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 0 }}
            className="stats-grid">
            {STATS.map((s, i) => (
              <div key={s.label} style={{
                textAlign: 'center', padding: '14px 0',
                borderRight: i % 2 === 0 ? '1px solid var(--border)' : 'none',
                borderBottom: i < 2 ? '1px solid var(--border)' : 'none',
              }}>
                <div style={{ fontSize: 'clamp(24px,4vw,34px)', fontWeight: 900, letterSpacing: '-1px', color: 'var(--text)', lineHeight: 1 }}>
                  <Counter target={s.value} />
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 5, fontWeight: 600, letterSpacing: 0.3 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── TRENDING ── */}
        <section style={{ padding: 'clamp(48px,8vw,72px) clamp(16px,5vw,48px)', maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ marginBottom: 32 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--green)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>Trending Now</div>
            <h2 style={{ fontSize: 'clamp(26px,4vw,36px)', fontWeight: 800, letterSpacing: '-1px', marginBottom: 8 }}>Trending Projects</h2>
            <p style={{ color: 'var(--text-2)', fontSize: 15 }}>Discover the most active projects being built right now.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {TRENDING.map((p, i) => (
              <Link key={p.name} href="/showcase" style={{
                display: 'flex', alignItems: 'center', gap: 16,
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 14,
                padding: 'clamp(12px,2vw,18px) clamp(14px,2.5vw,22px)',
                transition: 'border-color 0.18s, transform 0.18s, box-shadow 0.18s',
              }}
                onMouseEnter={e => { const el = e.currentTarget; el.style.borderColor = 'var(--green-border)'; el.style.transform = 'translateX(6px)'; el.style.boxShadow = '0 0 24px rgba(0,255,136,0.07)' }}
                onMouseLeave={e => { const el = e.currentTarget; el.style.borderColor = 'var(--border)'; el.style.transform = 'translateX(0)'; el.style.boxShadow = 'none' }}
              >
                <div style={{ fontSize: 20, fontWeight: 900, color: i < 3 ? 'var(--green)' : 'var(--text-3)', minWidth: 30, fontFamily: 'monospace' }}>
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 5, flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 700, fontSize: 15 }}>{p.name}</span>
                    <span className="badge badge-accent">{p.cat}</span>
                    {p.live && <span className="pulse" style={{ width: 6, height: 6 }} />}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    <span style={{ color: 'var(--green)', fontWeight: 600 }}>{p.author}</span>
                    {' · '}{p.activity}{' · '}{p.time}
                  </div>
                </div>
                <div style={{ textAlign: 'center', minWidth: 48 }}>
                  <div style={{ fontSize: 11, color: 'var(--green)', fontWeight: 700 }}>▲</div>
                  <div style={{ fontWeight: 800, fontSize: 16 }}>{p.votes}</div>
                </div>
              </Link>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <Link href="/showcase" className="btn btn-secondary">View all projects →</Link>
          </div>
        </section>

        {/* ── LIVE FEED ── */}
        <section style={{ background: 'var(--bg-card)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: 'clamp(48px,8vw,72px) clamp(16px,5vw,48px)' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'clamp(200px,35%,360px) 1fr', gap: 'clamp(32px,5vw,64px)', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--green)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>Live Feed</div>
              <h2 style={{ fontSize: 'clamp(24px,3.5vw,32px)', fontWeight: 800, letterSpacing: '-1px', marginBottom: 14 }}>Live Builder Activity</h2>
              <p style={{ color: 'var(--text-2)', fontSize: 14, lineHeight: 1.7, marginBottom: 24 }}>
                See real-time updates from developers as they create features, deploy programs, and launch tokens.
              </p>
              <Link href="/events" className="btn btn-secondary">Open Activity Feed →</Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {FEED.map((item, i) => {
                const isActive = i === fi
                return (
                  <div key={i} style={{
                    display: 'flex', gap: 12, alignItems: 'center',
                    padding: '11px 14px', borderRadius: 12,
                    background: isActive ? 'var(--green-subtle)' : 'var(--bg)',
                    border: `1px solid ${isActive ? 'var(--green-border)' : 'transparent'}`,
                    transition: 'all 0.35s',
                    opacity: Math.abs(i - fi) > 3 ? 0.25 : 1,
                    boxShadow: isActive ? 'var(--shadow-green)' : 'none',
                  }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                      background: isActive ? 'rgba(0,255,136,0.15)' : 'var(--bg-elevated)',
                      border: `1px solid ${isActive ? 'var(--green-border)' : 'var(--border)'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 800, fontSize: 13,
                      color: isActive ? 'var(--green)' : 'var(--text-3)',
                    }}>
                      {item.b[0].toUpperCase()}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, marginBottom: 1 }}>
                        <span style={{ color: 'var(--green)', fontWeight: 700 }}>{item.b}</span>
                        {' · '}
                        <span style={{ color: 'var(--text)', fontWeight: 600 }}>{item.p}</span>
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--text-3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.d}</div>
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--text-3)', whiteSpace: 'nowrap' }}>{item.t}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ── BUILDERS ── */}
        <section style={{ padding: 'clamp(48px,8vw,72px) clamp(16px,5vw,48px)', maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ marginBottom: 32 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--green)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>Community</div>
            <h2 style={{ fontSize: 'clamp(24px,4vw,36px)', fontWeight: 800, letterSpacing: '-1px', marginBottom: 8 }}>Builder Profiles</h2>
            <p style={{ color: 'var(--text-2)', fontSize: 15 }}>Follow top builders and explore the projects they are working on.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
            {BUILDERS.map((b) => (
              <div key={b.h} className="card" style={{ padding: 20 }}>
                <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 16 }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: '50%',
                    background: 'linear-gradient(135deg, rgba(0,255,136,0.25), rgba(0,204,106,0.1))',
                    border: '2px solid var(--green-border)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 900, fontSize: 18, color: 'var(--green)',
                    boxShadow: '0 0 12px rgba(0,255,136,0.2)',
                  }}>
                    {b.h[0].toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{b.h}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>{b.followers} followers · {b.projects} projects</div>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 14 }}>
                  <span style={{ color: 'var(--text-3)' }}>Speciality</span>
                  <span style={{ fontWeight: 700, color: 'var(--green)' }}>{b.spec}</span>
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 14 }}>
                  Latest: <span style={{ color: 'var(--text)', fontWeight: 600 }}>{b.latest}</span>
                </div>
                <button className="btn btn-secondary btn-block" style={{ fontSize: 12 }}>Follow</button>
              </div>
            ))}
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section style={{ background: 'var(--bg-card)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: 'clamp(48px,8vw,72px) clamp(16px,5vw,48px)' }}>
          <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--green)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>Process</div>
            <h2 style={{ fontSize: 'clamp(24px,4vw,36px)', fontWeight: 800, letterSpacing: '-1px', marginBottom: 8 }}>How It Works</h2>
            <p style={{ color: 'var(--text-2)', fontSize: 15, marginBottom: 48 }}>Three steps from idea to launch.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 32 }}>
              {STEPS.map((s) => (
                <div key={s.n} style={{ textAlign: 'left' }}>
                  <div style={{
                    fontFamily: 'monospace', fontSize: 12, fontWeight: 700,
                    color: 'var(--green)', letterSpacing: 1, marginBottom: 10,
                    display: 'flex', alignItems: 'center', gap: 8,
                  }}>
                    <span style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--green-subtle)', border: '1px solid var(--green-border)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 11 }}>{s.n}</span>
                    Step {s.n}
                  </div>
                  <div className="green-line" />
                  <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 10 }}>{s.title}</div>
                  <div style={{ color: 'var(--text-2)', fontSize: 14, lineHeight: 1.7 }}>{s.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FOOTER CTA ── */}
        <section style={{ padding: 'clamp(64px,12vw,100px) clamp(16px,5vw,48px)', textAlign: 'center', maxWidth: 640, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(28px,5vw,40px)', fontWeight: 900, letterSpacing: '-1.5px', marginBottom: 16, lineHeight: 1.1 }}>
            Start building in public today<br />
            <span style={{ color: 'var(--green)', filter: 'drop-shadow(0 0 10px rgba(0,255,136,0.5))' }}>
              and show the world what you&apos;re creating.
            </span>
          </h2>
          <p style={{ color: 'var(--text-2)', fontSize: 15, marginBottom: 36, lineHeight: 1.7 }}>
            Join thousands of Solana developers building in the open.
          </p>
          <Link href="/dashboard" className="btn btn-primary btn-lg">
            Open Dev Studio
          </Link>
        </section>

        {/* ── FOOTER ── */}
        <footer style={{ borderTop: '1px solid var(--border)', padding: 'clamp(16px,3vw,24px) clamp(16px,5vw,48px)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, fontSize: 12, color: 'var(--text-3)' }}>
          <span style={{ fontWeight: 700, color: 'var(--text-2)' }}>bagsfm Studio</span>
          <div style={{ display: 'flex', gap: 20 }}>
            {[['Explore', '/showcase'], ['Dashboard', '/dashboard'], ['Builder', '/builder']].map(([l, h]) => (
              <Link key={l} href={h} style={{ color: 'var(--text-3)', transition: 'color 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--green)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-3)'}>
                {l}
              </Link>
            ))}
          </div>
          <span>Built on Solana</span>
        </footer>
      </div>
    </>
  )
}
