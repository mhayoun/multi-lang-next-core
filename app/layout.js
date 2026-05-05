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
export const metadata = {
    title: "בית הנוער העברי",
    description: "בית קהילתי ירושלמי לכל המשפחה",
    icons: {
        icon: '/favicon.ico', // path to your icon in the public folder
        apple: '/apple-touch-icon.png', // optional: for iOS devices
    },
    manifest: '/manifest.json'
};

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