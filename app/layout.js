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
    themeColor: "#1d4ed8",
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
};

export async function generateMetadata() {
    const clientId = process.env.NEXT_PUBLIC_CLIENT_ID || "default";

    // 1. IMPROVED BASE URL RESOLUTION (Fixes "fetch failed" on Vercel)
    const rawHost = process.env.VERCEL_URL || process.env.NEXT_PUBLIC_BASE_URL || 'localhost:3000';
    const baseUrl = rawHost.startsWith('http')
        ? rawHost
        : (rawHost.includes('localhost') ? `http://${rawHost}` : `https://${rawHost}`);

    console.log(`[Metadata Debug] Starting for Client: ${clientId} at ${baseUrl}`);

    let footerData = null;
    let dataSource = 'none';

    // 1. Attempt Cloud Fetch
    try {
        const apiUrl = `${baseUrl}/api/settings`;
        const response = await fetch(apiUrl, {
            cache: 'no-store',
            next: { revalidate: 0 },
            headers: { 'x-client-id': clientId } // Optional: helps identify client in API
        });

        if (response.ok) {
            const cloudData = await response.json();
            footerData = cloudData?.footerData;

            if (footerData && footerData.contact) {
                dataSource = 'cloud';
                console.log(`[Metadata Debug] Cloud Data verified for: ${footerData.contact.cie_name?.he}`);
            }
        } else {
            console.warn(`[Metadata Debug] API returned status: ${response.status}`);
        }
    } catch (err) {
        console.error("[Metadata Debug] Cloud fetch failed:", err.message);
    }

    // 2. Fallback to Local Files (Only if Cloud failed or unreachable)
    if (dataSource === 'none') {
        try {
            const module = await import(`../src/data/${clientId}/footerData.js`);
            footerData = module.DEFAULT_FOOTER || module.default || module;
            dataSource = 'local';
            console.log(`[Metadata Debug] Using local fallback for ${clientId}`);
        } catch (e) {
            console.error(`[Metadata Debug] Local fallback failed:`, e.message);
        }
    }

    const contact = footerData?.contact;
    const resolvedTitle = contact?.cie_name?.he || 'YeloTag';

    console.log(`[Metadata Debug] Final Source: ${dataSource}`);
    console.log(`[Metadata Debug] Resolved Title: ${resolvedTitle}`);

    return {
        // 'absolute' ensures that sub-pages or parent templates don't add suffixes
        title: {
            absolute: resolvedTitle,
        },
        description: contact?.cie_desc?.he || 'Digital Transformation',
        icons: {
            icon: `/${clientId}/favicon.ico`,
            apple: `/${clientId}/apple-touch-icon.png`,
        },
        manifest: `/${clientId}/manifest.json`,
        appleWebApp: {
            capable: true,
            statusBarStyle: "default",
            title: resolvedTitle,
        },
        // Keeps metadata consistent across social shares
        openGraph: {
            title: resolvedTitle,
            description: contact?.cie_desc?.he || 'Digital Transformation',
            type: 'website',
        }
    };
}

export default function RootLayout({ children }) {
    return (
        <html
            lang="he"
            dir="rtl"
            className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
        >
            {/* Note: No manual <head> or <title> tags here. Next.js handles it via metadata */}
            <body className="min-h-full flex flex-col" suppressHydrationWarning={true}>
                <ClientProviders>
                    {children}
                </ClientProviders>
            </body>
        </html>
    );
}