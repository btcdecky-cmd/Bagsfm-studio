import type { NextApiRequest, NextApiResponse } from 'next'
import { query } from '../../../lib/db'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      const { rows } = await query(
        'SELECT * FROM notifications ORDER BY created_at DESC LIMIT 30'
      )
      return res.status(200).json(rows)
    }

    if (req.method === 'PATCH') {
      const { id, markAll } = req.body
      if (markAll) {
        await query('UPDATE notifications SET read = true WHERE read = false')
      } else if (id) {
        await query('UPDATE notifications SET read = true WHERE id = $1', [id])
      }
      return res.status(200).json({ ok: true })
    }

    res.status(405).json({ error: 'Method not allowed' })
  } catch (e) {
    res.status(500).json({ error: (e as Error).message })
  }
}
