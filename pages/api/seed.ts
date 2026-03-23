import type { NextApiRequest, NextApiResponse } from 'next'
import { query } from '../../lib/db'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const now = Date.now()
  const ago = (ms: number) => new Date(now - ms).toISOString()

  try {
    const { rows: existing } = await query('SELECT count(*) as c FROM projects')
    if (parseInt(existing[0].c) > 0) {
      return res.status(200).json({ message: 'Data already exists' })
    }

    await query(`
      INSERT INTO projects (name, description, author, category, network, status, votes, tx_count, created_at, updated_at) VALUES
      ('SolSwap AMM', 'High-performance AMM with concentrated liquidity', 'cryptodev.sol', 'DeFi', 'mainnet-beta', 'active', 154, 84321, $1, $1),
      ('Token Staking Vault', 'Non-custodial staking with auto-compound rewards', 'staker.sol', 'DeFi', 'devnet', 'testing', 87, 3200, $2, $2),
      ('PixelDao NFTs', 'On-chain generative art with trait rarity', 'nftbuilder.sol', 'NFT', 'mainnet-beta', 'active', 212, 10000, $3, $3),
      ('LiquidityPool Pro', 'Multi-asset liquidity pools with governance', 'defidev.sol', 'DeFi', 'mainnet-beta', 'active', 65, 42000, $4, $4),
      ('SolDAO Governance', 'On-chain DAO with quadratic voting', 'daomaster.sol', 'DAO', 'mainnet-beta', 'paused', 38, 890, $5, $5),
      ('Cross-chain Bridge', 'Wormhole-based ETH-SOL bridge', 'solbuilder.eth', 'Infrastructure', 'devnet', 'testing', 93, 540, $6, $6)
    `, [ago(86400000), ago(172800000), ago(259200000), ago(345600000), ago(432000000), ago(518400000)])

    await query(`
      INSERT INTO builder_feed (author, project_name, action_type, title, description, created_at) VALUES
      ('cryptodev.sol', 'SolSwap AMM', 'deploy', 'Program v2.1 deployed to mainnet-beta', 'Compute budget optimized — 40% cheaper swaps', $1),
      ('staker.sol', 'Token Staking Vault', 'milestone', '450 new stake accounts opened today', 'TVL crossed $2.4M', $2),
      ('nftbuilder.sol', 'PixelDao NFTs', 'nft', 'Launched 10,000 NFT collection on-chain', 'Generative art with on-chain traits', $3),
      ('defidev.sol', 'LiquidityPool Pro', 'token', 'New SPL token minted: $LPRO', 'Governance token — 1B supply, 60% locked', $4),
      ('solbuilder.eth', 'Cross-chain Bridge', 'update', 'Wormhole integration complete', 'ETH-SOL bridge live on devnet', $5),
      ('daomaster.sol', 'SolDAO Governance', 'vote', 'Governance proposal #14 passed', '87% approval', $6),
      ('anchordev.sol', 'Perp DEX', 'deploy', 'Perpetuals program deployed to devnet', 'Up to 20x leverage via Pyth', $7)
    `, [ago(240000), ago(3660000), ago(7200000), ago(10800000), ago(18000000), ago(21600000), ago(28800000)])

    await query(`
      INSERT INTO on_chain_events (type, program, signature, amount, slot, status, created_at) VALUES
      ('SWAP', 'SolSwap AMM', '5ey8h4f3fKm001', '12,450 USDC → 48.2 SOL', 287641023, 'confirmed', $1),
      ('STAKE', 'Token Staking', 'BPFLoad11112', '5,000 $TSOL staked', 287641018, 'finalized', $2),
      ('NFT_MINT', 'PixelDao', 'TokenkQfeYY3', '1 NFT #4821', 287641010, 'finalized', $3),
      ('LIQUIDITY', 'LiquidityPool Pro', 'Gov1La8gNDe4', '250,000 USDC added', 287640998, 'confirmed', $4),
      ('SWAP', 'SolSwap AMM', 'whirLbMRaq55', '8.5 SOL → 2,180 USDC', 287640985, 'finalized', $5),
      ('VOTE', 'SolDAO Governance', '3xKm9pvT4q6', 'Proposal #14 voted YES', 287640970, 'finalized', $6),
      ('TOKEN_CREATE', 'LiquidityPool Pro', 'Dxc3mN88rP7', '$LPRO — 1B minted', 287640944, 'finalized', $7)
    `, [ago(8000), ago(22000), ago(45000), ago(90000), ago(130000), ago(200000), ago(310000)])

    await query(`
      INSERT INTO notifications (type, title, message, read, created_at) VALUES
      ('deploy', 'SolSwap AMM deployed', 'Program v2.1 is live on mainnet-beta', false, $1),
      ('vote', '16 new votes this week', 'Your projects received 16 upvotes', false, $2),
      ('milestone', 'TVL milestone: $2.4M', 'Token Staking Vault crossed $2.4M TVL', true, $3),
      ('follow', 'anchordev.sol followed you', null, true, $4)
    `, [ago(240000), ago(7200000), ago(18000000), ago(28800000)])

    res.status(200).json({ status: 'ok', message: 'Seed data inserted' })
  } catch (e) {
    res.status(500).json({ error: (e as Error).message })
  }
}
