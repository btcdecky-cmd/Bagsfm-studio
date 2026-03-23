import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import {
  IconDashboard, IconDeployments, IconEvents, IconPrograms,
  IconTokens, IconWallet, IconBuilder, IconShowcase, IconAssistant,
} from './Icons'
import NotificationBell from './NotificationBell'

const NAV = [
  { href: '/dashboard',   label: 'Dashboard',     Icon: IconDashboard },
  { href: '/deployments', label: 'Deployments',   Icon: IconDeployments },
  { href: '/events',      label: 'Events',        Icon: IconEvents },
  { href: '/programs',    label: 'Programs',      Icon: IconPrograms },
  { href: '/tokens',      label: 'Tokens',        Icon: IconTokens },
  { href: '/wallet',      label: 'Wallet',        Icon: IconWallet },
  { href: '/builder',     label: 'Builder',       Icon: IconBuilder },
  { href: '/showcase',    label: 'Showcase',      Icon: IconShowcase },
  { href: '/assistant',   label: 'AI Assistant',  Icon: IconAssistant },
]

const BOTTOM_NAV = [
  { href: '/dashboard',   label: 'Home',      Icon: IconDashboard },
  { href: '/events',      label: 'Events',    Icon: IconEvents },
  { href: '/builder',     label: 'Build',     Icon: IconBuilder },
  { href: '/showcase',    label: 'Showcase',  Icon: IconShowcase },
  { href: '/assistant',   label: 'AI',        Icon: IconAssistant },
]

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)

  useEffect(() => { setOpen(false) }, [router.pathname])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <div className="layout">

      <header className="topbar">
        <div className="topbar-logo">
          bags<span>fm</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <NotificationBell />
          <button
            className={`hamburger${open ? ' open' : ''}`}
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </header>

      {open && (
        <div
          className="drawer-overlay"
          onClick={() => setOpen(false)}
          style={{ opacity: open ? 1 : 0 }}
        />
      )}

      <aside className={`sidebar${open ? ' open' : ''}`}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="sidebar-logo">
            bags<span className="logo-accent">fm</span>
            <span className="logo-dot" />
          </div>
          <NotificationBell />
        </div>

        <div className="sidebar-section-label">Navigation</div>

        <nav className="sidebar-nav">
          {NAV.map(({ href, label, Icon }) => (
            <Link
              key={href}
              href={href}
              className={`nav-link${router.pathname === href ? ' active' : ''}`}
            >
              <Icon size={16} />
              {label}
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <span className="pulse" style={{ width: 7, height: 7 }} />
          <span>Solana Mainnet</span>
        </div>
      </aside>

      <main className="main-content">
        {children}
      </main>

      <nav className="bottom-nav">
        {BOTTOM_NAV.map(({ href, label, Icon }) => (
          <Link
            key={href}
            href={href}
            className={`bottom-nav-item${router.pathname === href ? ' active' : ''}`}
          >
            <Icon size={22} />
            {label}
          </Link>
        ))}
      </nav>

    </div>
  )
}
