-- bagsfm Studio — Supabase schema
-- Run this in your Supabase SQL Editor to set up all tables

-- 1. Projects
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

-- 2. Builder activity feed
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

-- 3. On-chain events (Helius webhook writes here)
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

-- 4. Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  type text NOT NULL,
  title text NOT NULL,
  message text,
  read boolean DEFAULT false,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE builder_feed ENABLE ROW LEVEL SECURITY;
ALTER TABLE on_chain_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Public read/write policies (open for demo — tighten for production)
CREATE POLICY "public_read" ON projects FOR SELECT USING (true);
CREATE POLICY "public_insert" ON projects FOR INSERT WITH CHECK (true);
CREATE POLICY "public_update" ON projects FOR UPDATE USING (true);

CREATE POLICY "public_read" ON builder_feed FOR SELECT USING (true);
CREATE POLICY "public_insert" ON builder_feed FOR INSERT WITH CHECK (true);

CREATE POLICY "public_read" ON on_chain_events FOR SELECT USING (true);
CREATE POLICY "public_insert" ON on_chain_events FOR INSERT WITH CHECK (true);

CREATE POLICY "public_read" ON notifications FOR SELECT USING (true);
CREATE POLICY "public_insert" ON notifications FOR INSERT WITH CHECK (true);
CREATE POLICY "public_update" ON notifications FOR UPDATE USING (true);

-- Enable Supabase Realtime for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE projects;
ALTER PUBLICATION supabase_realtime ADD TABLE builder_feed;
ALTER PUBLICATION supabase_realtime ADD TABLE on_chain_events;
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
