import Link from "next/link";
import type { CategoryDB } from "@/lib/types";

export default function CategoryTiles({ categories }: { categories: CategoryDB[] }) {
  if (categories.length === 0) return null;

  return (
    <section className="container grid gap-5 py-10 sm:grid-cols-2 md:grid-cols-3">
      {categories.map((c) => (
        <Link
          key={c.id}
          href={`/products?category=${c.slug}`}
          className="group flex items-center gap-x-3 rounded-xl border border-border bg-card p-5 transition hover:border-primary"
        >
          <span className="text-2xl">{c.icon}</span>
          <span className="font-semibold text-foreground group-hover:text-primary">
            {c.name}
          </span>
        </Link>
      ))}
    </section>
  );
}