import type { NextApiRequest, NextApiResponse } from 'next'
import { query } from '../../../lib/db'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const secret = process.env.HELIUS_WEBHOOK_SECRET
  if (secret) {
    const authHeader = req.headers['authorization'] ?? req.headers['x-webhook-secret']
    if (authHeader !== secret && authHeader !== `Bearer ${secret}`) {
      return res.status(401).json({ error: 'Unauthorized' })
    }
  }

  const body = req.body
  if (!body || (Array.isArray(body) && body.length === 0)) {
    return res.status(400).json({ error: 'Empty payload' })
  }

  const events = Array.isArray(body) ? body : [body]

  const rows = events
    .filter((ev: Record<string, unknown>) => ev && typeof ev === 'object' && typeof ev.type === 'string')
    .map((ev: Record<string, unknown>) => {
      const type = ev.type as string
      const signature = typeof ev.signature === 'string' ? ev.signature : null
      const slot = typeof ev.slot === 'number' ? ev.slot : null
      const meta = Array.isArray(ev.tokenTransfers) ? ev.tokenTransfers : []
      const amount = meta.length > 0
        ? `${(meta[0] as Record<string, unknown>).tokenAmount} ${(meta[0] as Record<string, unknown>).mint ?? ''}`.trim()
        : null

      return { type, signature, slot, amount, raw: ev, status: 'confirmed' }
    })

  if (rows.length === 0) {
    return res.status(400).json({ error: 'No valid events in payload' })
  }

  try {
    let inserted = 0
    for (const row of rows) {
      try {
        await query(
          `INSERT INTO on_chain_events (type, signature, slot, amount, raw, status)
           VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (signature) DO NOTHING`,
          [row.type, row.signature, row.slot, row.amount, JSON.stringify(row.raw), row.status]
        )
        inserted++
      } catch {}
    }

    const deployEvents = rows.filter(r => r.type === 'PROGRAM_DEPLOY' || r.type === 'PROGRAM_UPDATE')
    for (const r of deployEvents) {
      await query(
        `INSERT INTO builder_feed (author, action_type, title, description, metadata)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          'on-chain',
          'deploy',
          `Program ${r.type === 'PROGRAM_UPDATE' ? 'updated' : 'deployed'} on-chain`,
          `Slot ${r.slot?.toLocaleString()} · ${r.signature?.slice(0, 12)}…`,
          JSON.stringify(r.raw),
        ]
      )
    }

    res.status(200).json({ ok: true, inserted })
  } catch (e) {
    res.status(500).json({ error: (e as Error).message })
  }
}
