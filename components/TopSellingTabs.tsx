"use client";

import { useState } from "react";
import ProductCard from "./ProductCard";
import type { Product } from "@/lib/types";

export interface ProductGroup {
  name: string;
  products: Product[];
}

interface Props {
  groups: ProductGroup[];
}

export default function TopSellingTabs({ groups }: Props) {
  const [active, setActive] = useState(0);
  const group = groups[active];

  if (!group) return null;

  return (
    <section className="container py-10">
      <h2 className="text-h3-sm sm:text-h3 font-heading">Top Selling Products</h2>

      <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 border-b border-border">
        {groups.map((g, i) => (
          <button
            key={g.name}
            onClick={() => setActive(i)}
            className={`-mb-px border-b-2 pb-2 text-sm font-semibold transition ${
              i === active
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {g.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-5 py-8 md:grid-cols-3 xl:grid-cols-4">
        {group.products.slice(0, 8).map((p) => (
          <ProductCard key={`${p.id}-${p.slug}`} product={p} variant="dark" />
        ))}
      </div>
    </section>
  );
}