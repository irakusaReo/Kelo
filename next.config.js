/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  optimizeFonts: false,
  // Fix Terser build errors
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  webpack: (config, { dev, isServer }) => {
    // Fix for HeartbeatWorker and other worker-related issues
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };

    // Optimize chunks to avoid Terser issues
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        minimize: true,
        minimizer: [
          ...config.optimization.minimizer.filter(
            (plugin) => plugin.constructor.name !== 'TerserPlugin'
          ),
        ],
      };
    }

    return config;
  },
  env: {
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    WALLET_ENCRYPTION_KEY: process.env.WALLET_ENCRYPTION_KEY,
    BASE_RPC_URL: process.env.BASE_RPC_URL,
    NEXT_FONT_GOOGLE_OPTIMIZED: 'false',
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin-allow-popups',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;