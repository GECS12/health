/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  // Allow Sanity images
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },
  experimental: {
  }
};

export default nextConfig;
