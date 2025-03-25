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
        crypto: false,
        child_process: false,
        dns: false,
        os: false,
        path: false,
        stream: false,
        http: false,
        https: false,
        zlib: false,
        async_hooks: false,
        perf_hooks: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;
