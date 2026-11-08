import type { Metadata } from "next";
import ProductsPageClient from "@/components/ProductsPageClient";

export const metadata: Metadata = {
  title: "Browse Listings in Entebbe | CRE8MARKET",
  description:
    "Explore local marketplace listings, featured items, and top deals from trusted sellers in Entebbe.",
  alternates: {
    canonical: "/products",
  },
};

// Render the page shell immediately; ProductsPageClient shows a skeleton and
// fetches the first page of products/categories/sellers on the client so the
// user isn't blocked waiting for the database round-trip.
export default function ProductsPage() {
  return <ProductsPageClient />;
}