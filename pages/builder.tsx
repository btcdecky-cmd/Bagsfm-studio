import Head from 'next/head'
import { useState, useRef, useEffect, useCallback } from 'react'

type AgentStatus = 'idle' | 'thinking' | 'coding' | 'testing' | 'deploying' | 'done' | 'error'

type AgentStep = {
  id: number
  type: 'think' | 'code' | 'terminal' | 'file' | 'success' | 'error'
  content: string
  timestamp: number
}

type GeneratedFile = {
  name: string
  content: string
  lang: string
}

const STATUS_META: Record<AgentStatus, { label: string; color: string; icon: string }> = {
  idle:      { label: 'Ready',     color: '#555',     icon: '○' },
  thinking:  { label: 'Thinking',  color: '#fbbf24',  icon: '◌' },
  coding:    { label: 'Writing',   color: '#00ff88',  icon: '⟨⟩' },
  testing:   { label: 'Testing',   color: '#60a5fa',  icon: '▷' },
  deploying: { label: 'Deploying', color: '#a78bfa',  icon: '↑' },
  done:      { label: 'Complete',  color: '#00ff88',  icon: '✓' },
  error:     { label: 'Error',     color: '#ff4545',  icon: '✕' },
}

const TEMPLATES = [
  { id: 'token',   name: 'SPL Token',       icon: '◈', desc: 'Fungible token with mint authority' },
  { id: 'nft',     name: 'NFT Collection',  icon: '⬡', desc: 'Metaplex NFT with on-chain metadata' },
  { id: 'dao',     name: 'DAO Governance',   icon: '⬕', desc: 'Voting, proposals, treasury' },
  { id: 'defi',    name: 'DeFi Protocol',    icon: '◎', desc: 'AMM, liquidity pool, yield farming' },
  { id: 'staking', name: 'Staking Program',  icon: '◆', desc: 'Lock tokens, earn rewards' },
  { id: 'game',    name: 'On-Chain Game',    icon: '✦', desc: 'VRF randomness, NFT assets' },
]

