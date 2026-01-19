/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable Turbopack due to panic bug in Next.js 16.1.0
  turbopack: false,
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
