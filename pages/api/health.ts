import type { NextApiRequest, NextApiResponse } from 'next'
import { query } from '../../lib/db'

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  try {
    await query('SELECT 1 FROM builder_feed LIMIT 1')
    res.status(200).json({ tables: true })
  } catch {
    res.status(200).json({ tables: false })
  }
}
