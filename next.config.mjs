import withPWAInit from 'next-pwa';

const withPWA = withPWAInit({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  experimental: {
    allowedDevOrigins: ['192.168.150.139', 'localhost:3000'],
  },
  // FIX 1: Force correct MIME type for manifest files
  async headers() {
    return [
      {
        source: '/:tenant/manifest.json',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/manifest+json',
          },
        ],
      },
    ];
  },
  // FIX 2: Stop Next.js routing from swallowing the static files
  async rewrites() {
    return [
      {
        source: '/topclubcarmiel/:path*',
        destination: '/topclubcarmiel/:path*',
      },
      {
        source: '/beithanoar/:path*',
        destination: '/beithanoar/:path*',
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default withPWA(nextConfig);