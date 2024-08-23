/** @type {import('next').NextConfig} */

const nextConfig = {
  webpack: (config) => {
    config.infrastructureLogging = {
      level: 'error',
    };
    return config;
  },
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
  },
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
