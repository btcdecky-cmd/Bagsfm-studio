import type { NextApiRequest, NextApiResponse } from 'next'
import { query } from '../../../lib/db'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      const limit = Math.min(Math.max(parseInt(req.query.limit as string) || 20, 1), 100)
      const { rows } = await query(
        'SELECT * FROM projects ORDER BY votes DESC LIMIT $1',
        [limit]
      )
      return res.status(200).json(rows)
    }

    if (req.method === 'POST') {
      const { name, description, author, category, network } = req.body
      if (!name) return res.status(400).json({ error: 'name required' })
      const { rows } = await query(
        `INSERT INTO projects (name, description, author, category, network)
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [name, description || null, author || 'anonymous', category || 'Other', network || 'devnet']
      )
      return res.status(201).json(rows[0])
    }

    res.status(405).json({ error: 'Method not allowed' })
  } catch (e) {
    res.status(500).json({ error: (e as Error).message })
  }
}
