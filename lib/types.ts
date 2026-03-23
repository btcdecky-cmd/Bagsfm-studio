export type Project = {
  id: string
  name: string
  description: string | null
  author: string
  category: string
  program_id: string | null
  network: 'mainnet-beta' | 'devnet'
  status: 'active' | 'testing' | 'paused' | 'failed'
  votes: number
  tx_count: number
  created_at: string
  updated_at: string
}

export type FeedItem = {
  id: string
  author: string
  project_name: string | null
  action_type: 'deploy' | 'token' | 'nft' | 'vote' | 'update' | 'follow' | 'milestone'
  title: string
  description: string | null
  metadata: Record<string, unknown>
  created_at: string
}

export type OnChainEvent = {
  id: string
  type: string
  program: string | null
  signature: string | null
  amount: string | null
  slot: number | null
  status: 'confirmed' | 'finalized'
  raw: Record<string, unknown>
  created_at: string
}

export type Notification = {
  id: string
  type: 'deploy' | 'vote' | 'follow' | 'event' | 'milestone'
  title: string
  message: string | null
  read: boolean
  metadata: Record<string, unknown>
  created_at: string
}
