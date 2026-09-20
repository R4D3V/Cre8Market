import type { Metadata } from "next";
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
import { getProducts, getCategories } from "@/lib/db/queries";
import type { Product, CategoryDB } from "@/lib/types";
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

export default async function HomePage() {
  let products: Product[] = [];
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let categories: CategoryDB[] = [];

  try {
    [products, categories] = await Promise.all([
      getProducts(),
      getCategories(),
    ]);
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
    <div className="bg-background text-foreground">
      <Navbar />
      <main className="flex-1">
        <ScrollReveal delay={150}>
          <AppleCta />
        </ScrollReveal>
        <ScrollReveal delay={100}>
          <TopSellingTabs groups={topGroups} />
        </ScrollReveal>
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
