import HomeClient from './HomeClient';

/**
 * SERVER SIDE: This runs only on the server.
 * It can fetch data from your API or Redis directly.
 */
export async function generateMetadata() {
    console.log(`[Metadata Debug] : generateMetadata is calling now...`);

    const clientId = process.env.NEXT_PUBLIC_CLIENT_ID || "default";
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    let footerData = null;

    try {
        // Since we are on the server, we can fetch from our own API
        const response = await fetch(`${baseUrl}/api/settings`, { cache: 'no-store' });
        if (response.ok) {
            const cloudData = await response.json();
            footerData = cloudData?.footerData;
        }
    } catch (err) {
        console.error("Metadata fetch failed:", err.message);
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