import pg from 'pg'

const { Pool } = pg

let pool: pg.Pool | null = null

export function getPool(): pg.Pool {
  if (!pool) {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL must be set')
    }
    pool = new Pool({ connectionString: process.env.DATABASE_URL })
  }
  return pool
}

export async function query(text: string, params?: unknown[]) {
  const p = getPool()
  return p.query(text, params)
}
