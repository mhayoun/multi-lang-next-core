import withPWAInit from 'next-pwa';

// Debug: Check environment on startup
console.log('--- NEXT CONFIG STARTUP ---');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('CLIENT_ID:', process.env.NEXT_PUBLIC_CLIENT_ID);
console.log('---------------------------');

const withPWA = withPWAInit({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb',
    },
  },
  reactCompiler: true,

  async headers() {
    // Debug log when headers are initialized
    console.log('[NextConfig] Applying PWA MIME type headers...');
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

  async rewrites() {
    // Debug log when rewrites are initialized
    console.log('[NextConfig] Initializing Multi-Tenant Rewrites...');
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