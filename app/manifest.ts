import { MetadataRoute } from 'next'
import { getClientSettings } from "@/lib/settings";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Define the structure for type safety
interface FooterData {
  contact?: {
    cie_name?: { he?: string };
    cie_desc?: { he?: string };
  };
}

export default async function manifest(): Promise<MetadataRoute.Manifest> {

  console.log(`[PWA Manifest Debug] HIT AT: ${new Date().toISOString()}`);

  const clientId = process.env.NEXT_PUBLIC_CLIENT_ID || "default";

  // DEBUG: Start of the process
  console.log(`\x1b[33m[PWA Manifest Debug]\x1b[0m Generating for Client: ${clientId}`);

  let footerData: FooterData | null = null;
  let dataSource = 'none';

  // 1. Try Cloud/Redis
  try {
    const cloudData = await getClientSettings(clientId);
    if (cloudData && cloudData.footerData) {
      footerData = cloudData.footerData as FooterData;
      dataSource = 'cloud/redis';
    }
  } catch (err: any) {
    console.error(`\x1b[31m[PWA Manifest Debug]\x1b[0m Cloud fetch failed: ${err.message}`);
  }

  // 2. Try Local Fallback
  if (!footerData || dataSource === 'none') {
    try {
      const module = await import(`../src/data/${clientId}/footerData.js`);
      footerData = (module.DEFAULT_FOOTER || module.default || module) as FooterData;
      dataSource = 'local_file';
    } catch (e: any) {
      console.error(`\x1b[31m[PWA Manifest Debug]\x1b[0m Local fallback failed for ${clientId}: ${e.message}`);
    }
  }

  const title = footerData?.contact?.cie_name?.he || 'YeloTag';
  const description = footerData?.contact?.cie_desc?.he || 'Digital Transformation';

  // DEBUG: Final manifest state
  console.log(`\x1b[32m[PWA Manifest Debug]\x1b[0m Success! Source: ${dataSource} | Title: ${title}`);

  return {
    id: `pwa-${clientId}`, // Helps browser distinguish between different tenant apps
    name: title,
    short_name: title,
    description: description,
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#1d4ed8',
    icons: [
      {
        src: `/${clientId}/icon-192x192.png`,
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any maskable' as any, // ADD THIS
      },
      {
        src: `/${clientId}/icon-512x512.png`,
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any', // ADD THIS
      },
    ],
  };
}