import type { Metadata, Viewport } from "next";
import "./globals.css";
import LayoutWrapper from "@/components/LayoutWrapper";

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
    <html lang="en" data-scroll-behavior="smooth">
      <body className="min-h-screen bg-surface font-sans antialiased">
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
