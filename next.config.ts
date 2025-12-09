import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',

  // ➡️ ADDED FOR STABLE SERVER ACTION IDs
  experimental: {
    // This setting ensures Server Action IDs remain consistent across builds,
    // solving the "Failed to find Server Action" error during rolling deployments.
    serverActions: {
      // Set the body size limit (e.g., '2mb') to trigger the stable ID feature.
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
}

export default nextConfig
