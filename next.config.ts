// 1. Remove the import line: import type { NextConfig } from 'next'
// 2. Remove the type annotation on nextConfig

const nextConfig = {
  output: 'standalone',

  // ➡️ Keep the 'experimental' block for Server Action stability
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },

  /* config options here */
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type' },
        ],
      },
    ]
  },
  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/uploads/:path*`,
      },
    ]
  },
}

// 3. Ensure the export is correct (no type annotation here either)
export default nextConfig
