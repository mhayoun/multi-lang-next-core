import withPWAInit from 'next-pwa';

const withPWA = withPWAInit({
  dest: 'public',
  // Désactivé en dev par défaut pour éviter les problèmes de cache
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  // Support for your local network development
  experimental: {
    allowedDevOrigins: ['192.168.150.139', 'localhost:3000'],
  },
  // FIX: Ensures the browser reaches the static JSON files in your subdirectories
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