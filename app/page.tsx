import type { Metadata } from "next";
import { Suspense } from "react";
import Footer from "@/components/Footer";
import BrandSpotlight from "@/components/home/BrandSpotlight";
import HomeHero from "@/components/home/HomeHero";
import MarketplaceHome from "@/components/home/MarketplaceHome";
import MarketplaceSkeleton from "@/components/home/MarketplaceSkeleton";
import SellCta from "@/components/home/SellCta";
import Navbar from "@/components/Navbar";
import ScrollReveal from "@/components/ScrollReveal";

export const metadata: Metadata = {
  title: "CRE8MARKET Entebbe | Trusted Marketplace for Local Deals",
  description:
    "Discover verified deals, local listings, and trusted sellers across Entebbe with CRE8MARKET.",
  alternates: {
    canonical: "/",
  },
};

export const revalidate = 60;

export default function HomePage() {
  return (
    <div className="bg-background text-foreground">
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={<MarketplaceSkeleton />}>
          <MarketplaceHome />
        </Suspense>

        <ScrollReveal delay={80}>
          <BrandSpotlight />
        </ScrollReveal>

        <ScrollReveal delay={80}>
          <SellCta />
        </ScrollReveal>

        {/* The original hero stays at the bottom of the page. */}
        <HomeHero />
      </main>
      <Footer />
    </div>
  );
}
