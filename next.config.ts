import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  cacheComponents: true, // Enable PPR and use cache directive
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
      },
    ],
  },
}

export default nextConfig
