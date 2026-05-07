import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import ClientProviders from "@/components/ClientProviders"; // Importez le nouveau fichier

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const viewport = {
  themeColor: "#000000",
};

export async function generateMetadata() {
    const clientId = process.env.NEXT_PUBLIC_CLIENT_ID || "default";
    let footerData = null;

    try {
        // 1. Try to fetch fresh data from Redis (via your internal API or direct utility)
        // Note: Use full URL for server-side fetch if necessary,
        // or call the logic that retrieves from Upstash directly.
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/settings`, { cache: 'no-store' });
        const cloudData = await response.json();

        if (cloudData && cloudData.footerData) {
            footerData = cloudData.footerData;
            console.log("Metadata: Using Redis Data");
        }
    } catch (err) {
        console.error("Metadata: Cloud fetch failed, falling back to local file", err);
    }

    // 2. Fallback to Local JS File if Redis is empty or fails
    if (!footerData) {
        try {
            const module = await import(`../src/data/${clientId}/footerData.js`);
            footerData = module.DEFAULT_FOOTER;
            console.log("Metadata: Using Local File Data");
        } catch (e) {
            console.error("Metadata: Local file not found");
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

export default function RootLayout({children}) {
    return (
        <html
            lang="he" // J'ai mis "he" car votre projet semble être principalement en hébreu
            className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
        >
        <body className="min-h-full flex flex-col"
              suppressHydrationWarning={true}>
        {/* On enveloppe ici pour que la Navbar et les autres voient la session */}
        <ClientProviders>
            {children}
        </ClientProviders>
        </body>
        </html>
    );
}