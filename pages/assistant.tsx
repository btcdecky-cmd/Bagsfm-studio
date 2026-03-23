import Head from 'next/head'
import { useState, useRef, useEffect, useCallback } from 'react'

type Msg = { role: 'user' | 'assistant'; content: string; typing?: boolean }

const SUGGESTIONS = [
  'How do I deploy a program with Anchor?',
  'Explain PDA accounts with code examples',
  'What is the current Solana TPS?',
  'How do I set up a Helius webhook?',
  'Write a token transfer instruction',
  'How does CPI work in Anchor?',
]

const KNOWLEDGE: [RegExp, string][] = [
  [/anchor|deploy/i, `## Deploying with Anchor

\`\`\`bash
# Install Anchor CLI
cargo install --git https://github.com/coral-xyz/anchor avm --locked
avm install latest && avm use latest

# Create project
anchor init my-program && cd my-program

# Build & deploy
anchor build
anchor deploy --provider.cluster devnet

# Run tests
anchor test --skip-local-validator
\`\`\`

**Key steps:**
1. Fund your wallet: \`solana airdrop 2\`
2. Set cluster: \`solana config set --url devnet\`
3. Build creates the program keypair in \`target/deploy/\`
4. Deploy uploads the BPF binary to the chain

> Tip: Use \`anchor test\` in CI to verify before mainnet deploys.`],

  [/pda|program derived/i, `## Program Derived Addresses (PDAs)

PDAs are deterministic addresses owned by a program — they can sign transactions without a private key.

\`\`\`rust
// Finding a PDA
#[derive(Accounts)]
pub struct CreateVault<'info> {
    #[account(
        init,
        payer = user,
        space = 8 + 32 + 8,
        seeds = [b"vault", user.key().as_ref()],
        bump
    )]
    pub vault: Account<'info, Vault>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}
\`\`\`

\`\`\`typescript
// Client-side PDA derivation
const [vaultPDA, bump] = PublicKey.findProgramAddressSync(
  [Buffer.from("vault"), wallet.publicKey.toBuffer()],
  programId
);
\`\`\`

**Why PDAs matter:**
- Deterministic: same seeds → same address
- Program-owned: only the program can sign
- Essential for escrows, vaults, state accounts
- Bump seed ensures the address is off-curve`],

  [/helius|webhook/i, `## Setting Up Helius Webhooks

Helius provides enhanced Solana data streams with parsed transaction types.

\`\`\`typescript
// 1. Register webhook via API
const webhook = await fetch("https://api.helius.xyz/v0/webhooks", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer YOUR_API_KEY"
  },
  body: JSON.stringify({
    webhookURL: "https://your-app.com/api/webhook/helius",
    transactionTypes: ["SWAP", "NFT_MINT", "TOKEN_TRANSFER"],
    accountAddresses: ["YOUR_PROGRAM_ID"],
    webhookType: "enhanced"
  })
});
\`\`\`

**Enhanced transaction types:** SWAP, NFT_MINT, NFT_SALE, TOKEN_TRANSFER, STAKE, VOTE, and 40+ more.

> In bagsfm Studio, point your webhook to \`/api/webhook/helius\` — it auto-writes to Supabase for real-time feeds.`],

  [/tps|transaction|performance/i, `## Solana Network Performance

| Metric | Value |
|--------|-------|
| Current TPS | ~3,000–5,000 |
| Theoretical max | 65,000 |
| Block time | ~400ms |
| Finality | ~5–12 seconds |
| Avg tx cost | ~$0.00025 |

\`\`\`typescript
// Query recent performance
const samples = await connection.getRecentPerformanceSamples(10);
const avgTps = samples.reduce((s, x) =>
  s + x.numTransactions / x.samplePeriodSecs, 0
) / samples.length;
console.log("Average TPS:", avgTps.toFixed(0));
\`\`\`

Monitor live at [solanabeach.io](https://solanabeach.io) or [solscan.io](https://solscan.io).`],

  [/token|spl|mint|transfer/i, `## SPL Token Transfer

\`\`\`typescript
import {
  getAssociatedTokenAddress,
  createTransferInstruction,
  TOKEN_PROGRAM_ID
} from "@solana/spl-token";

const fromATA = await getAssociatedTokenAddress(mint, fromWallet);
const toATA = await getAssociatedTokenAddress(mint, toWallet);

const ix = createTransferInstruction(
  fromATA,              // source
  toATA,                // destination
  fromWallet,           // owner/authority
  1_000_000_000,        // amount (9 decimals = 1 token)
  [],                   // multi-signers
  TOKEN_PROGRAM_ID
);

const tx = new Transaction().add(ix);
await sendAndConfirmTransaction(connection, tx, [payer]);
\`\`\`

> For Token-2022, replace \`TOKEN_PROGRAM_ID\` with \`TOKEN_2022_PROGRAM_ID\` and gain access to transfer hooks, confidential transfers, and metadata extensions.`],

  [/cpi|cross.?program/i, `## Cross-Program Invocation (CPI)

CPI lets your program call another program's instructions.

\`\`\`rust
use anchor_lang::prelude::*;
use anchor_spl::token::{self, Transfer, Token, TokenAccount};

pub fn transfer_tokens(ctx: Context<TransferCtx>, amount: u64) -> Result<()> {
    let cpi_accounts = Transfer {
        from: ctx.accounts.from.to_account_info(),
        to: ctx.accounts.to.to_account_info(),
        authority: ctx.accounts.authority.to_account_info(),
    };

    let cpi_ctx = CpiContext::new(
        ctx.accounts.token_program.to_account_info(),
        cpi_accounts
    );

    token::transfer(cpi_ctx, amount)?;
    Ok(())
}

// With PDA signer (signed CPI):
let seeds = &[b"vault", &[bump]];
let signer = &[&seeds[..]];
let cpi_ctx = CpiContext::new_with_signer(program, accounts, signer);
\`\`\`

**Rules:**
- Max 4 levels of CPI depth
- Accounts must be passed through the instruction
- PDA signers enable program-controlled escrows`],
]

