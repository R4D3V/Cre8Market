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

export default function ProductsPage() {
  return <ProductsPageClient />;
}
