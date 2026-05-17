import {NextResponse} from 'next/server';
import {getClientSettings} from "@/lib/settings";

// CRITICAL: Forces Next.js to run this live on every incoming request
export const dynamic = 'force-dynamic';

// Helper mapping function to parse host domains dynamically at execution time
function getClientIdFromHost(host) {
    if (!host) return "default";
    if (host.includes("hamoshava")) return "hamoshava";
    if (host.includes("omer")) return "omer";
    if (host.includes("beithanoar") || host.includes("bhhj")) return "beithanoar";
    if (host.includes("topclubcarmiel")) return "topclubcarmiel";
    return process.env.NEXT_PUBLIC_CLIENT_ID || "default";
}

export async function GET(request) {
    // 1. DYNAMICALLY PARSE INCOMING TENANT DOMAIN FROM HEADERS
    const host = request.headers.get('host') || '';
    const clientId = getClientIdFromHost(host);

    console.log(`\x1b[33m[PWA Manifest Route Handler Debug]\x1b[0m Resolved Route: ${host} -> Generating for Client: ${clientId}`);

    let footerData = null;
    let dataSource = 'none';

    // 2. Try Cloud/Redis
    try {
        const cloudData = await getClientSettings(clientId);
        if (cloudData && cloudData.footerData) {
            footerData = cloudData.footerData;
            dataSource = 'cloud/redis';
        }
    } catch (err) {
        console.error(`\x1b[31m[PWA Manifest Debug]\x1b[0m Cloud fetch failed: ${err.message}`);
    }

    // 3. Try Local Fallback
    if (!footerData || dataSource === 'none') {
        try {
            const module = await import(`../../src/data/${clientId}/footerData.js`);
            footerData = module.DEFAULT_FOOTER || module.default || module;
            dataSource = 'local_file';
        } catch (e) {
            console.error(`\x1b[31m[PWA Manifest Debug]\x1b[0m Local fallback failed for ${clientId}: ${e.message}`);
        }
    }

    const title = footerData?.contact?.cie_name?.he || 'YeloTag';
    const description = footerData?.contact?.cie_desc?.he || 'Digital Transformation';

    console.log(`\x1b[32m[PWA Manifest Debug]\x1b[0m Success! Source: ${dataSource} | Title: ${title}`);

    // 4. Construct the PWA Manifest Object dynamically
    // Inside your /app/manifest/route.js file:

// 4. Construct the PWA Manifest Object dynamically
    const manifestData = {
        id: `pwa-${clientId}`,
        name: title,
        short_name: title,
        description: description,
        start_url: '/',
        scope: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#1d4ed8',

        // FIX 1: Split 'any' and 'maskable' to appease the padding validator
        icons: [
            {
                src: `/${clientId}/icon-192x192.png`,
                sizes: '192x192',
                type: 'image/png',
                purpose: 'any',
            },
            {
                src: `/${clientId}/icon-192x192.png`, // Re-use or point to a padded icon if available
                sizes: '192x192',
                type: 'image/png',
                purpose: 'maskable',
            },
            {
                src: `/${clientId}/icon-512x512.png`,
                sizes: '512x512',
                type: 'image/png',
                purpose: 'any',
            },
        ],

        // FIX 2: Supply the required screenshots array for Richer Desktop/Mobile UI matching
        screenshots: [
            {
                src: `/${clientId}/screenshots/mobile.png`,
                sizes: '750*1334',
                type: 'image/png',
                form_factor: 'narrow',
                label: `Home screen of ${title}`,
            },
            {
                src: `/${clientId}/screenshots/desktop.png`,
                sizes: '1280*720',
                type: 'image/png',
                form_factor: 'wide',
                label: `Dashboard of ${title}`,
            },
        ],
    };

    // 5. Return with correct PWA Headers
    return new NextResponse(JSON.stringify(manifestData), {
        status: 200,
        headers: {
            'Content-Type': 'application/manifest+json; charset=utf-8',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
    });
}