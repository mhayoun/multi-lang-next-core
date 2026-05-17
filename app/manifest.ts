import { MetadataRoute } from 'next'
import { getClientSettings } from "@/lib/settings";
import { headers } from 'next/headers'; // CRITICAL: Import headers

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface FooterData {
  contact?: {
    cie_name?: { he?: string };
    cie_desc?: { he?: string };
  };
}

// Helper mapping function to parse host domains dynamically at execution time
function getClientIdFromHost(host: string | null): string {
  if (!host) return "default";
  if (host.includes("hamoshava")) return "hamoshava";
  if (host.includes("omer")) return "omer";
  if (host.includes("beithanoar") || host.includes("bhhj")) return "beithanoar";
  if (host.includes("topclubcarmiel")) return "topclubcarmiel";
  return process.env.NEXT_PUBLIC_CLIENT_ID || "default";
}

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  console.log(`[PWA Manifest Debug] HIT AT: ${new Date().toISOString()}`);

  // 1. DYNAMICALLY PARSE INCOMING TENANT DOMAIN
  const headersList = await headers();
  const host = headersList.get('host');
  const clientId = getClientIdFromHost(host);

  console.log(`\x1b[33m[PWA Manifest Debug]\x1b[0m Resolved Route: ${host} -> Generating for Client: ${clientId}`);

  let footerData: FooterData | null = null;
  let dataSource = 'none';

  // 2. Try Cloud/Redis
  try {
    const cloudData = await getClientSettings(clientId);
    if (cloudData && cloudData.footerData) {
      footerData = cloudData.footerData as FooterData;
      dataSource = 'cloud/redis';
    }
  } catch (err: any) {
    console.error(`\x1b[31m[PWA Manifest Debug]\x1b[0m Cloud fetch failed: ${err.message}`);
  }

  // 3. Try Local Fallback
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

  console.log(`\x1b[32m[PWA Manifest Debug]\x1b[0m Success! Source: ${dataSource} | Title: ${title}`);

  return {
    id: `pwa-${clientId}`,
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
        purpose: 'any maskable' as any,
      },
      {
        src: `/${clientId}/icon-512x512.png`,
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  };
}