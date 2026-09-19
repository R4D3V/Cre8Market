"use client";

import Link from "next/link";
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

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  const brand = brands[current];

  return (
    <section className="border-y border-border overflow-hidden">
      {/* Full-bleed background image — all screen sizes */}
      <div
        key={brand.id}
        className="relative min-h-[340px] lg:min-h-[420px]"
        style={{
          backgroundImage: `url('${brand.image}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          animation: "ctaFadeIn 0.5s ease both",
        }}
      >
        {/* Gradient overlay — stronger at bottom so controls stay legible */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-black/25" />

        {/* Content */}
        <div className="relative z-10 flex h-full flex-col justify-between px-6 py-12 lg:px-16 lg:py-16">
          {/* Text block */}
          <div className="max-w-xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-white/70">
              {brand.label}
            </p>
            <h2 className="mt-3 text-h2-sm font-heading text-white drop-shadow-md sm:text-h2">
              {brand.heading}
            </h2>
            <Link
              href={brand.href}
              className="button mt-6 inline-block bg-white px-8 py-3 font-semibold text-black transition hover:bg-primary hover:text-primary-foreground"
            >
              {brand.cta}
            </Link>
          </div>

          {/* Controls row */}
          <div className="mt-10 flex items-center justify-between">
            {/* Dot indicators */}
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
                      i === current ? "#fff" : "rgba(255,255,255,0.35)",
                    transition: "all 0.3s",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                  }}
                />
              ))}
            </div>

            {/* Prev / Next */}
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

      <style>{`
        @keyframes ctaFadeIn {
          from { opacity: 0; transform: scale(1.015); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </section>
  );
}

