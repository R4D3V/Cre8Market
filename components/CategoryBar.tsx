"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchCategoriesAction } from "@/lib/actions/categories";
import type { CategoryDB } from "@/lib/types";

export default function CategoryBar() {
  const [categories, setCategories] = useState<CategoryDB[]>([]);

  useEffect(() => {
    fetchCategoriesAction().then((data) => setCategories(data ?? []));
  }, []);

  return (
    <div className="border-b border-border bg-background px-3 sm:px-4">
      <div className="container">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-3">
          <Link
            href="/products"
            className="shrink-0 rounded-md border border-border bg-card text-sm font-semibold text-foreground px-4 py-2 whitespace-nowrap transition hover:border-primary hover:text-primary"
          >
            All
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className="shrink-0 flex items-center gap-1.5 rounded-md border border-border bg-card text-sm font-medium text-muted-foreground hover:text-foreground hover:border-primary px-4 py-2 whitespace-nowrap transition"
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
