import {Geist, Geist_Mono} from "next/font/google";
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
    const clientId = process.env.NEXT_PUBLIC_CLIENT_ID || "default";
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    console.log(`[Metadata Debug] Starting for Client: ${clientId}`);

    let footerData = null;
    let dataSource = 'none';

    // 1. Attempt Cloud Fetch
    try {
        const apiUrl = `${baseUrl}/api/settings`;
        // Ensure the fetch is fully awaited and cache is bypassed
        const response = await fetch(apiUrl, {
            cache: 'no-store',
            next: {revalidate: 0}
        });

        if (response.ok) {
            const cloudData = await response.json();
            // IMPORTANT: Match the actual structure of your API response
            // Based on your logs, we need cloudData.footerData
            footerData = cloudData?.footerData;

            if (footerData && footerData.contact) {
                dataSource = 'cloud';
                console.log(`[Metadata Debug] Cloud Data verified for: ${footerData.contact.cie_name?.he}`);
            }
        }
    } catch (err) {
        console.error("[Metadata Debug] Cloud fetch failed:", err.message);
    }

    // 2. Fallback to Local Files (Only if Cloud failed)
    if (dataSource === 'none') {
        try {
            const module = await import(`../src/data/${clientId}/footerData.js`);
            // Check both possible export patterns
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
        // Use 'absolute' to prevent parent layouts from overriding with a template
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
    };
}

export default function RootLayout({children}) {
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