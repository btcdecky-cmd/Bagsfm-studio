/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  serverExternalPackages: ['@solana/web3.js'],
  allowedDevOrigins: ['*.replit.dev', '*.spock.replit.dev', '*.repl.co'],
  images: {
    remotePatterns: [],
  },
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        { key: 'X-Content-Type-Options',    value: 'nosniff'        },
        { key: 'X-Frame-Options',            value: 'SAMEORIGIN'     },
        { key: 'X-XSS-Protection',           value: '1; mode=block'  },
        { key: 'Referrer-Policy',            value: 'strict-origin-when-cross-origin' },
      ],
    },
  ],
}

module.exports = nextConfig
