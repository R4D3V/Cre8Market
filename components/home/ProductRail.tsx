"use client";

import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/lib/types";

interface Props {
  title: string;
  subtitle?: string;
  href: string;
  icon?: string;
  products: Product[];
}

function widthClass(count: number) {
  if (count >= 5) return "w-[45%] sm:w-[30%] md:w-[23%] lg:w-[18.6%]";
  if (count === 4) return "w-[45%] sm:w-[30%] md:w-[23%]";
  if (count === 3) return "w-[45%] sm:w-[30%]";
  return "w-[45%] sm:w-[40%]";
}

export default function ProductRail({ title, subtitle, href, icon, products }: Props) {
  const railRef = useRef<HTMLDivElement>(null);

  if (products.length === 0) return null;

  function scroll(direction: -1 | 1) {
    const rail = railRef.current;
    if (!rail) return;
    rail.scrollBy({ left: direction * rail.clientWidth * 0.85, behavior: "smooth" });
  }

  return (
    <section className="container pt-8 sm:pt-10">
      <div className="flex items-end justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          {icon && (
            <span className="grid size-10 shrink-0 place-items-center rounded-2xl border border-border/60 bg-card/70 text-xl">
              {icon}
            </span>
          )}
          <div className="min-w-0">
            <h2 className="truncate font-heading text-lg font-extrabold tracking-tight text-foreground sm:text-xl">
              {title}
            </h2>
            {subtitle && (
              <p className="truncate text-[11px] text-muted-foreground sm:text-xs">{subtitle}</p>
            )}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <div className="hidden items-center gap-1.5 sm:flex">
            <button
              type="button"
              onClick={() => scroll(-1)}
              aria-label={`Scroll ${title} left`}
              className="grid size-8 place-items-center rounded-full border border-border/70 text-muted-foreground transition hover:border-primary/50 hover:text-primary"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => scroll(1)}
              aria-label={`Scroll ${title} right`}
              className="grid size-8 place-items-center rounded-full border border-border/70 text-muted-foreground transition hover:border-primary/50 hover:text-primary"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
          <Link
            href={href}
            className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card/60 px-3.5 py-2 text-[11px] font-bold text-muted-foreground transition hover:border-primary/40 hover:text-primary"
          >
            See all
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>

      <div
        ref={railRef}
        className="mt-4 flex snap-x gap-3 overflow-x-auto pb-1 no-scrollbar sm:gap-4"
      >
        {products.map((product) => (
          <div
            key={`rail-${product.id}`}
            className={`shrink-0 snap-start ${widthClass(products.length)}`}
          >
            <ProductCard product={product} size="small" />
          </div>
        ))}
      </div>
    </section>
  );
}
