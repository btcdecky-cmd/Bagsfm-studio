# bagsfm Studio

A command center for Solana builders — track deployments, monitor on-chain events, build projects from prompts, and chat with an AI assistant. Real-time data powered by Replit PostgreSQL with Helius webhook integration.

## Stack

- **Framework**: Next.js 15 (Pages Router)
- **Runtime**: Node.js 20
- **Language**: TypeScript
- **Styling**: Custom CSS design system — green (`#00ff88`) + white + dark background, no external UI library
- **Database**: Replit PostgreSQL (via `pg` module, accessed through `lib/db.ts`)
- **Blockchain**: `@solana/web3.js`
- **Real-time**: Polling via `setInterval` in React hooks (3-8 second intervals)
- **Webhooks**: Helius enhanced transaction webhooks → `/api/webhook/helius`

## Design System

- Primary accent: `--green: #00ff88` (neon green with glow effects)
- Background: `--bg: #060606`, cards: `--bg-card: #0c0c0c`
- Mobile-first: hamburger drawer sidebar + fixed bottom nav (5 tabs)
- Responsive grids collapse to 1-col on mobile; tables swap for card lists
- All tap targets min 44px height; `--bottomnav-h: 64px`, `--topbar-h: 60px`
- Green active indicator bar on sidebar nav links

## Pages

```
pages/
  _app.tsx          - App wrapper with conditional Layout (skips for /)
  _document.tsx     - SEO meta, OG tags, favicon, manifest
  index.tsx         - Public landing page (standalone nav, no sidebar)
  dashboard.tsx     - Developer dashboard with real-time LiveFeed, stats from PostgreSQL
  deployments.tsx   - Program deployment tracker with responsive table/cards
  events.tsx        - Live on-chain event monitor (polling from PostgreSQL)
  programs.tsx      - Program explorer with IDL/instruction viewer
  tokens.tsx        - Solana token market overview
  wallet.tsx        - Wallet portfolio and transaction history
  builder.tsx       - OpenHands-inspired AI Builder Agent (agent console + code viewer)
  showcase.tsx      - Community project voting & discovery
  assistant.tsx     - AI assistant with streaming text, code blocks, Solana knowledge base

pages/api/
  health.ts         - GET: checks database tables exist
  setup.ts          - POST: creates tables if missing
  seed.ts           - POST: seeds tables with demo data
  data/projects.ts  - GET/POST: project CRUD
  data/feed.ts      - GET/POST: builder feed CRUD
  data/events.ts    - GET: on-chain events
  data/notifications.ts - GET/PATCH: notifications with mark-read
  webhook/helius.ts - POST: Helius webhook receiver (writes on_chain_events + builder_feed)

components/
  Layout.tsx        - Mobile sidebar drawer + bottom nav + desktop sidebar + NotificationBell
  Icons.tsx         - SVG icon components for navigation
  NotificationBell.tsx - Real-time notification bell with dropdown
  LiveFeed.tsx      - Live builder activity feed component

hooks/
  useRealtimeFeed.ts   - Builder feed with polling (5s interval)
  useRealtimeEvents.ts - On-chain events with polling (3s interval)
  useNotifications.ts  - Notifications with polling (8s interval)

lib/
  db.ts             - PostgreSQL connection pool (pg module)
  supabase.ts       - Legacy Supabase client (kept for reference)
  supabaseServer.ts - Legacy server-side Supabase client
  types.ts          - TypeScript types for all database tables

styles/
  globals.css       - Full green/white design system + mobile responsive CSS
```

## Database Tables

- `projects` — Solana builder projects (name, author, category, network, votes, tx_count)
- `builder_feed` — Activity feed entries (author, action_type, title, description)
- `on_chain_events` — On-chain transaction events (type, program, signature, amount, slot)
- `notifications` — User notifications (type, title, message, read status)

## Setup

1. Database tables auto-created via `scripts/create-tables.js` (run `node scripts/create-tables.js`)
2. Or call `POST /api/setup` to create tables via API
3. Seed demo data: `POST /api/seed`
4. Optional: Set `HELIUS_WEBHOOK_SECRET` for webhook auth
5. Point Helius webhook to: `POST /api/webhook/helius`

## Running

```bash
npm run dev     # dev server on port 5000
npm run build   # production build
npm start       # production server on port 5000
```

## Replit Configuration

- Dev server binds to `0.0.0.0:5000` for Replit preview compatibility
- Workflow: "Start application" → `npm run dev`
- Deployment: autoscale target, build: `npm run build`, run: `npm start`
- `@solana/wallet-adapter-wallets` excluded — native USB gyp build fails in Replit
- Homepage (`/`) skips Layout: `NO_LAYOUT_ROUTES = ['/']` in `_app.tsx`

## Notes

- Port conflicts: run `fuser -k 5000/tcp` before restarting if `EADDRINUSE` occurs
- All hooks poll API routes and update state automatically
- Desktop/mobile view switching uses `.show-mobile` / `.show-desktop` CSS classes (globals.css)
- Mobile layout uses CSS custom properties `--bottomnav-h` / `--topbar-h` for padding calculations
