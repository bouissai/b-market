// next.config.ts
import type { NextConfig } from 'next'
import { withSentryConfig } from '@sentry/nextjs'

const nextConfig: NextConfig = {
  output: 'standalone',
  productionBrowserSourceMaps: true,
  compress: true,

  // ✅ Turbopack config au bon niveau (PAS dans "experimental")
  // et syntaxe ESM-compatible (pas de __dirname en TS/ESM)
  turbopack: {
    root: new URL('.', import.meta.url).pathname,
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
  },
}

export default withSentryConfig(nextConfig, {
  org: 'ilyass-tb',
  project: 'javascript-nextjs',
  silent: !process.env.CI,
  widenClientFileUpload: true,
  tunnelRoute: '/monitoring',
  disableLogger: true,
  automaticVercelMonitors: true,
})
