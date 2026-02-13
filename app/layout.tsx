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
  title: {
    default: "vals.love - Create Beautiful Valentine's Pages for Your Love 💕",
    template: "%s | vals.love",
  },
  description: "Create stunning, personalized Valentine's Day websites for your special person. Add photos, poems, timelines, love letters, and more. Share with a unique link. Free forever!",
  keywords: [
    "valentine",
    "valentines day",
    "love page",
    "romantic website",
    "valentine card",
    "love letter",
    "couples",
    "anniversary",
    "relationship",
    "gift for partner",
    "digital valentine",
    "love poems",
    "photo gallery",
  ],
  authors: [
    { name: "Travis Moore", url: "https://travismoore.com" },
    { name: "Travis Moore", url: "https://angeloasante.com" },
  ],
  creator: "Travis Moore",
  publisher: "vals.love",
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
    title: "vals.love - Create Beautiful Valentine's Pages 💕",
    description: "Create stunning, personalized Valentine's Day websites for your special person. Add photos, poems, timelines, love letters & more. Free forever!",
    url: "https://vals.love",
    siteName: "vals.love",
    images: [
      {
        url: "/og-main.png",
        width: 1200,
        height: 630,
        alt: "vals.love - Create Beautiful Valentine's Pages",
      },
    ],
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "vals.love - Create Beautiful Valentine's Pages 💕",
    description: "Create stunning, personalized Valentine's Day websites for your special person. Free forever!",
    images: ["/og-main.png"],
    creator: "@travis_moore",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add your verification codes here when you have them
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
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
