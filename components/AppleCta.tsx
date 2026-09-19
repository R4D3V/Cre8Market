"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const brands = [
  {
    id: "apple",
    label: "Inside the Apple Brand",
    heading: "Think Different. Shop Apple.",
    cta: "Shop Now",
    href: "/products?q=apple",
    image:
      "https://images.unsplash.com/photo-1707485122968-56916bd2c464?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Apple MacBook and devices",
  },
  {
    id: "samsung",
    label: "Inside the Samsung Brand",
    heading: "Innovate Your World. Shop Samsung.",
    cta: "Shop Now",
    href: "/products?q=samsung",
    image:
      "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=1200&q=80",
    alt: "Samsung Galaxy smartphones",
  },
  {
    id: "tecno",
    label: "Inside the Tecno Brand",
    heading: "Stop At Nothing. Shop Tecno.",
    cta: "Shop Now",
    href: "/products?q=tecno",
    image:
      "https://images.unsplash.com/photo-1763162603999-8a1958b13cf1?q=80&w=1009&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Tecno smartphone",
  },
  {
    id: "google",
    label: "Inside the Google Brand",
    heading: "Made by Google. Made for You.",
    cta: "Shop Now",
    href: "/products?q=google",
    image:
      "https://images.unsplash.com/photo-1727132528094-117c9dceb047?q=80&w=1031&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Google Pixel devices",
  },
];

export default function AppleCta() {
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const goTo = useCallback(
    (index: number) => {
      if (isAnimating) return;
      setIsAnimating(true);
      setCurrent((index + brands.length) % brands.length);
      setTimeout(() => setIsAnimating(false), 500);
    },
    [isAnimating],
  );

  const prev = () => goTo(current - 1);
  const next = useCallback(() => goTo(current + 1), [current, goTo]);

  // Auto-advance every 5 seconds
  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  const brand = brands[current];

  return (
    <section className="border-y border-border overflow-hidden">
      {/* ── Mobile: full-bleed background image with overlay ── */}
      <div
        key={brand.id + "-bg"}
        className="relative lg:hidden"
        style={{
          backgroundImage: `url('${brand.image}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          animation: "ctaFadeIn 0.45s ease both",
        }}
      >
        {/* Dark gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/20" />

        {/* Text content on top of the background */}
        <div className="relative z-10 px-6 py-16 text-white">
          <p className="text-sm font-semibold uppercase tracking-wide text-white/80">
            {brand.label}
          </p>
          <h2 className="mt-3 text-h2-sm sm:text-h2 font-heading text-white drop-shadow">
            {brand.heading}
          </h2>
          <Link
            href={brand.href}
            className="button mt-6 inline-block bg-white px-8 py-3 text-black font-semibold hover:bg-primary hover:text-primary-foreground"
          >
            {brand.cta}
          </Link>

          {/* Controls inside the card on mobile */}
          <div className="mt-8 flex items-center justify-between">
            <div className="flex gap-2">
              {brands.map((b, i) => (
                <button
                  key={b.id}
                  onClick={() => goTo(i)}
                  aria-label={`Go to ${b.label}`}
                  style={{
                    width: i === current ? "24px" : "8px",
                    height: "8px",
                    borderRadius: "9999px",
                    background:
                      i === current ? "#fff" : "rgba(255,255,255,0.4)",
                    transition: "all 0.3s",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                  }}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={prev}
                aria-label="Previous brand"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/40 bg-white/20 text-white backdrop-blur-sm transition hover:bg-white hover:text-black"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={next}
                aria-label="Next brand"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/40 bg-white/20 text-white backdrop-blur-sm transition hover:bg-white hover:text-black"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Desktop: two-column grid layout ── */}
      <div className="category-tint-2 hidden lg:block">
        <div className="container relative py-14">
          <div
            key={brand.id + "-desktop"}
            style={{ animation: "ctaFadeIn 0.45s ease both" }}
            className="grid items-center gap-x-10 lg:grid-cols-2"
          >
            {/* Text side */}
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-primary">
                {brand.label}
              </p>
              <h2 className="mt-3 text-h2-sm sm:text-h2 font-heading">
                {brand.heading}
              </h2>
              <Link
                href={brand.href}
                className="button mt-6 inline-block bg-primary px-8 py-3 text-primary-foreground hover:bg-background hover:text-primary"
              >
                {brand.cta}
              </Link>
            </div>

            {/* Image side */}
            <div className="relative mx-auto aspect-[616/409] w-full max-w-[616px]">
              <Image
                src={brand.image}
                alt={brand.alt}
                fill
                sizes="616px"
                className="rounded-xl object-cover"
                priority={brand.id === "apple"}
              />
            </div>
          </div>

          {/* Controls row */}
          <div className="mt-8 flex items-center justify-between">
            <div className="flex gap-2">
              {brands.map((b, i) => (
                <button
                  key={b.id}
                  onClick={() => goTo(i)}
                  aria-label={`Go to ${b.label}`}
                  style={{
                    width: i === current ? "24px" : "8px",
                    height: "8px",
                    borderRadius: "9999px",
                    background:
                      i === current
                        ? "var(--color-primary, #000)"
                        : "var(--color-border, #ccc)",
                    transition: "all 0.3s",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                  }}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={prev}
                aria-label="Previous brand"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-foreground transition hover:bg-primary hover:text-primary-foreground"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={next}
                aria-label="Next brand"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-foreground transition hover:bg-primary hover:text-primary-foreground"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes ctaFadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