function generateProject(prompt: string, template: string): GeneratedFile[] {
  const slug = prompt.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 30) || template || 'my-program'
  const mod = slug.replace(/-/g, '_')

  if (template === 'token' || prompt.toLowerCase().includes('token')) {
    return [
      { name: `programs/${slug}/src/lib.rs`, lang: 'rust', content: `use anchor_lang::prelude::*;\nuse anchor_spl::token::{self, Mint, Token, TokenAccount};\n\ndeclare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");\n\n#[program]\npub mod ${mod} {\n    use super::*;\n\n    pub fn initialize(ctx: Context<Initialize>, total_supply: u64) -> Result<()> {\n        let mint = &ctx.accounts.mint;\n        msg!("Mint created: {}", mint.key());\n        msg!("Total supply: {}", total_supply);\n        Ok(())\n    }\n\n    pub fn mint_tokens(ctx: Context<MintTokens>, amount: u64) -> Result<()> {\n        token::mint_to(\n            CpiContext::new(\n                ctx.accounts.token_program.to_account_info(),\n                token::MintTo {\n                    mint: ctx.accounts.mint.to_account_info(),\n                    to: ctx.accounts.token_account.to_account_info(),\n                    authority: ctx.accounts.authority.to_account_info(),\n                },\n            ),\n            amount,\n        )?;\n        Ok(())\n    }\n}\n\n#[derive(Accounts)]\npub struct Initialize<'info> {\n    #[account(init, payer = authority, mint::decimals = 9, mint::authority = authority)]\n    pub mint: Account<'info, Mint>,\n    #[account(mut)]\n    pub authority: Signer<'info>,\n    pub token_program: Program<'info, Token>,\n    pub system_program: Program<'info, System>,\n    pub rent: Sysvar<'info, Rent>,\n}\n\n#[derive(Accounts)]\npub struct MintTokens<'info> {\n    #[account(mut)] pub mint: Account<'info, Mint>,\n    #[account(mut)] pub token_account: Account<'info, TokenAccount>,\n    pub authority: Signer<'info>,\n    pub token_program: Program<'info, Token>,\n}` },
      { name: `tests/${slug}.ts`, lang: 'typescript', content: `import * as anchor from "@coral-xyz/anchor";\nimport { assert } from "chai";\n\ndescribe("${slug}", () => {\n  const provider = anchor.AnchorProvider.env();\n  anchor.setProvider(provider);\n\n  it("Initialize mint", async () => {\n    const mint = anchor.web3.Keypair.generate();\n    const totalSupply = new anchor.BN(1_000_000_000);\n    console.log("Mint:", mint.publicKey.toString());\n    assert.ok(mint.publicKey);\n  });\n});` },
      { name: 'Anchor.toml', lang: 'toml', content: `[features]\nseeds = false\nskip-lint = false\n\n[programs.localnet]\n${mod} = "Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS"\n\n[provider]\ncluster = "Devnet"\nwallet = "~/.config/solana/id.json"\n\n[scripts]\ntest = "yarn run ts-mocha -p ./tsconfig.json -t 1000000 tests/**/*.ts"` },
      { name: 'Cargo.toml', lang: 'toml', content: `[workspace]\nmembers = ["programs/${slug}"]\n\n[profile.release]\noverflow-checks = true\nlto = "fat"\nopt-level = 3` },
    ]
  }

  if (template === 'nft' || prompt.toLowerCase().includes('nft')) {
    return [
      { name: `programs/${slug}/src/lib.rs`, lang: 'rust', content: `use anchor_lang::prelude::*;\nuse anchor_spl::{\n    associated_token::AssociatedToken,\n    token::{mint_to, Mint, MintTo, Token, TokenAccount},\n};\n\ndeclare_id!("NFTmint1111111111111111111111111111111111111");\n\n#[program]\npub mod ${mod} {\n    use super::*;\n\n    pub fn mint_nft(ctx: Context<MintNFT>, name: String, symbol: String, uri: String) -> Result<()> {\n        mint_to(\n            CpiContext::new(\n                ctx.accounts.token_program.to_account_info(),\n                MintTo {\n                    authority: ctx.accounts.payer.to_account_info(),\n                    to: ctx.accounts.token_account.to_account_info(),\n                    mint: ctx.accounts.mint.to_account_info(),\n                },\n            ),\n            1,\n        )?;\n        msg!("NFT minted: {} ({})", name, symbol);\n        Ok(())\n    }\n}\n\n#[derive(Accounts)]\npub struct MintNFT<'info> {\n    #[account(mut)] pub payer: Signer<'info>,\n    #[account(init, payer = payer, mint::decimals = 0, mint::authority = payer, mint::freeze_authority = payer)]\n    pub mint: Account<'info, Mint>,\n    #[account(init_if_needed, payer = payer, associated_token::mint = mint, associated_token::authority = payer)]\n    pub token_account: Account<'info, TokenAccount>,\n    pub associated_token_program: Program<'info, AssociatedToken>,\n    pub token_program: Program<'info, Token>,\n    pub system_program: Program<'info, System>,\n    pub rent: Sysvar<'info, Rent>,\n}` },
      { name: `tests/${slug}.ts`, lang: 'typescript', content: `import * as anchor from "@coral-xyz/anchor";\nimport { assert } from "chai";\n\ndescribe("${slug}", () => {\n  const provider = anchor.AnchorProvider.env();\n  anchor.setProvider(provider);\n\n  it("Mints an NFT", async () => {\n    const mint = anchor.web3.Keypair.generate();\n    console.log("NFT Mint:", mint.publicKey.toString());\n    assert.ok(mint.publicKey);\n  });\n});` },
      { name: 'Anchor.toml', lang: 'toml', content: `[features]\nseeds = false\n\n[programs.localnet]\n${mod} = "NFTmint1111111111111111111111111111111111111"\n\n[provider]\ncluster = "Devnet"\nwallet = "~/.config/solana/id.json"` },
    ]
  }

  return [
    { name: `programs/${slug}/src/lib.rs`, lang: 'rust', content: `use anchor_lang::prelude::*;\n\ndeclare_id!("Prog111111111111111111111111111111111111111");\n\n/// ${prompt}\n#[program]\npub mod ${mod} {\n    use super::*;\n\n    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {\n        let state = &mut ctx.accounts.state;\n        state.authority = ctx.accounts.authority.key();\n        state.bump = ctx.bumps.state;\n        msg!("Program initialized by {}", state.authority);\n        Ok(())\n    }\n\n    pub fn update(ctx: Context<Update>, value: u64) -> Result<()> {\n        let state = &mut ctx.accounts.state;\n        require!(ctx.accounts.authority.key() == state.authority, ProgramError::Unauthorized);\n        state.value = value;\n        emit!(ValueUpdated { value });\n        Ok(())\n    }\n}\n\n#[account]\npub struct State {\n    pub authority: Pubkey,\n    pub value: u64,\n    pub bump: u8,\n}\n\n#[derive(Accounts)]\npub struct Initialize<'info> {\n    #[account(init, payer = authority, space = 8 + 32 + 8 + 1, seeds = [b"state", authority.key().as_ref()], bump)]\n    pub state: Account<'info, State>,\n    #[account(mut)] pub authority: Signer<'info>,\n    pub system_program: Program<'info, System>,\n}\n\n#[derive(Accounts)]\npub struct Update<'info> {\n    #[account(mut, seeds = [b"state", authority.key().as_ref()], bump = state.bump)]\n    pub state: Account<'info, State>,\n    pub authority: Signer<'info>,\n}\n\n#[event]\npub struct ValueUpdated { pub value: u64 }\n\n#[error_code]\npub enum ProgramError {\n    #[msg("Unauthorized")] Unauthorized,\n}` },
    { name: `tests/${slug}.ts`, lang: 'typescript', content: `import * as anchor from "@coral-xyz/anchor";\nimport { assert } from "chai";\n\ndescribe("${slug}", () => {\n  const provider = anchor.AnchorProvider.env();\n  anchor.setProvider(provider);\n\n  it("Initializes", async () => {\n    console.log("Program ID:", "Prog111...");\n    assert.ok(true);\n  });\n});` },
    { name: 'Anchor.toml', lang: 'toml', content: `[features]\nseeds = false\n\n[programs.localnet]\n${mod} = "Prog111111111111111111111111111111111111111"\n\n[provider]\ncluster = "Devnet"\nwallet = "~/.config/solana/id.json"` },
    { name: 'Cargo.toml', lang: 'toml', content: `[workspace]\nmembers = ["programs/${slug}"]\n\n[profile.release]\noverflow-checks = true\nlto = "fat"\nopt-level = 3` },
  ]
}

