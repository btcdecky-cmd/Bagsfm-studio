import { createClient, SupabaseClient } from '@supabase/supabase-js'

const url  = process.env.NEXT_PUBLIC_SUPABASE_URL  ?? ''
const akey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''

const rawClient = url && akey ? createClient(url, akey) : null

let _tablesReady: boolean | null = null
let _checkPromise: Promise<boolean> | null = null

async function checkTables(): Promise<boolean> {
  if (!rawClient) return false
  if (typeof window === 'undefined') return true
  try {
    const resp = await fetch('/api/health')
    if (!resp.ok) return false
    const { tables } = await resp.json()
    return Boolean(tables)
  } catch {
    return false
  }
}

export async function getCheckedSupabase(): Promise<SupabaseClient | null> {
  if (!rawClient) return null
  if (_tablesReady === true) return rawClient
  if (_tablesReady === false) return null
  if (!_checkPromise) {
    _checkPromise = checkTables().then(ok => { _tablesReady = ok; return ok })
  }
  return (await _checkPromise) ? rawClient : null
}

export const supabase = rawClient

export function isSupabaseReady() {
  return Boolean(url && akey)
}
