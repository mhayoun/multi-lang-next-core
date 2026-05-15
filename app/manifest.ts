import { MetadataRoute } from 'next'
import { getClientSettings } from "@/lib/settings";

// Define the structure so TypeScript stops complaining
interface FooterData {
  contact?: {
    cie_name?: { he?: string };
    cie_desc?: { he?: string };
  };
}

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const clientId = process.env.NEXT_PUBLIC_CLIENT_ID || "default";

  // Cast the initial state or the result to our interface
  let footerData: FooterData | null = null;

  try {
    const cloudData = await getClientSettings(clientId);
    // Ensure we safely cast the cloud response
    footerData = (cloudData?.footerData as FooterData) || null;
  } catch (err) {
    try {
      const module = await import(`../src/data/${clientId}/footerData.js`);
      footerData = module.DEFAULT_FOOTER || module.default || module;
    } catch (e) {
      console.error("Manifest fallback failed");
    }
  }

  const title = footerData?.contact?.cie_name?.he || 'YeloTag';
  const description = footerData?.contact?.cie_desc?.he || 'Digital Transformation';

  return {
    name: title,
    short_name: title,
    description: description,
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#1d4ed8',
    icons: [
      {
        src: `/${clientId}/icon-192x192.png`,
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: `/${clientId}/icon-512x512.png`,
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}