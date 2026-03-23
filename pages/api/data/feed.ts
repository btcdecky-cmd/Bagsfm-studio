import type { NextApiRequest, NextApiResponse } from 'next'
import { query } from '../../../lib/db'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      const limit = Math.min(Math.max(parseInt(req.query.limit as string) || 20, 1), 100)
      const { rows } = await query(
        'SELECT * FROM builder_feed ORDER BY created_at DESC LIMIT $1',
        [limit]
      )
      return res.status(200).json(rows)
    }

    if (req.method === 'POST') {
      const { author, project_name, action_type, title, description, metadata } = req.body
      if (!author || !action_type || !title) {
        return res.status(400).json({ error: 'author, action_type, title required' })
      }
      const { rows } = await query(
        `INSERT INTO builder_feed (author, project_name, action_type, title, description, metadata)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [author, project_name || null, action_type, title, description || null, JSON.stringify(metadata || {})]
      )
      return res.status(201).json(rows[0])
    }

    res.status(405).json({ error: 'Method not allowed' })
  } catch (e) {
    res.status(500).json({ error: (e as Error).message })
  }
}
