import type { Product } from "@/lib/types";

export const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://www.cre8-market.com";
export const SITE_NAME = "CRE8MARKET Entebbe";

const CONDITION_SCHEMA: Record<string, string> = {
  New: "https://schema.org/NewCondition",
  Refurbished: "https://schema.org/RefurbishedCondition",
  "Like New": "https://schema.org/UsedCondition",
  Used: "https://schema.org/UsedCondition",
  "Used - Good": "https://schema.org/UsedCondition",
  "Used - Fair": "https://schema.org/UsedCondition",
};

function clean(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

function formatUgx(price: number): string {
  return `UGX ${Math.round(price).toLocaleString("en-US")}`;
}

/** Search-friendly page title: "HP EliteBook 840 G5 (Used) | Computers & Laptops for sale in Entebbe". */
export function buildProductTitle(p: Product): string {
  const cond = p.condition ? ` (${p.condition})` : "";
  return `${clean(p.title)}${cond} | ${p.category} for sale in ${p.location ?? "Entebbe"}`;
}

/**
 * Meta description of at most 160 characters. Always leads with the facts a
 * buyer searches for (title, condition, price, place) and then adds the
 * seller's own text, so even a one-word description gives a usable snippet.
 */
export function buildProductDescription(p: Product): string {
  const place = p.location ?? "Entebbe";
  const lead = `${clean(p.title)}${p.condition ? `, ${p.condition}` : ""} for ${formatUgx(p.price)} in ${place}, Uganda.`;
  const seller = p.description ? clean(p.description) : "";
  const tail = seller || "Chat directly with the seller on WhatsApp.";
  const full = `${lead} ${tail}`;
  if (full.length <= 160) return full;
  return `${full.slice(0, 157).trimEnd()}...`;
}

/** schema.org Product JSON-LD so Google can show price and availability. */
export function buildProductJsonLd(p: Product) {
  const url = `${SITE_URL}/products/${p.slug}`;
  const images = (p.images ?? []).filter(Boolean);
  const sellerName = p.ownerName || p.seller?.name;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: clean(p.title),
    description: p.description ? clean(p.description) : buildProductDescription(p),
    ...(images.length ? { image: images } : {}),
    category: p.category,
    ...(p.condition && CONDITION_SCHEMA[p.condition]
      ? { itemCondition: CONDITION_SCHEMA[p.condition] }
      : {}),
    url,
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: "UGX",
      price: p.price,
      availability: "https://schema.org/InStock",
      ...(sellerName ? { seller: { "@type": "Person", name: sellerName } } : {}),
    },
  };
}

/** Breadcrumb trail (Home > Listings > category > product) for search results. */
export function buildBreadcrumbJsonLd(p: Product) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "Listings",
        item: `${SITE_URL}/products`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: clean(p.title),
        item: `${SITE_URL}/products/${p.slug}`,
      },
    ],
  };
}

/** Escape "<" so seller-written text can never close the script tag. */
export function jsonLdString(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
