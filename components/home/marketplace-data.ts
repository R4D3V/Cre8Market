import type { CategoryDB, Product } from "@/lib/types";

export interface CategoryGroup {
  id: string;
  name: string;
  slug: string;
  icon: string;
  color: string;
  childCount: number;
}

export interface CategoryRail {
  slug: string;
  name: string;
  icon: string;
  color: string;
  products: Product[];
}

// Rendered when the database is unreachable so the homepage keeps its shape.
export const FALLBACK_GROUPS: CategoryGroup[] = [
  {
    id: "phones-tablets",
    name: "Phones & Tablets",
    slug: "phones-tablets",
    icon: "📱",
    color: "#3b82f6",
    childCount: 5,
  },
  {
    id: "computing",
    name: "Computing",
    slug: "computing",
    icon: "💻",
    color: "#8b5cf6",
    childCount: 6,
  },
  {
    id: "electronics",
    name: "Electronics",
    slug: "electronics",
    icon: "🎧",
    color: "#6366f1",
    childCount: 6,
  },
  {
    id: "home-office",
    name: "Home & Office",
    slug: "home-office",
    icon: "🏠",
    color: "#10b981",
    childCount: 6,
  },
  {
    id: "home-appliances",
    name: "Home Appliances",
    slug: "home-appliances",
    icon: "🔌",
    color: "#f59e0b",
    childCount: 6,
  },
  { id: "fashion", name: "Fashion", slug: "fashion", icon: "👗", color: "#ec4899", childCount: 9 },
  {
    id: "health-beauty",
    name: "Health & Beauty",
    slug: "health-beauty",
    icon: "💄",
    color: "#f43f5e",
    childCount: 8,
  },
  {
    id: "supermarket",
    name: "Supermarket",
    slug: "supermarket",
    icon: "🛒",
    color: "#22c55e",
    childCount: 5,
  },
  {
    id: "baby-products",
    name: "Baby Products",
    slug: "baby-products",
    icon: "🍼",
    color: "#38bdf8",
    childCount: 5,
  },
  {
    id: "sporting-goods",
    name: "Sporting Goods",
    slug: "sporting-goods",
    icon: "⚽",
    color: "#f97316",
    childCount: 4,
  },
  { id: "gaming", name: "Gaming", slug: "gaming", icon: "🎮", color: "#7c3aed", childCount: 3 },
  {
    id: "automotive",
    name: "Automotive",
    slug: "automotive",
    icon: "🚗",
    color: "#64748b",
    childCount: 4,
  },
  {
    id: "property",
    name: "Property",
    slug: "property",
    icon: "🏗️",
    color: "#f97316",
    childCount: 0,
  },
  { id: "other", name: "Other", slug: "other", icon: "📦", color: "#64748b", childCount: 0 },
];

export function groupCategories(categories: CategoryDB[]): CategoryGroup[] {
  const parents = categories.filter((category) => !category.parent_id);
  if (parents.length === 0) return FALLBACK_GROUPS;

  return parents.map((parent) => ({
    id: parent.id,
    name: parent.name,
    slug: parent.slug,
    icon: parent.icon,
    color: parent.color,
    childCount: categories.filter((category) => category.parent_id === parent.id).length,
  }));
}

// Fold every product into its top-level group so a shelf for "Computing" also
// contains laptops, routers and storage listed under its subcategories.
export function buildCategoryRails(products: Product[], categories: CategoryDB[]): CategoryRail[] {
  const bySlug = new Map(categories.map((category) => [category.slug, category]));
  const byId = new Map(categories.map((category) => [category.id, category]));
  const rails = new Map<string, CategoryRail>();

  for (const product of products) {
    const category = bySlug.get(product.categorySlug);
    const parent = category?.parent_id ? (byId.get(category.parent_id) ?? category) : category;
    const slug = parent?.slug ?? product.categorySlug;

    const existing = rails.get(slug);
    if (existing) {
      existing.products.push(product);
      continue;
    }

    rails.set(slug, {
      slug,
      name: parent?.name ?? product.category,
      icon: parent?.icon ?? product.categoryIcon ?? "🛍️",
      color: parent?.color ?? product.categoryColor ?? "#6de87c",
      products: [product],
    });
  }

  return Array.from(rails.values()).sort((a, b) => b.products.length - a.products.length);
}

export function formatUgx(price: number) {
  return `UGX ${price.toLocaleString("en-UG")}`;
}