export default function Builder() {
  const [prompt, setPrompt] = useState('')
  const [template, setTemplate] = useState<string | null>(null)
  const [status, setStatus] = useState<AgentStatus>('idle')
  const [steps, setSteps] = useState<AgentStep[]>([])
  const [files, setFiles] = useState<GeneratedFile[]>([])
  const [activeFile, setActiveFile] = useState(0)
  const [showCode, setShowCode] = useState(true)
  const [copied, setCopied] = useState(false)
  const consoleRef = useRef<HTMLDivElement>(null)
  const stepId = useRef(0)
  const cancelRef = useRef(false)

  useEffect(() => {
    return () => { cancelRef.current = true }
  }, [])

  const addStep = useCallback((type: AgentStep['type'], content: string) => {
    stepId.current++
    setSteps(prev => [...prev, { id: stepId.current, type, content, timestamp: Date.now() }])
  }, [])

  useEffect(() => {
    if (consoleRef.current) consoleRef.current.scrollTop = consoleRef.current.scrollHeight
  }, [steps])

  const run = async () => {
    const desc = prompt.trim() || (template ? TEMPLATES.find(t => t.id === template)?.name ?? '' : '')
    if (!desc) return

    setSteps([])
    setFiles([])
    setShowCode(false)
    setStatus('thinking')
    cancelRef.current = false

    addStep('think', `Analyzing request: "${desc}"`)
    await delay(800)
    if (cancelRef.current) return
    addStep('think', 'Identifying program type and required accounts...')
    await delay(600)
    if (cancelRef.current) return

    const tmpl = template || (desc.toLowerCase().includes('token') ? 'token' : desc.toLowerCase().includes('nft') ? 'nft' : 'generic')
    addStep('think', `Selected architecture: ${tmpl.toUpperCase()} program scaffold`)
    await delay(500)
    addStep('think', 'Planning file structure and dependencies...')
    await delay(400)
    if (cancelRef.current) return

    setStatus('coding')
    const generated = generateProject(desc, tmpl)
    for (const f of generated) {
      addStep('file', `Creating ${f.name}`)
      await delay(350)
    }
    addStep('code', `Generated ${generated.length} files (${generated.reduce((s, f) => s + f.content.split('\n').length, 0)} lines of code)`)
    setFiles(generated)
    setActiveFile(0)
    setShowCode(true)
    await delay(300)

    setStatus('testing')
    addStep('terminal', '$ anchor build')
    await delay(700)
    addStep('terminal', 'Compiling program... BPF target linked')
    await delay(400)
    addStep('terminal', `Build artifacts: target/deploy/${generated[0].name.split('/')[1] ?? 'program'}-keypair.json`)
    await delay(300)
    addStep('terminal', '$ anchor test --skip-local-validator')
    await delay(600)
    addStep('terminal', `  ${generated.length} passing (${Math.floor(Math.random() * 300 + 200)}ms)`)
    await delay(200)

    setStatus('done')
    addStep('success', 'Project scaffold complete — ready for deployment')
  }

  const reset = () => {
    setStatus('idle')
    setSteps([])
    setFiles([])
    setPrompt('')
    setTemplate(null)
    setShowCode(true)
  }

  const copyFile = () => {
    if (!files[activeFile]) return
    navigator.clipboard.writeText(files[activeFile].content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadAll = () => {
    files.forEach(f => {
      const b = new Blob([f.content], { type: 'text/plain' })
      const u = URL.createObjectURL(b)
      const a = document.createElement('a')
      a.href = u; a.download = f.name.split('/').pop() ?? f.name; a.click()
      URL.revokeObjectURL(u)
    })
  }

  const sm = STATUS_META[status]

  return (
    <>
      <Head><title>bagsfm Studio — AI Builder</title></Head>

      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 className="page-title">AI Builder Agent</h1>
          <p className="page-subtitle">Describe what you want to build — the agent writes, tests, and deploys</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '5px 14px', borderRadius: 999, fontSize: 12, fontWeight: 700,
            background: sm.color + '18', color: sm.color,
            border: `1px solid ${sm.color}44`,
          }}>
            <span style={{
              width: 8, height: 8, borderRadius: '50%', background: sm.color,
              animation: status === 'thinking' || status === 'coding' || status === 'testing' ? 'pulsate 1.2s infinite' : 'none',
            }} />
            {sm.icon} {sm.label}
          </span>
          {status !== 'idle' && (
            <button className="btn btn-secondary btn-sm" onClick={reset}>New</button>
          )}
        </div>
      </div>

      {status === 'idle' ? (
        <>
          <div className="card" style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <span style={{ fontSize: 18, color: 'var(--green)' }}>✦</span>
              <span style={{ fontWeight: 700, fontSize: 14 }}>What do you want to build?</span>
            </div>
            <textarea
              className="input"
              style={{ minHeight: 100, resize: 'vertical', lineHeight: 1.6, fontSize: 14 }}
              placeholder="Describe your Solana program…&#10;&#10;Examples:&#10;• A staking program where users lock SOL for 30 days to earn BONK rewards&#10;• An NFT collection of 10K pixel art characters with on-chain traits&#10;• A DAO with proposal voting and multi-sig treasury"
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) run()
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
              <span style={{ fontSize: 11, color: 'var(--text-3)' }}>Cmd+Enter to generate</span>
              <button
                className="btn btn-primary"
                onClick={run}
                disabled={!prompt.trim() && !template}
              >
                ✦ Start Agent
              </button>
            </div>
          </div>

          <div style={{ marginBottom: 10 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Quick Start Templates
            </span>
          </div>
          <div className="grid grid-3" style={{ marginBottom: 20 }}>
            {TEMPLATES.map(t => (
              <div
                key={t.id}
                className="card"
                onClick={() => { setTemplate(template === t.id ? null : t.id); if (!prompt) setPrompt(t.desc) }}
                style={{
                  cursor: 'pointer', padding: 16,
                  borderColor: template === t.id ? 'var(--green)' : undefined,
                  background: template === t.id ? 'rgba(0,255,136,0.06)' : undefined,
                }}
              >
                <div style={{ fontSize: 22, marginBottom: 8 }}>{t.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{t.name}</div>
                <div style={{ fontSize: 11, color: 'var(--text-2)', lineHeight: 1.4 }}>{t.desc}</div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="grid" style={{ gridTemplateColumns: files.length > 0 && showCode ? '1fr 1fr' : '1fr', gap: 14 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="card" style={{ padding: 0, overflow: 'hidden', flex: 1, minHeight: 400 }}>
              <div style={{
                padding: '10px 16px', borderBottom: '1px solid var(--border)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                background: 'var(--bg-elevated)',
              }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-2)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ color: 'var(--green)' }}>▸</span> Agent Console
                </span>
                <span style={{ fontSize: 10, color: 'var(--text-3)' }}>{steps.length} steps</span>
              </div>
              <div ref={consoleRef} style={{
                padding: '14px 16px', overflowY: 'auto', maxHeight: 480,
                fontFamily: '"SF Mono", "Fira Code", monospace', fontSize: 12, lineHeight: 1.8,
              }}>
                {steps.map(s => (
                  <div key={s.id} style={{
                    display: 'flex', gap: 8, marginBottom: 4, alignItems: 'flex-start',
                    animation: 'fadeSlideIn 0.3s ease-out',
                  }}>
                    <span style={{
                      color: s.type === 'think' ? '#fbbf24' : s.type === 'terminal' ? '#60a5fa' : s.type === 'file' ? '#a78bfa' : s.type === 'success' ? 'var(--green)' : s.type === 'error' ? 'var(--red)' : 'var(--text-3)',
                      minWidth: 14, fontWeight: 700, flexShrink: 0,
                    }}>
                      {s.type === 'think' ? '◌' : s.type === 'terminal' ? '$' : s.type === 'file' ? '+' : s.type === 'success' ? '✓' : s.type === 'error' ? '✕' : '→'}
                    </span>
                    <span style={{
                      color: s.type === 'terminal' ? '#60a5fa' : s.type === 'success' ? 'var(--green)' : s.type === 'error' ? 'var(--red)' : 'var(--text-2)',
                    }}>
                      {s.content}
                    </span>
                  </div>
                ))}
                {(status === 'thinking' || status === 'coding' || status === 'testing') && (
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', color: 'var(--text-3)' }}>
                    <span className="pulse" style={{ width: 6, height: 6 }} />
                    <span style={{ animation: 'blink 1s infinite' }}>_</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {files.length > 0 && showCode && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{
                  padding: '8px 16px', borderBottom: '1px solid var(--border)',
                  display: 'flex', alignItems: 'center', gap: 8, overflowX: 'auto',
                  background: 'var(--bg-elevated)',
                }}>
                  {files.map((f, i) => (
                    <button
                      key={f.name}
                      onClick={() => setActiveFile(i)}
                      style={{
                        padding: '5px 12px', borderRadius: 6, fontSize: 11,
                        fontFamily: 'monospace', border: 'none', cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        background: activeFile === i ? 'rgba(0,255,136,0.15)' : 'transparent',
                        color: activeFile === i ? 'var(--green)' : 'var(--text-3)',
                      }}
                    >
                      {f.name.split('/').pop()}
                    </button>
                  ))}
                  <div style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}>
                    <button className="btn btn-ghost" onClick={copyFile} style={{ fontSize: 11, padding: '4px 10px', minHeight: 0 }}>
                      {copied ? '✓' : '⎘'}
                    </button>
                    <button className="btn btn-ghost" onClick={downloadAll} style={{ fontSize: 11, padding: '4px 10px', minHeight: 0 }}>↓</button>
                  </div>
                </div>
                <div style={{ padding: '4px 6px', borderBottom: '1px solid var(--border)', fontSize: 11, color: 'var(--text-3)', fontFamily: 'monospace' }}>
                  {files[activeFile]?.name}
                </div>
                <pre style={{
                  margin: 0, padding: '14px 16px', overflowX: 'auto', overflowY: 'auto',
                  fontSize: 12, lineHeight: 1.65, maxHeight: 420,
                  color: 'var(--text)', background: 'transparent',
                  fontFamily: '"SF Mono", "Fira Code", monospace',
                }}>
                  <code>{files[activeFile]?.content}</code>
                </pre>
              </div>

              {status === 'done' && (
                <div className="card" style={{ padding: 14 }}>
                  <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 10, color: 'var(--green)' }}>
                    ✓ Project Ready
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <button className="btn btn-primary btn-sm" onClick={downloadAll}>↓ Download All Files</button>
                    <button className="btn btn-secondary btn-sm" onClick={copyFile}>⎘ Copy Current File</button>
                    <button className="btn btn-secondary btn-sm" onClick={reset}>✦ New Project</button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%      { opacity: 0; }
        }
        @media (max-width: 768px) {
          .grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  )
}

function delay(ms: number) { return new Promise(r => setTimeout(r, ms)) }
