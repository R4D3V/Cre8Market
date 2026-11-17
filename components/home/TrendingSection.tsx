"use client";

import { useState } from "react";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/lib/types";
import SectionHeading from "./SectionHeading";

export interface ProductGroup {
  name: string;
  products: Product[];
}

interface Props {
  groups: ProductGroup[];
}

export default function TrendingSection({ groups }: Props) {
  const [active, setActive] = useState(0);
  const group = groups[active];

  if (!group) return null;

  return (
    <section className="container pt-14 sm:pt-20">
      <SectionHeading
        eyebrow="Most wanted"
        title="Trending in Entebbe right now"
        description="The pieces everyone is watching this week — refreshed as new listings land."
        action={{ label: "Browse all products", href: "/products" }}
      />

      <div className="mt-7 flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {groups.map((item, index) => {
          const isActive = index === active;
          return (
            <button
              key={item.name}
              type="button"
              onClick={() => setActive(index)}
              aria-pressed={isActive}
              className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-[0_10px_28px_-10px_rgba(109,232,124,0.65)]"
                  : "border border-border/70 bg-card/50 text-muted-foreground hover:border-primary/40 hover:text-foreground"
              }`}
            >
              {item.name}
              <span
                className={`ml-1.5 text-[10px] ${
                  isActive ? "text-primary-foreground/70" : "text-muted-foreground/60"
                }`}
              >
                {item.products.length}
              </span>
            </button>
          );
        })}
      </div>

      <div
        key={group.name}
        className="animate-fade-in mt-6 grid grid-cols-2 gap-3.5 sm:gap-4 md:grid-cols-3 xl:grid-cols-4"
      >
        {group.products.slice(0, 8).map((product) => (
          <ProductCard key={`${product.id}-${product.slug}`} product={product} />
        ))}
      </div>
    </section>
  );
}