function getReply(input: string): string {
  for (const [pattern, response] of KNOWLEDGE) {
    if (pattern.test(input)) return response
  }
  return `I can help with Solana development! Here are some things I know about:

- **Anchor framework** — building, testing, deploying programs
- **PDAs** — program derived addresses and seeds
- **SPL Tokens** — minting, transferring, Token-2022
- **CPI** — cross-program invocations
- **Helius** — webhooks and enhanced transaction data
- **Network** — TPS, finality, performance monitoring

Try asking about any of these topics, or describe what you're building and I'll help you get started.`
}

export default function Assistant() {
  const [messages, setMessages] = useState<Msg[]>([
    { role: 'assistant', content: "I'm your Solana AI assistant. I can help with Anchor programs, SPL tokens, PDAs, Helius webhooks, and more. What are you building?" }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const cancelRef = useRef(false)

  useEffect(() => {
    return () => { cancelRef.current = true }
  }, [])

  const send = useCallback(async (text?: string) => {
    const content = (text ?? input).trim()
    if (!content || loading) return
    setInput('')
    cancelRef.current = false
    setMessages(m => [...m, { role: 'user', content }])
    setLoading(true)

    const reply = getReply(content)
    setMessages(m => [...m, { role: 'assistant', content: '', typing: true }])

    for (let i = 0; i < reply.length; i += 3) {
      if (cancelRef.current) return
      const snapshot = reply.slice(0, i + 3)
      setMessages(m => {
        const copy = [...m]
        copy[copy.length - 1] = { role: 'assistant', content: snapshot, typing: true }
        return copy
      })
      await new Promise(r => setTimeout(r, 8))
    }

    if (cancelRef.current) return
    setMessages(m => {
      const copy = [...m]
      copy[copy.length - 1] = { role: 'assistant', content: reply }
      return copy
    })
    setLoading(false)
  }, [input, loading])

  const renderContent = (text: string) => {
    const parts = text.split(/(```[\s\S]*?```)/g)
    return parts.map((part, i) => {
      if (part.startsWith('```')) {
        const lines = part.slice(3, -3).split('\n')
        const lang = lines[0] || ''
        const code = lines.slice(1).join('\n')
        return (
          <div key={i} style={{
            margin: '10px 0', borderRadius: 8, overflow: 'hidden',
            border: '1px solid var(--border)',
          }}>
            <div style={{
              padding: '6px 12px', background: 'var(--bg-elevated)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              borderBottom: '1px solid var(--border)',
            }}>
              <span style={{ fontSize: 10, color: 'var(--text-3)', fontFamily: 'monospace' }}>{lang}</span>
              <button
                onClick={() => navigator.clipboard.writeText(code)}
                style={{
                  background: 'none', border: 'none', color: 'var(--text-3)',
                  cursor: 'pointer', fontSize: 11, padding: '2px 6px',
                }}
              >
                Copy
              </button>
            </div>
            <pre style={{
              margin: 0, padding: '12px 14px', overflowX: 'auto',
              fontSize: 12, lineHeight: 1.6, background: 'var(--bg)',
              fontFamily: '"SF Mono", "Fira Code", monospace', color: 'var(--text)',
            }}>
              <code>{code}</code>
            </pre>
          </div>
        )
      }
      const formatted = part
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/`([^`]+)`/g, '<code style="background:var(--bg-elevated);padding:1px 5px;border-radius:4px;font-size:12px;font-family:monospace;color:var(--green)">$1</code>')
        .replace(/^## (.*$)/gm, '<div style="font-weight:800;font-size:16px;margin:12px 0 8px;color:var(--text)">$1</div>')
        .replace(/^> (.*$)/gm, '<div style="border-left:3px solid var(--green-border);padding:6px 12px;margin:8px 0;color:var(--text-2);font-size:13px">$1</div>')
        .replace(/\| /g, '| ')
      return <span key={i} dangerouslySetInnerHTML={{ __html: formatted }} />
    })
  }

  return (
    <>
      <Head><title>bagsfm Studio — AI Assistant</title></Head>

      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 className="page-title">AI Assistant</h1>
          <p className="page-subtitle">Solana-native AI — ask about programs, tokens, deployments, and more</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span className="pulse" style={{ width: 6, height: 6 }} />
          <span style={{ fontSize: 11, color: 'var(--green)', fontWeight: 600 }}>ONLINE</span>
        </div>
      </div>

      <div className="chat-container">
        <div className="chat-messages">
          {messages.map((m, i) => (
            <div key={i} className={`message ${m.role}`}>
              <div className={`avatar ${m.role === 'assistant' ? 'avatar-ai' : 'avatar-user'}`}>
                {m.role === 'assistant' ? '✦' : 'U'}
              </div>
              <div className="message-bubble" style={{ whiteSpace: 'pre-wrap' }}>
                {m.role === 'assistant' ? renderContent(m.content) : m.content}
                {m.typing && (
                  <span style={{ animation: 'blink 1s infinite', color: 'var(--green)' }}>▊</span>
                )}
              </div>
            </div>
          ))}
          {loading && !messages[messages.length - 1]?.typing && (
            <div className="message assistant">
              <div className="avatar avatar-ai">✦</div>
              <div className="message-bubble" style={{ color: 'var(--text-3)' }}>
                <span className="pulse" style={{ width: 6, height: 6, marginRight: 6 }} />Thinking…
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {messages.length <= 1 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, paddingBottom: 14 }}>
            {SUGGESTIONS.map(s => (
              <button key={s} className="btn btn-secondary btn-sm" onClick={() => send(s)}>{s}</button>
            ))}
          </div>
        )}

        <div className="chat-input-area">
          <input
            className="input"
            placeholder="Ask about Solana development, programs, tokens, or deployments…"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
            disabled={loading}
          />
          <button className="btn btn-primary" onClick={() => send()} disabled={loading || !input.trim()} style={{ flexShrink: 0 }}>
            Send
          </button>
        </div>
      </div>

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </>
  )
}
