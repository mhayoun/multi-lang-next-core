import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientProviders from "@/components/ClientProviders";

export const dynamic = "force-dynamic";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const viewport = {
    themeColor: "#1d4ed8", // Match your manifest theme_color
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
};

export async function generateMetadata() {
    const isDebug = process.env.DEBUG_METADATA === 'true' || process.env.NODE_ENV === 'development';

    const clientId = process.env.NEXT_PUBLIC_CLIENT_ID || "default";
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    let footerData = null;
    let dataSource = 'none';

    if (isDebug) console.log(`[Metadata Debug] Starting for Client: ${clientId} at ${baseUrl}`);

    // 1. Attempt Cloud Fetch
    try {
        const apiUrl = `${baseUrl}/api/settings`;
        const response = await fetch(apiUrl, { cache: 'no-store' });

        if (isDebug) console.log(`[Metadata Debug] API Status: ${response.status}`);

        if (response.ok) {
            const cloudData = await response.json();
            if (isDebug) console.log(`[Metadata Debug] Cloud Data Received:`, JSON.stringify(cloudData).substring(0, 100) + "...");

            footerData = cloudData?.footerData;
            if (footerData) dataSource = 'cloud';
        }
    } catch (err) {
        console.error("Metadata: Cloud fetch failed ->", err.message);
    }

    // 2. Fallback to Local Files
    if (!footerData) {
        try {
            const path = `../src/data/${clientId}/footerData.js`;
            if (isDebug) console.log(`[Metadata Debug] Falling back to local path: ${path}`);

            const module = await import(`../src/data/${clientId}/footerData.js`);
            footerData = module.DEFAULT_FOOTER;
            if (footerData) dataSource = 'local';
        } catch (e) {
            if (isDebug) console.error(`[Metadata Debug] Local import failed:`, e.message);
            footerData = {};
        }
    }

    const contact = footerData?.contact;

    if (isDebug) {
        console.log(`[Metadata Debug] Data Source: ${dataSource}`);
        console.log(`[Metadata Debug] Resolving Title Path: footerData -> contact -> cie_name -> he`);
        console.log(`[Metadata Debug] Resolved Value:`, contact?.cie_name?.he);
    }

    return {
        title: contact?.cie_name?.he || 'YeloTag',
        description: contact?.cie_desc?.he || 'Digital Transformation',
        icons: {
            icon: `/${clientId}/favicon.ico`,
            apple: `/${clientId}/apple-touch-icon.png`,
        },
        manifest: `/${clientId}/manifest.json`,
        appleWebApp: {
            capable: true,
            statusBarStyle: "default",
            title: contact?.cie_name?.he || 'YeloTag',
        },
    };
}

export default function RootLayout({ children }) {
    return (
        <html
            lang="he"
            dir="rtl" // Added for Hebrew support
            className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
        >
            <head>
                {/*
                  FIX: If the metadata API manifest isn't showing in Network tab,
                  Next.js sometimes needs a hint for cross-origin manifest requests.
                */}
                <link rel="manifest" href={`/${process.env.NEXT_PUBLIC_CLIENT_ID || 'default'}/manifest.json`} crossOrigin="use-credentials" />
            </head>
            <body className="min-h-full flex flex-col" suppressHydrationWarning={true}>
                <ClientProviders>
                    {children}
                </ClientProviders>
            </body>
        </html>
    );
}