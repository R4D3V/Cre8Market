import type { Metadata, Viewport } from "next";
import { Montserrat, Playfair_Display } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "@/components/LayoutWrapper";
import Providers from "@/components/Providers";

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
  display: "swap",
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "CRE8MARKET ENTEBBE — Entebbe's #1 Marketplace",
  description:
    "CRE8MARKET ENTEBBE — Buy and sell secondhand electronics, phones and more in Entebbe.",
  openGraph: {
    title: "CRE8MARKET ENTEBBE",
    description:
      "Buy and sell secondhand electronics, phones and more in Entebbe.",
    url: "https://cre8market.com",
    type: "website",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: "CRE8MARKET",
    statusBarStyle: "black-translucent",
  },
  icons: {
    icon: [
      { url: "/icon.png", sizes: "32x32", type: "image/png" },
      { url: "/icon.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#021e40",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${playfair.variable}`}
      data-scroll-behavior="smooth"
    >
      <body className="min-h-screen bg-background font-body antialiased">
        <Providers>
          <LayoutWrapper>{children}</LayoutWrapper>
        </Providers>
      </body>
    </html>
  );
}
