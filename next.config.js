/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Fixes npm packages that depend on `fs` module
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      };
    }

    // Configure loading of wasm files
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
      layers: true,
      topLevelAwait: true,
    };

    // Add rule for .wasm files
    config.module.rules.push({
      test: /\.wasm$/,
      type: 'asset/resource',
      generator: {
        filename: 'static/wasm/[name][ext]'
      }
    });

    return config;
  },
  // Enable experimental features
  experimental: {
    // Fix the serverActions value to be an object
    serverActions: {
      allowedOrigins: ['*']
    }
  },
  // Add headers required for SharedArrayBuffer and CORS
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp',
          },
          {
            key: 'Cross-Origin-Resource-Policy',
            value: 'cross-origin',
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'X-Requested-With, Content-Type, Authorization',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self' 'unsafe-eval' 'unsafe-inline' data: blob:; worker-src 'self' blob:; connect-src 'self' blob: data: ws: wss:;"
          }
        ],
      },
      {
        source: '/static/wasm/:path*',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/wasm'
          }
        ]
      }
    ];
  }
}

module.exports = nextConfig; 