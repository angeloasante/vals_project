import type { Metadata } from "next";
import { Inter, Dancing_Script, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/app/components/ui/sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600"],
});

const dancingScript = Dancing_Script({
  variable: "--font-dancing",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "600"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://vals.love"),
  title: "For Us 💕",
  description: "Made with love for you",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "For Us 💕",
    description: "Spread The Love... Made with love for my special person",
    url: "https://vals.love",
    siteName: "For Us",
    images: [
      {
        url: "/og-main.png",
        width: 1200,
        height: 630,
        alt: "Spread The Love - Valentine's Day",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "For Us 💕",
    description: "Spread The Love... Made with love for my special person",
    images: ["/og-main.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Preconnect to critical third-party origins */}
        <link rel="preconnect" href="https://api.iconify.design" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://code.iconify.design" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://api.iconify.design" />
        <link rel="dns-prefetch" href="https://code.iconify.design" />
        
        {/* Preload audio for music card */}
        <link rel="preload" href="/our-song.mp3" as="audio" />
        
        <script src="https://code.iconify.design/iconify-icon/1.0.7/iconify-icon.min.js" async />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon-32x32.png" type="image/png" sizes="32x32" />
        <link rel="icon" href="/favicon-16x16.png" type="image/png" sizes="16x16" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body
        className={`${inter.variable} ${dancingScript.variable} ${playfairDisplay.variable} antialiased min-h-screen flex flex-col items-center selection:bg-rose-300 selection:text-rose-900`}
      >
        {children}
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
