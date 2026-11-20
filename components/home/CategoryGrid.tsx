import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { CategoryGroup } from "./marketplace-data";

interface Props {
  groups: CategoryGroup[];
}

export default function CategoryGrid({ groups }: Props) {
  if (groups.length === 0) return null;

  return (
    <section className="container pt-8 sm:pt-10">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="font-heading text-lg font-extrabold tracking-tight text-foreground sm:text-xl">
            Shop by category
          </h2>
          <p className="text-[11px] text-muted-foreground sm:text-xs">
            Everything from phones to groceries, in one place
          </p>
        </div>
        <Link
          href="/products"
          className="inline-flex shrink-0 items-center gap-1.5 text-[11px] font-bold text-primary transition hover:text-accent sm:text-xs"
        >
          See all
          <ArrowRight className="size-3.5" />
        </Link>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2.5 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7">
        {groups.map((group) => (
          <Link
            key={group.id}
            href={`/products?category=${encodeURIComponent(group.slug)}`}
            className="group flex flex-col items-center gap-2 rounded-2xl border border-border/50 bg-card/50 p-3 text-center transition hover:-translate-y-0.5 hover:border-primary/40 hover:bg-card"
          >
            <span
              className="grid size-12 place-items-center rounded-full text-2xl transition group-hover:scale-105"
              style={{
                backgroundColor: `${group.color}1f`,
                boxShadow: `inset 0 0 0 1px ${group.color}33`,
              }}
            >
              {group.icon}
            </span>
            <span className="line-clamp-2 text-[11px] font-semibold leading-tight text-foreground/90 transition group-hover:text-primary">
              {group.name}
            </span>
            <span className="text-[9px] text-muted-foreground/70">
              {group.childCount > 0 ? `${group.childCount} sections` : "Browse"}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
