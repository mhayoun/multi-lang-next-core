import withPWAInit from 'next-pwa';

// Debug: Check environment on startup
console.log('--- NEXT CONFIG STARTUP ---');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('CLIENT_ID:', process.env.NEXT_PUBLIC_CLIENT_ID);
console.log('---------------------------');

const withPWA = withPWAInit({
    dest: 'public',
    disable: process.env.NODE_ENV === 'development', //false, // Leave false to allow testing and running PWA features
    register: true,
    skipWaiting: true,
    // FIX 1: REMOVED buildExcludes so Webpack stops hijacking and blacklisting the manifest paths!
});

/** @type {import('next').NextConfig} */
const nextConfig = {
    generateBuildId: async () => 'build-' + Date.now(),
    experimental: {
        serverActions: {
            bodySizeLimit: '5mb',
        },
    },
    reactCompiler: true,

    // FIX 2: Add the custom rewrite to pass /manifest.json internally into your multi-tenant route handler folder
    async rewrites() {
        return [
            {
                source: '/manifest.json',
                destination: '/manifest',
            },
        ];
    },

    async headers() {
        console.log('[NextConfig] Applying PWA MIME type headers...');
        return [
            {
                source: '/:path(manifest|manifest.json)',
                headers: [
                    {
                        key: 'Content-Type',
                        value: 'application/manifest+json; charset=utf-8',
                    },
                    {
                        key: 'Cache-Control',
                        value: 'no-cache, no-store, must-revalidate',
                    },
                ],
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