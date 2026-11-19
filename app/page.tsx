import type { Metadata } from "next";
import { Suspense } from "react";
import Footer from "@/components/Footer";
import BrandSpotlight from "@/components/home/BrandSpotlight";
import CategoryShowcase from "@/components/home/CategoryShowcase";
import CollectionShowcase from "@/components/home/CollectionShowcase";
import HomeHero from "@/components/home/HomeHero";
import Recommendations from "@/components/home/Recommendations";
import SellCta from "@/components/home/SellCta";
import TrendingSection, { type ProductGroup } from "@/components/home/TrendingSection";
import TrustStrip from "@/components/home/TrustStrip";
import Navbar from "@/components/Navbar";
import ScrollReveal from "@/components/ScrollReveal";
import { getProducts } from "@/lib/db/queries";
import type { Product } from "@/lib/types";

export const metadata: Metadata = {
  title: "CRE8MARKET Entebbe | Trusted Marketplace for Local Deals",
  description:
    "Discover verified deals, local listings, and trusted sellers across Entebbe with CRE8MARKET.",
  alternates: {
    canonical: "/",
  },
  verification: {
    google: "_-m9WGRnpuY5KH1xGRHn5athoqk0GaXp_QYbs_B2oNM",
  },
};

export const revalidate = 60;

function groupByCategory(products: Product[], limit = 4): ProductGroup[] {
  const groups = new Map<string, Product[]>();
  for (const p of products) {
    const list = groups.get(p.categorySlug) ?? [];
    list.push(p);
    groups.set(p.categorySlug, list);
  }

  return Array.from(groups.values())
    .sort((a, b) => b.length - a.length)
    .slice(0, limit)
    .map((list) => ({
      name: list[0]?.category ?? "More",
      products: list,
    }));
}

async function ProductSections() {
  let products: Product[] = [];

  try {
    products = await getProducts();
  } catch (err) {
    // Neon free-tier cold-start timeout — fall back to static data so the page
    // still renders instead of showing a 500 error.
    console.error("DB unavailable on homepage load, using fallback data:", (err as Error).message);
  }

  const source = products;

  return (
    <>
      <ScrollReveal delay={80}>
        <CategoryShowcase products={source} />
      </ScrollReveal>
      <ScrollReveal delay={120}>
        <TrendingSection groups={groupByCategory(source)} />
      </ScrollReveal>
    </>
  );
}

function ProductSectionsSkeleton() {
  return (
    <div aria-busy="true">
      <div className="container pt-14 sm:pt-20">
        <div className="h-3 w-28 animate-pulse rounded-full bg-muted" />
        <div className="mt-4 h-8 w-64 animate-pulse rounded-lg bg-muted" />
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-32 animate-pulse rounded-2xl border border-border/60 bg-card/50"
            />
          ))}
        </div>
      </div>

      <div className="container pt-14 sm:pt-20">
        <div className="h-3 w-24 animate-pulse rounded-full bg-muted" />
        <div className="mt-4 h-8 w-72 animate-pulse rounded-lg bg-muted" />
        <div className="mt-7 flex gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-9 w-28 animate-pulse rounded-full bg-muted/70" />
          ))}
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3.5 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="aspect-[4/5] animate-pulse rounded-2xl border border-border/60 bg-card/50"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="bg-background text-foreground">
      <Navbar />
      <main className="flex-1">
        <HomeHero />
        <TrustStrip />

        <Suspense fallback={<ProductSectionsSkeleton />}>
          <ProductSections />
        </Suspense>

        <ScrollReveal delay={80}>
          <CollectionShowcase />
        </ScrollReveal>

        <ScrollReveal delay={80}>
          <BrandSpotlight />
        </ScrollReveal>

        <ScrollReveal delay={80}>
          <Recommendations />
        </ScrollReveal>

        <ScrollReveal delay={80}>
          <SellCta />
        </ScrollReveal>
      </main>
      <Footer />
    </div>
  );
}
