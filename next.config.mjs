import withPWAInit from 'next-pwa';

// Debug: Check environment on startup
console.log('--- NEXT CONFIG STARTUP ---');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('CLIENT_ID:', process.env.NEXT_PUBLIC_CLIENT_ID);
console.log('---------------------------');

const withPWA = withPWAInit({
    dest: 'public',
    // FIX: Set to false for production to allow the PWA logic to run.
    // If you want to test in dev, set this to false temporarily.
    disable: process.env.NODE_ENV === 'development',
    register: true,
    skipWaiting: true,
    buildExcludes: [/manifest\.webmanifest$/, /manifest\.json$/],
});

/** @type {import('next').NextConfig} */
const nextConfig = {
    generateBuildId: async () => 'build-' + Date.now(),
    experimental: {
        serverActions: {
            bodySizeLimit: '5mb',
        },
    },
    // Ensure this matches your Next.js version capabilities
    reactCompiler: true,

    async headers() {
        console.log('[NextConfig] Applying PWA MIME type headers...');
        return [
            {
                // Apply correct MIME type to both possible manifest paths
                source: '/manifest.webmanifest',
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