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

  // 1. Dynamically import the specific client's JSON
  // Note: Adjust the path to where your src/data folder is relative to this file
    const module = await import(`../src/data/${clientId}/footerData.js`);
    const data = module.DEFAULT_FOOTER;
    const contact = data?.contact;

  return {
    title: contact?.cie_name?.he || 'cie_name ???',
    description: contact?.cie_desc?.he || 'cie_desc ???',
    icons: {
      // Browsers look in the 'public' folder for these
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