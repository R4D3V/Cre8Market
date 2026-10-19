import type { Metadata } from "next";
import ProductsPageClient from "@/components/ProductsPageClient";
import { getProductsPage, getCategories, getSellers } from "@/lib/db/queries";

export const metadata: Metadata = {
  title: "Browse Listings in Entebbe | CRE8MARKET",
  description:
    "Explore local marketplace listings, featured items, and top deals from trusted sellers in Entebbe.",
  alternates: {
    canonical: "/products",
  },
};

interface SearchParams {
  q?: string;
  category?: string;
  featured?: string;
  sort?: string;
  seller?: string;
  minPrice?: string;
  maxPrice?: string;
  page?: string;
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const page = Number(sp.page) || 1;

  const [pageData, categories, sellers] = await Promise.all([
    getProductsPage({
      search: sp.q,
      categorySlug: sp.category,
      sellerId: sp.seller,
      minPrice: sp.minPrice ? Number(sp.minPrice) : undefined,
      maxPrice: sp.maxPrice ? Number(sp.maxPrice) : undefined,
      featured: sp.featured === "1",
      sort: sp.sort,
      limit: 16,
      offset: (page - 1) * 16,
    }),
    getCategories(),
    getSellers(),
  ]);

  return (
    <ProductsPageClient
      initialProducts={pageData.products}
      initialTotal={pageData.total}
      initialCategories={categories}
      initialSellers={sellers}
    />
  );
}