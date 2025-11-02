/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  
  // External packages for server components
  serverExternalPackages: ['wagmi', 'viem'],
  
  // Performance optimizations
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Turbopack optimizations
  experimental: {
    optimizeCss: true,
    esmExternals: true,
    optimizePackageImports: ['@rainbow-me/rainbowkit', 'wagmi', 'viem'],
    turbo: {
      loaders: {
        '.svg': ['@svgr/webpack'],
      },
    },
  },
  
  // Optimize images
  images: {
    unoptimized: true,
  },
  
  // Disable source maps for faster builds
  productionBrowserSourceMaps: false,
  
  // Enable static optimization
  trailingSlash: false,
  
  // Fix CORS and add caching
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin-allow-popups',
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'unsafe-none',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, stale-while-revalidate=86400',
          },
        ],
      },
    ];
  },
};

export default nextConfig;