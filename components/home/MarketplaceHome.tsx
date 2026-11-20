import TrustStrip from "@/components/home/TrustStrip";
import { getCategories, getDeals, getProducts } from "@/lib/db/queries";
import type { CategoryDB, Product } from "@/lib/types";
import CategoryGrid from "./CategoryGrid";
import FlashDeals from "./FlashDeals";
import MarketplaceHero from "./MarketplaceHero";
import { buildCategoryRails, groupCategories } from "./marketplace-data";
import ProductRail from "./ProductRail";
import PromoBand from "./PromoBand";

export default async function MarketplaceHome() {
  const [productsResult, categoriesResult, dealsResult] = await Promise.allSettled([
    getProducts(),
    getCategories(),
    getDeals(),
  ]);

  if (productsResult.status === "rejected") {
    console.error(
      "DB unavailable on homepage load, rendering the marketplace shell:",
      (productsResult.reason as Error)?.message,
    );
  }
  if (categoriesResult.status === "rejected") {
    console.error(
      "Categories unavailable on homepage load, using fallback groups:",
      (categoriesResult.reason as Error)?.message,
    );
  }

  const products: Product[] = productsResult.status === "fulfilled" ? productsResult.value : [];
  const categories: CategoryDB[] =
    categoriesResult.status === "fulfilled" ? categoriesResult.value : [];
  const deals: Product[] = dealsResult.status === "fulfilled" ? dealsResult.value : [];

  const groups = groupCategories(categories);
  const rails = buildCategoryRails(products, categories);
  const flashDeals = deals.length > 0 ? deals : products.slice(0, 8);

  return (
    <>
      <MarketplaceHero groups={groups} products={products} />
      <TrustStrip />
      <FlashDeals products={flashDeals} />
      <CategoryGrid groups={groups} />

      <ProductRail
        title="New in Entebbe"
        subtitle="Fresh listings from verified local sellers"
        href="/products?sort=latest"
        icon="✨"
        products={products.slice(0, 8)}
      />

      {rails.slice(0, 5).map((rail) => (
        <ProductRail
          key={rail.slug}
          title={rail.name}
          subtitle={`${rail.products.length} ${
            rail.products.length === 1 ? "listing" : "listings"
          } available`}
          href={`/products?category=${encodeURIComponent(rail.slug)}`}
          icon={rail.icon}
          products={rail.products}
        />
      ))}

      <PromoBand />
    </>
  );
}
