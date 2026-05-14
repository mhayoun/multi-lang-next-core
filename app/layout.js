import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientProviders from "@/components/ClientProviders";
// Import the shared library logic directly
import { getClientSettings } from "@/lib/settings";

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

    console.log(`[Metadata Debug] Starting Direct Logic for Client: ${clientId}`);

    let footerData = null;
    let dataSource = 'none';

    // 1. DIRECT LOGIC (Bypasses API, 401 errors, and fetch overhead)
    try {
        const cloudData = await getClientSettings(clientId);

        if (cloudData && cloudData.footerData) {
            footerData = cloudData.footerData;
            dataSource = 'cloud/redis';
            console.log(`[Metadata Debug] Direct Redis Data verified: ${footerData.contact?.cie_name?.he}`);
        }
    } catch (err) {
        console.error("[Metadata Debug] Direct data fetch failed:", err.message);
    }

    // 2. Fallback to Local Files (Only if Cloud logic failed or returned nothing)
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
        // Use 'absolute' to ensure this exact string is used without templates
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
            <body className="min-h-full flex flex-col" suppressHydrationWarning={true}>
                <ClientProviders>
                    {children}
                </ClientProviders>
            </body>
        </html>
    );
}