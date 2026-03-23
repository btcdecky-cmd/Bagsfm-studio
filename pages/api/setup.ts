import type { NextApiRequest, NextApiResponse } from 'next'
import { query } from '../../lib/db'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    await query(`
      CREATE TABLE IF NOT EXISTS projects (
        id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
        name text NOT NULL,
        description text,
        author text NOT NULL DEFAULT 'anonymous',
        category text DEFAULT 'Other',
        program_id text,
        network text DEFAULT 'mainnet-beta',
        status text DEFAULT 'active',
        votes integer DEFAULT 0,
        tx_count integer DEFAULT 0,
        created_at timestamptz DEFAULT now(),
        updated_at timestamptz DEFAULT now()
      );
      CREATE TABLE IF NOT EXISTS builder_feed (
        id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
        author text NOT NULL,
        project_name text,
        action_type text NOT NULL,
        title text NOT NULL,
        description text,
        metadata jsonb DEFAULT '{}',
        created_at timestamptz DEFAULT now()
      );
      CREATE TABLE IF NOT EXISTS on_chain_events (
        id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
        type text NOT NULL,
        program text,
        signature text UNIQUE,
        amount text,
        slot bigint,
        status text DEFAULT 'confirmed',
        raw jsonb DEFAULT '{}',
        created_at timestamptz DEFAULT now()
      );
      CREATE TABLE IF NOT EXISTS notifications (
        id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
        type text NOT NULL,
        title text NOT NULL,
        message text,
        read boolean DEFAULT false,
        metadata jsonb DEFAULT '{}',
        created_at timestamptz DEFAULT now()
      );
    `)
    res.status(200).json({ status: 'ok', message: 'Tables created/verified' })
  } catch (e) {
    res.status(500).json({ error: (e as Error).message })
  }
}
