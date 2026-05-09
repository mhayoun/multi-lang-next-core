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
    const clientId = process.env.NEXT_PUBLIC_CLIENT_ID || "default";
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    let footerData = null;

    try {
        const apiUrl = `${baseUrl}/api/settings`;
        const response = await fetch(apiUrl, { cache: 'no-store' });
        if (response.ok) {
            const cloudData = await response.json();
            footerData = cloudData?.footerData;
        }
    } catch (err) {
        console.error("Metadata: Cloud fetch failed ->", err.message);
    }

    if (!footerData) {
        try {
            const module = await import(`../src/data/${clientId}/footerData.js`);
            footerData = module.DEFAULT_FOOTER;
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
        // FIX: Provide the full path and ensure it includes a cache-buster during debugging
        manifest: `/${clientId}/manifest.json`,
        // FIX: Essential for PWA installability on many browsers
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