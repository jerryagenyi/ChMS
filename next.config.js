/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't attempt to load these Node.js modules on the client side
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
        crypto: require.resolve('crypto-browserify'),
        child_process: false,
        dns: false,
        os: false,
        path: false,
        stream: require.resolve('stream-browserify'),
        http: false,
        https: false,
        zlib: false,
        async_hooks: false,
        perf_hooks: false,
      };
    }

    // Handle native modules
    config.externals = [...(config.externals || [])];
    if (isServer) {
      config.externals.push('@node-rs/argon2');
    }

    return config;
  },
};

module.exports = nextConfig;
