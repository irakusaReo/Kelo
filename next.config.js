/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  optimizeFonts: false,
  // Fix Terser build errors
  swcMinify: false, // Disable SWC minification to avoid worker issues
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

    // Exclude problematic worker files from minification
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        minimize: false,
        minimizer: config.optimization.minimizer.map((plugin) => {
          if (plugin.constructor.name === 'TerserPlugin') {
            return {
              ...plugin,
              options: {
                ...plugin.options,
                exclude: [
                  /HeartbeatWorker/,
                  /\.worker\./,
                  /worker\.js$/,
                ],
                terserOptions: {
                  ...plugin.options.terserOptions,
                  parse: {
                    ecma: 2020,
                  },
                  compress: {
                    ecma: 2020,
                    drop_console: true,
                    drop_debugger: true,
                  },
                  mangle: {
                    safari10: true,
                  },
                  format: {
                    ecma: 2020,
                    safari10: true,
                  },
                },
              },
            };
          }
          return plugin;
        }),
      };
    }

    // Handle worker files properly
    config.module.rules.push({
      test: /\.worker\.(js|ts)$/,
      use: {
        loader: 'worker-loader',
        options: {
          name: 'static/[hash].worker.js',
          publicPath: '/_next/',
        },
      },
    });

    // Ignore problematic modules during build
    config.externals = config.externals || [];
    if (!isServer) {
      config.externals.push({
        'utf-8-validate': 'commonjs utf-8-validate',
        'bufferutil': 'commonjs bufferutil',
      });
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
  // Additional build optimizations for Netlify
  experimental: {
    esmExternals: 'loose',
    serverComponentsExternalPackages: ['@wagmi/core', 'viem'],
  },
  // Ensure proper output for static export
  output: 'standalone',
  distDir: '.next',
};

module.exports = nextConfig;