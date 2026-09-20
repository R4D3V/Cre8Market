import type { Metadata, Viewport } from "next";
import { Inter, Sora } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "@/components/LayoutWrapper";
import Providers from "@/components/Providers";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const sora = Sora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-sora",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://cre8market.com"),
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
    url: "https://cre8market.com",
    siteName: "CRE8MARKET Entebbe",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CRE8MARKET Entebbe | Buy & Sell in Uganda",
    description:
      "Buy and sell phones, laptops, appliances, and local deals in Entebbe with CRE8MARKET — trusted, direct, and easy to use.",
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
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
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
      className={`${inter.variable} ${sora.variable}`}
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
