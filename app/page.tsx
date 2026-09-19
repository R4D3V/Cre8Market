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
        <ScrollReveal>
          <HeroCarousel />
        </ScrollReveal>
        <ScrollReveal delay={100}>
          <TopSellingTabs groups={topGroups} />
        </ScrollReveal>
        {/* <CategoryTiles categories={categories} /> */}
        <ScrollReveal delay={150}>
          <AppleCta />
        </ScrollReveal>
        <ScrollReveal delay={200}>
          <Recommendations />
        </ScrollReveal>
      </main>
      <NewsletterSignup />
      <Footer />
    </div>
  );
}
