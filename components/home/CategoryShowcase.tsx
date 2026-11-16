import Link from "next/link";
import {
  ArrowUpRight,
  Bike,
  Briefcase,
  Camera,
  Car,
  CookingPot,
  Dumbbell,
  Gamepad2,
  Gem,
  Headphones,
  House,
  Laptop,
  Microwave,
  Shirt,
  ShoppingBag,
  Smartphone,
  Sofa,
  Tv,
  Watch,
  Wrench,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Product } from "@/lib/types";
import SectionHeading from "./SectionHeading";

const iconBySlug: Record<string, LucideIcon> = {
  "phones-tablets": Smartphone,
  phones: Smartphone,
  "laptops-computers": Laptop,
  "computers-laptops": Laptop,
  laptops: Laptop,
  computers: Laptop,
  electronics: Tv,
  gaming: Gamepad2,
  "home-appliances": Microwave,
  appliances: CookingPot,
  "home-furniture": Sofa,
  furniture: Sofa,
  fashion: Shirt,
  clothing: Shirt,
  audio: Headphones,
  "audio-music": Headphones,
  cameras: Camera,
  photography: Camera,
  vehicles: Car,
  cars: Car,
  "sports-outdoors": Dumbbell,
  sports: Dumbbell,
  fitness: Dumbbell,
  "health-beauty": Gem,
  beauty: Gem,
  accessories: Watch,
  property: House,
  "property-rentals": House,
  services: Briefcase,
  bicycles: Bike,
  "tools-equipment": Wrench,
  "tech-equipment": Wrench,
  tools: Wrench,
  "baby-kids": ShoppingBag,
};

function iconForCategory(slug: string, name: string): LucideIcon {
  const direct = iconBySlug[slug];
  if (direct) return direct;

  const value = `${slug} ${name}`.toLowerCase();
  if (value.includes("phone") || value.includes("tablet")) return Smartphone;
  if (value.includes("laptop") || value.includes("computer")) return Laptop;
  if (value.includes("appliance")) return Microwave;
  if (value.includes("furniture")) return Sofa;
  if (value.includes("tool")) return Wrench;
  if (value.includes("game") || value.includes("console")) return Gamepad2;
  if (value.includes("audio") || value.includes("headphone")) return Headphones;
  if (value.includes("camera")) return Camera;
  if (value.includes("car") || value.includes("vehicle")) return Car;
  if (value.includes("sport") || value.includes("fitness")) return Dumbbell;
  if (value.includes("beauty") || value.includes("health")) return Gem;
  if (value.includes("tv") || value.includes("electronic")) return Tv;
  if (value.includes("fashion") || value.includes("cloth")) return Shirt;
  if (value.includes("watch") || value.includes("accessor")) return Watch;

  return ShoppingBag;
}

const palette = [
  "#6de87c",
  "#7c6de8",
  "#54b8ff",
  "#ff9f68",
  "#f472b6",
  "#f5c451",
  "#4dd0b1",
  "#93a5b8",
];

function tint(color: string, percent: number) {
  return `color-mix(in srgb, ${color} ${percent}%, transparent)`;
}

export default function CategoryShowcase({ products }: { products: Product[] }) {
  const counts = new Map<
    string,
    { name: string; slug: string; count: number; color?: string }
  >();

  for (const product of products) {
    const existing = counts.get(product.categorySlug);
    if (existing) {
      existing.count += 1;
      continue;
    }
    counts.set(product.categorySlug, {
      name: product.category,
      slug: product.categorySlug,
      count: 1,
      color: product.categoryColor,
    });
  }

  const categories = Array.from(counts.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  if (categories.length === 0) return null;

  return (
    <section className="container pt-14 sm:pt-20">
      <SectionHeading
        eyebrow="Browse the aisles"
        title="Shop by category"
        description="From pocket-sized upgrades to whole-room refreshes — start where your curiosity takes you."
        action={{ label: "All categories", href: "/products" }}
      />

      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
        {categories.map((category, index) => {
          const Icon = iconForCategory(category.slug, category.name);
          const color =
            category.color && category.color.trim()
              ? category.color
              : palette[index % palette.length];

          return (
            <Link
              key={category.slug}
              href={`/products?category=${encodeURIComponent(category.slug)}`}
              className="group relative overflow-hidden rounded-2xl border border-border/70 bg-gradient-to-b from-card to-card/40 p-4 transition duration-300 hover:-translate-y-1 hover:border-primary/45 hover:shadow-[0_22px_45px_-24px_rgba(109,232,124,0.35)] sm:p-5"
            >
              <div
                aria-hidden="true"
                className="absolute -right-8 -top-10 h-24 w-24 rounded-full opacity-20 blur-2xl transition duration-500 group-hover:opacity-45"
                style={{ backgroundColor: color }}
              />
              <div className="relative">
                <span
                  className="grid h-11 w-11 place-items-center rounded-xl border"
                  style={{
                    borderColor: tint(color, 35),
                    backgroundColor: tint(color, 12),
                    color,
                  }}
                >
                  <Icon className="h-5 w-5" />
                </span>

                <ArrowUpRight className="absolute right-0 top-1 h-4 w-4 -translate-y-0.5 text-muted-foreground/60 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:text-primary group-hover:opacity-100" />

                <p className="mt-4 line-clamp-2 text-sm font-bold leading-snug text-foreground">
                  {category.name}
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  {category.count} {category.count === 1 ? "listing" : "listings"}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
