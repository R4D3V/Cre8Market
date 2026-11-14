import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import LayoutWrapper from "@/components/LayoutWrapper";
import Providers from "@/components/Providers";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

// Sora is self-hosted (see app/fonts/) so the build no longer depends on
// reaching fonts.googleapis.com at build time. The files are Google's own
// multi-weight subsets (latin + latin-ext), reused for every supported weight.
const sora = localFont({
  src: [
    { path: "./fonts/Sora-latin.woff2", weight: "400", style: "normal" },
    { path: "./fonts/Sora-latin.woff2", weight: "500", style: "normal" },
    { path: "./fonts/Sora-latin.woff2", weight: "600", style: "normal" },
    { path: "./fonts/Sora-latin.woff2", weight: "700", style: "normal" },
    { path: "./fonts/Sora-latin.woff2", weight: "800", style: "normal" },
    { path: "./fonts/Sora-latin-ext.woff2", weight: "400", style: "normal" },
    { path: "./fonts/Sora-latin-ext.woff2", weight: "500", style: "normal" },
    { path: "./fonts/Sora-latin-ext.woff2", weight: "600", style: "normal" },
    { path: "./fonts/Sora-latin-ext.woff2", weight: "700", style: "normal" },
    { path: "./fonts/Sora-latin-ext.woff2", weight: "800", style: "normal" },
  ],
  display: "swap",
  variable: "--font-sora",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.cre8-market.com"),
  title: {
    default: "CRE8MARKET Entebbe | Buy & Sell in Uganda",
    template: "%s | CRE8MARKET Entebbe",
  },
  description:
    "Buy and sell phones, laptops, appliances, and local deals in Entebbe with CRE8MARKET — trusted, direct, and easy to use.",
  openGraph: {
    title: "CRE8MARKET Entebbe | Buy & Sell in Uganda",
    description:
      "Buy and sell phones, laptops, appliances, and local deals in Entebbe with CRE8MARKET — trusted, direct, and easy to use.",
    url: "https://www.cre8-market.com",
    siteName: "CRE8MARKET Entebbe",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CRE8MARKET Entebbe | Buy & Sell in Uganda",
    description:
      "Buy and sell phones, laptops, appliances, and local deals in Entebbe with CRE8MARKET — trusted, direct, and easy to use.",
  },
  applicationName: "CRE8MARKET",
  formatDetection: { telephone: false },
  appleWebApp: {
    capable: true,
    title: "CRE8MARKET",
    statusBarStyle: "black-translucent",
  },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Lets the page draw edge-to-edge in standalone mode; the layout then pads
  // fixed/sticky chrome with env(safe-area-inset-*).
  viewportFit: "cover",
  themeColor: "#021e40",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${sora.variable}`}
      data-scroll-behavior="smooth"
    >
      <body className="min-h-dvh bg-background font-body antialiased">
        <Providers>
          <LayoutWrapper>{children}</LayoutWrapper>
        </Providers>
      </body>
    </html>
  );
}
