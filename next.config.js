/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Add custom domains if needed
  images: {
    domains: [],
  },
};

module.exports = nextConfig;
