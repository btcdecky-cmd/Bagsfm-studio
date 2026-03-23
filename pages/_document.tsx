import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Favicon */}
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#00ff88" />

        {/* Default SEO */}
        <meta name="description" content="bagsfm Studio — Real-time Solana developer platform. Build in public, track on-chain activity, deploy programs, and showcase your projects." />
        <meta name="keywords" content="Solana, developer, blockchain, DeFi, NFT, build in public, on-chain" />
        <meta name="author" content="bagsfm" />

        {/* Open Graph */}
        <meta property="og:type"        content="website" />
        <meta property="og:title"       content="bagsfm Studio — Build in Public on Solana" />
        <meta property="og:description" content="Real-time Solana developer platform. Track deployments, monitor on-chain events, and showcase what you're building." />
        <meta property="og:site_name"   content="bagsfm Studio" />

        {/* Twitter Card */}
        <meta name="twitter:card"        content="summary" />
        <meta name="twitter:title"       content="bagsfm Studio" />
        <meta name="twitter:description" content="Build in public on Solana. Track deployments, on-chain events, and showcase your projects." />

        {/* Font performance hints */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
