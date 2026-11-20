"use client";

import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Flame,
  ShieldCheck,
  Sparkles,
  Store,
  Wallet,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { Product } from "@/lib/types";
import { type CategoryGroup, formatUgx } from "./marketplace-data";

type Tone = "primary" | "amber" | "sky";

interface Slide {
  eyebrow: string;
  title: string;
  description: string;
  cta: string;
  href: string;
  image: string;
  tone: Tone;
}

const toneStyles: Record<Tone, { badge: string; button: string; glow: string; eyebrow: string }> = {
  primary: {
    badge: "border-primary/30 bg-primary/15 text-primary",
    button: "bg-primary text-primary-foreground hover:bg-accent",
    glow: "bg-primary/25",
    eyebrow: "text-primary",
  },
  amber: {
    badge: "border-amber-300/30 bg-amber-400/15 text-amber-200",
    button: "bg-amber-400 text-[#1a1200] hover:bg-amber-300",
    glow: "bg-amber-400/25",
    eyebrow: "text-amber-200",
  },
  sky: {
    badge: "border-sky-300/30 bg-sky-400/15 text-sky-200",
    button: "bg-sky-400 text-[#00131f] hover:bg-sky-300",
    glow: "bg-sky-400/25",
    eyebrow: "text-sky-200",
  },
};

const staticSlides: Slide[] = [
  {
    eyebrow: "Sell to us",
    title: "Turn your extras into cash.",
    description: "We buy phones, laptops and electronics — instant quote, same-day payment.",
    cta: "Get an instant quote",
    href: "/selltous",
    image: "/images/site/recommendation-2.webp",
    tone: "primary",
  },
  {
    eyebrow: "Daily deals",
    title: "Prices that won't wait.",
    description: "Fresh markdowns from verified Entebbe sellers, refreshed every day.",
    cta: "Shop today's deals",
    href: "/deals",
    image: "/images/site/recommendation-1.webp",
    tone: "amber",
  },
  {
    eyebrow: "Verified marketplace",
    title: "Shop local. Shop safe.",
    description: "Every seller is vetted and every price is clear — no guesswork.",
    cta: "Browse all products",
    href: "/products",
    image: "/brand/hero.jpeg",
    tone: "sky",
  },
];

function buildSlides(products: Product[]): Slide[] {
  const ranked = [...products].sort(
    (a, b) => Number(b.featured) - Number(a.featured) || Number(b.isDeal) - Number(a.isDeal),
  );

  const productSlides: Slide[] = ranked
    .filter((product) => product.images?.[0])
    .slice(0, 3)
    .map((product, index) => ({
      eyebrow: product.featured
        ? "Editor's pick"
        : product.isDeal
          ? "Deal of the day"
          : "Just landed",
      title: product.title,
      description: `${formatUgx(product.price)} · ${product.category} · Entebbe`,
      cta: "Shop now",
      href: `/products/${product.slug}`,
      image: product.images?.[0] ?? "/brand/hero.jpeg",
      tone: (["primary", "amber", "sky"] as Tone[])[index % 3],
    }));

  const remaining = Math.max(0, 3 - productSlides.length);
  return [...productSlides, ...staticSlides.slice(0, remaining)].slice(0, 3);
}

interface Props {
  groups: CategoryGroup[];
  products: Product[];
}

