import type { Metadata } from "next";
import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroCarousel from "@/components/HeroCarousel";
// import CategoryTiles from "@/components/CategoryTiles";
import AppleCta from "@/components/AppleCta";
import TopSellingTabs, { type ProductGroup } from "@/components/TopSellingTabs";
import Recommendations from "@/components/Recommendations";
import NewsletterSignup from "@/components/NewsletterSignup";
import ScrollReveal from "@/components/ScrollReveal";
import { latestProducts } from "@/lib/data";
import { getProducts } from "@/lib/db/queries";
import type { Product } from "@/lib/types";
import Laptops from "@/components/Laptops";
import Gaming from "@/components/Gaming";

export const metadata: Metadata = {
  title: "CRE8MARKET Entebbe | Trusted Marketplace for Local Deals",
  description:
    "Discover verified deals, local listings, and trusted sellers across Entebbe with CRE8MARKET.",
  alternates: {
    canonical: "/",
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

async function HomeSections() {
  let products: Product[] = [];

  try {
    products = await getProducts();
  } catch (err) {
    // Neon free-tier cold-start timeout — fall back to static data so the page
    // still renders instead of showing a 500 error.
    console.error(
      "DB unavailable on homepage load, using fallback data:",
      (err as Error).message,
    );
  }

  const topGroups = groupByCategory(
    products.length > 0 ? products : latestProducts,
  );

  return (
    <ScrollReveal delay={100}>
      <TopSellingTabs groups={topGroups} />
    </ScrollReveal>
  );
}

function HomeSectionsSkeleton() {
  return (
    <div className="container py-10" aria-busy="true">
      <div className="h-8 w-56 animate-pulse rounded-md bg-muted" />
      <div className="mt-6 grid grid-cols-2 gap-5 md:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="aspect-[3/4] animate-pulse rounded-xl bg-muted/60"
          />
        ))}
      </div>
    </div>
  );
}

export default function HomePage() {

  return (
    <div className="bg-background text-foreground">
      <Navbar />
      <main className="flex-1">
        <ScrollReveal delay={150}>
          <AppleCta />
        </ScrollReveal>
        <Suspense fallback={<HomeSectionsSkeleton />}>
          <HomeSections />
        </Suspense>
        <ScrollReveal delay={150}>
          <Laptops />
        </ScrollReveal>
        <ScrollReveal delay={150}>
          <Gaming />
        </ScrollReveal>
        {/* <ScrollReveal>
          <HeroCarousel />
        </ScrollReveal> */}
        {/* <CategoryTiles categories={categories} /> */}
        <ScrollReveal delay={200}>
          <Recommendations />
        </ScrollReveal>
      </main>
      {/* <NewsletterSignup /> */}
      <Footer />
    </div>
  );
}
