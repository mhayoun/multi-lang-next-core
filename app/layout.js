import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import ClientProviders from "@/components/ClientProviders"; // Importez le nouveau fichier

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
    themeColor: "#000000",
};

export async function generateMetadata() {
    const clientId = process.env.NEXT_PUBLIC_CLIENT_ID || "default";

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    let footerData = null;

    try {
        // Construct an absolute URL
        const apiUrl = `${baseUrl}/api/settings`;

        const response = await fetch(apiUrl, {
            cache: 'no-store'
        });

        if (!response.ok) throw new Error(`Fetch failed: ${response.status}`);

        const cloudData = await response.json();
        if (cloudData?.footerData) {
            footerData = cloudData.footerData;
        }
    } catch (err) {
        // This will stop showing the "Invalid URL" error now
        console.error("Metadata: Cloud fetch failed ->", err.message);
    }

    // 2. Fallback to Local JS File if Redis is empty or fails
    if (!footerData) {
        try {
            const module = await import(`../src/data/${clientId}/footerData.js`);
            footerData = module.DEFAULT_FOOTER;
            console.log("Metadata: Using Local File Data");
        } catch (e) {
            footerData = {};
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