export default function MarketplaceHero({ groups, products }: Props) {
  const slides = buildSlides(products);
  const [active, setActive] = useState(0);

  const goTo = useCallback(
    (index: number) => {
      setActive((index + slides.length) % slides.length);
    },
    [slides.length],
  );

  useEffect(() => {
    if (slides.length < 2) return;
    const timer = setInterval(() => {
      setActive((value) => (value + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section className="container pt-4 sm:pt-6">
      <div className="grid gap-3 lg:grid-cols-[236px_minmax(0,1fr)_236px] xl:grid-cols-[260px_minmax(0,1fr)_260px]">
        {/* Category rail — the Jumia-style left menu */}
        <aside className="hidden flex-col overflow-hidden rounded-3xl border border-border/60 bg-card/70 lg:flex">
          <p className="border-b border-border/40 px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            All categories
          </p>
          <ul className="flex-1 overflow-y-auto py-1.5 no-scrollbar">
            {groups.slice(0, 14).map((group) => (
              <li key={group.id}>
                <Link
                  href={`/products?category=${encodeURIComponent(group.slug)}`}
                  className="group flex items-center gap-2.5 px-3 py-2 transition hover:bg-primary/10"
                >
                  <span
                    className="grid size-7 shrink-0 place-items-center rounded-lg text-sm"
                    style={{ backgroundColor: `${group.color}22`, color: group.color }}
                  >
                    {group.icon}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-[12.5px] font-medium text-foreground/85 transition group-hover:text-primary">
                    {group.name}
                  </span>
                  <ChevronRight className="size-3.5 shrink-0 text-muted-foreground/50 transition group-hover:translate-x-0.5 group-hover:text-primary" />
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/products"
            className="flex items-center justify-between gap-2 border-t border-border/40 px-4 py-3 text-[11px] font-bold text-primary transition hover:bg-primary/10"
          >
            See all categories
            <ArrowRight className="size-3.5" />
          </Link>
        </aside>

        {/* Promo carousel */}
        <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card">
          <div className="relative aspect-[16/11] sm:aspect-[16/8] lg:aspect-auto lg:h-full lg:min-h-[360px]">
            {slides.map((slide, index) => {
              const tone = toneStyles[slide.tone];
              const isActive = index === active;
              return (
                <div
                  key={`${slide.href}-${index}`}
                  aria-hidden={!isActive}
                  inert={!isActive}
                  className={`absolute inset-0 transition-opacity duration-700 ${
                    isActive ? "opacity-100" : "pointer-events-none opacity-0"
                  }`}
                >
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    priority={index === 0}
                    sizes="(max-width: 1024px) 100vw, 55vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#021321]/95 via-[#021321]/75 to-[#021321]/10" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#021321]/85 via-transparent to-transparent" />
                  <div
                    aria-hidden="true"
                    className={`absolute -bottom-24 -left-16 h-64 w-64 rounded-full blur-[100px] ${tone.glow}`}
                  />

                  <div className="relative flex h-full flex-col justify-end p-5 sm:p-7 lg:p-8">
                    <span
                      className={`inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.16em] backdrop-blur sm:text-[10px] ${tone.badge}`}
                    >
                      <Sparkles className="size-3" />
                      {slide.eyebrow}
                    </span>

                    <h2 className="mt-3 line-clamp-2 max-w-xl font-heading text-2xl font-extrabold leading-tight tracking-[-0.02em] text-white sm:text-3xl lg:text-[2.35rem]">
                      {slide.title}
                    </h2>
                    <p className="mt-2 max-w-md text-xs leading-relaxed text-white/65 sm:text-sm">
                      {slide.description}
                    </p>

                    <div className="mt-4 flex items-center gap-3">
                      <Link
                        href={slide.href}
                        className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-xs font-bold transition sm:px-5 sm:text-sm ${tone.button}`}
                      >
                        {slide.cta}
                        <ArrowRight className="size-4" />
                      </Link>
                      <span className="hidden items-center gap-1.5 text-[11px] font-medium text-white/60 sm:inline-flex">
                        <ShieldCheck className="size-3.5 text-primary" />
                        Verified sellers only
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}

            {slides.length > 1 && (
              <>
                <div className="absolute bottom-4 right-4 flex items-center gap-1.5 sm:bottom-5 sm:right-5">
                  <button
                    type="button"
                    onClick={() => goTo(active - 1)}
                    aria-label="Previous slide"
                    className="grid size-8 place-items-center rounded-full border border-white/20 bg-black/30 text-white backdrop-blur transition hover:border-primary/60 hover:text-primary"
                  >
                    <ChevronLeft className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => goTo(active + 1)}
                    aria-label="Next slide"
                    className="grid size-8 place-items-center rounded-full border border-white/20 bg-black/30 text-white backdrop-blur transition hover:border-primary/60 hover:text-primary"
                  >
                    <ChevronRight className="size-4" />
                  </button>
                </div>
                <div className="absolute bottom-6 left-5 flex items-center gap-1.5 sm:left-7 lg:left-8">
                  {slides.map((slide, index) => (
                    <button
                      key={`dot-${slide.href}-${index}`}
                      type="button"
                      onClick={() => goTo(index)}
                      aria-label={`Go to slide ${index + 1}`}
                      aria-pressed={index === active}
                      className={`h-1.5 rounded-full transition-all ${
                        index === active ? "w-6 bg-primary" : "w-1.5 bg-white/35 hover:bg-white/60"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Two stacked promos */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-1 lg:grid-rows-2">
          <Link
            href="/deals"
            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-amber-400/25 bg-gradient-to-br from-amber-500/20 via-card to-card p-3.5 transition hover:-translate-y-0.5 hover:border-amber-300/50 sm:p-4"
          >
            <div
              aria-hidden="true"
              className="absolute -right-8 -top-10 size-28 rounded-full bg-amber-400/20 blur-3xl transition group-hover:bg-amber-400/30"
            />
            <span className="relative grid size-9 place-items-center rounded-xl bg-amber-400/15 text-amber-300">
              <Flame className="size-4.5" />
            </span>
            <div className="relative mt-6">
              <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-amber-300/90">
                Flash deals
              </p>
              <p className="mt-1 font-heading text-sm font-extrabold leading-tight text-foreground sm:text-base">
                Up to 40% off today
              </p>
              <span className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-amber-200">
                Shop deals
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </div>
          </Link>

          <Link
            href="/selltous"
            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-primary/25 bg-gradient-to-br from-primary/15 via-card to-card p-3.5 transition hover:-translate-y-0.5 hover:border-primary/50 sm:p-4"
          >
            <div
              aria-hidden="true"
              className="absolute -right-8 -top-10 size-28 rounded-full bg-primary/20 blur-3xl transition group-hover:bg-primary/30"
            />
            <span className="relative grid size-9 place-items-center rounded-xl bg-primary/15 text-primary">
              <Wallet className="size-4.5" />
            </span>
            <div className="relative mt-6">
              <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-primary/90">
                Sell to us
              </p>
              <p className="mt-1 font-heading text-sm font-extrabold leading-tight text-foreground sm:text-base">
                Get paid the same day
              </p>
              <span className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-primary">
                Get a quote
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </div>
          </Link>
        </div>
      </div>

      {/* Mobile category strip */}
      <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar lg:hidden">
        <Link
          href="/products"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-[11px] font-bold text-primary"
        >
          <Store className="size-3.5" />
          All
        </Link>
        {groups.map((group) => (
          <Link
            key={`chip-${group.id}`}
            href={`/products?category=${encodeURIComponent(group.slug)}`}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border/60 bg-card/60 px-3 py-1.5 text-[11px] font-semibold text-muted-foreground transition hover:border-primary/40 hover:text-primary"
          >
            <span aria-hidden="true">{group.icon}</span>
            {group.name}
          </Link>
        ))}
      </div>
    </section>
  );
}
