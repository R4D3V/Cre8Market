import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import HeroCarousel from "@/components/HeroCarousel";
import CategoryTiles from "@/components/CategoryTiles";
import AppleCta from "@/components/AppleCta";
import TopSellingTabs, { type ProductGroup } from "@/components/TopSellingTabs";
import Recommendations from "@/components/Recommendations";
import NewsletterSignup from "@/components/NewsletterSignup";
import { latestProducts } from "@/lib/data";
import { getProducts, getCategories } from "@/lib/db/queries";
import type { Product } from "@/lib/types";

// Featured products come from the database, so render on each request instead of at build time.
export const dynamic = "force-dynamic";

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
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  const topGroups = groupByCategory(
    products.length > 0 ? products : latestProducts,
  );

  return (
    <div className="bg-background text-foreground">
      <Navbar />
      <main className="flex-1">
        <HeroCarousel />
        <CategoryTiles categories={categories} />
        <AppleCta />
        <TopSellingTabs groups={topGroups} />
        <Recommendations />
      </main>
      <NewsletterSignup />
      <Footer />
      <MobileBottomNav />
    </div>
  );
}