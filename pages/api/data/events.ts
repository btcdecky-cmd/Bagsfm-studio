import type { NextApiRequest, NextApiResponse } from 'next'
import { query } from '../../../lib/db'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      const limit = Math.min(Math.max(parseInt(req.query.limit as string) || 50, 1), 200)
      const { rows } = await query(
        'SELECT * FROM on_chain_events ORDER BY created_at DESC LIMIT $1',
        [limit]
      )
      return res.status(200).json(rows)
    }

    res.status(405).json({ error: 'Method not allowed' })
  } catch (e) {
    res.status(500).json({ error: (e as Error).message })
  }
}
