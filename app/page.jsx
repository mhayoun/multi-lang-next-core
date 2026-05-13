import HomeClient from './HomeClient';

export async function generateMetadata() {
    const clientId = process.env.NEXT_PUBLIC_CLIENT_ID || "default";

    // 1. AUTOMATIC BASE URL: No manual Env Var needed on Vercel
    const rawHost = process.env.VERCEL_URL || 'localhost:3000';
    const baseUrl = rawHost.startsWith('http') ? rawHost : `https://${rawHost}`;

    console.log(`[Metadata Debug] Fetching for ${clientId} from ${baseUrl}`);

    let footerData = null;

    try {
        const response = await fetch(`${baseUrl}/api/settings`, {
            cache: 'no-store',
            headers: { 'x-client-id': clientId }
        });

        if (response.ok) {
            const cloudData = await response.json();
            footerData = cloudData?.footerData;
        }
    } catch (err) {
        console.error(`[Metadata Debug] Cloud fetch failed: ${err.message}`);
    }

    // 2. Fallback to Local Files if the Cloud/Redis is unreachable
    if (!footerData) {
        try {
            const module = await import(`../src/data/${clientId}/footerData.js`);
            footerData = module.DEFAULT_FOOTER;
            console.log(`[Metadata Debug] Using local fallback for ${clientId}`);
        } catch (e) {
            footerData = {};
        }
    }

    const contact = footerData?.contact;

    return {
        title: contact?.cie_name?.he || 'YeloTag',
        description: contact?.cie_desc?.he || 'Digital Transformation',
        icons: {
            icon: `/${clientId}/favicon.ico`,
            apple: `/${clientId}/apple-touch-icon.png`,
        },
        manifest: `/${clientId}/manifest.json`,
    };
}

export default function Page() {
    return <HomeClient />;
}