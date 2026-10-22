import type { MetadataRoute } from "next";
import { getProducts, getSellers } from "@/lib/db/queries";

const BASE = process.env.NEXT_PUBLIC_APP_URL || "https://cre8market.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    "",
    "/products",
    "/deals",
    "/sellers",
    "/contact",
    "/privacy",
    "/terms",
    "/install",
  ].map((p) => ({
    url: `${BASE}${p}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: p === "" ? 1 : 0.7,
  }));

  let productRoutes: MetadataRoute.Sitemap = [];
  let sellerRoutes: MetadataRoute.Sitemap = [];
  try {
    const products = await getProducts();
    productRoutes = products.map((p) => ({
      url: `${BASE}/products/${p.slug}`,
      lastModified: p.createdAt ? new Date(p.createdAt) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));
    const sellers = await getSellers();
    sellerRoutes = sellers.map((s: { id: string }) => ({
      url: `${BASE}/sellers/${s.id}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.5,
    }));
  } catch {
    // DB unavailable at build time; sitemap still lists static routes.
  }

  return [...staticRoutes, ...productRoutes, ...sellerRoutes];
}