"use client";

import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

const brands = [
  {
    id: "apple",
    name: "Apple",
    label: "Inside the Apple brand",
    heading: "Think different. Shop Apple.",
    description:
      "MacBooks, iPads and iPhones that simply work — beautifully designed, effortlessly powerful, and ready for whatever you're building next.",
    href: "/products?q=apple",
    image:
      "https://images.unsplash.com/photo-1707485122968-56916bd2c464?q=80&w=1200&auto=format&fit=crop",
    alt: "Apple MacBook and devices",
  },
  {
    id: "samsung",
    name: "Samsung",
    label: "Inside the Samsung brand",
    heading: "Innovate your world.",
    description:
      "From brilliant displays to everyday flagships, Samsung brings the tech that keeps your work sharp and your downtime sharper.",
    href: "/products?q=samsung",
    image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=1200&q=80",
    alt: "Samsung Galaxy smartphones",
  },
  {
    id: "tecno",
    name: "Tecno",
    label: "Inside the Tecno brand",
    heading: "Built to keep up with you.",
    description:
      "Big screens, long battery life and prices that make sense. Tecno is the everyday companion for life on the move in Entebbe.",
    href: "/products?q=tecno",
    image:
      "https://images.unsplash.com/photo-1763162603999-8a1958b13cf1?q=80&w=1200&auto=format&fit=crop",
    alt: "Tecno smartphone",
  },
  {
    id: "google",
    name: "Google",
    label: "Inside the Google brand",
    heading: "Made by Google. Made for you.",
    description:
      "Pixel phones with the camera smarts and clean software that make everyday moments look — and feel — a little more extraordinary.",
    href: "/products?q=google",
    image:
      "https://images.unsplash.com/photo-1727132528094-117c9dceb047?q=80&w=1200&auto=format&fit=crop",
    alt: "Google Pixel devices",
  },
];

export default function BrandSpotlight() {
  const [current, setCurrent] = useState(0);
  const brand = brands[current];

  const goTo = useCallback((index: number) => {
    setCurrent((index + brands.length) % brands.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((value) => (value + 1) % brands.length);
    }, 6500);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="container pt-16 sm:pt-24">
      <div className="relative overflow-hidden rounded-[2rem] border border-border/70 bg-card shadow-[0_40px_100px_-60px_rgba(0,0,0,0.9)] sm:rounded-[2.5rem]">
        <div className="grid lg:grid-cols-[1.02fr_1fr]">
          {/* Copy panel */}
          <div className="relative z-10 flex flex-col justify-between gap-10 p-7 sm:p-10 lg:p-14">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -left-24 -top-28 h-64 w-64 rounded-full bg-primary/10 blur-[90px]"
            />

            <div key={brand.id} className="animate-fade-in relative">
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-primary/80">
                {brand.label}
              </p>
              <h2 className="mt-4 max-w-md font-heading text-3xl font-extrabold tracking-[-0.03em] text-foreground sm:text-4xl lg:text-[2.9rem] lg:leading-[1.08]">
                {brand.heading}
              </h2>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
                {brand.description}
              </p>

              <Link
                href={brand.href}
                className="group mt-7 inline-flex w-fit items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition hover:bg-accent"
              >
                Shop {brand.name}
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
            </div>

            <div className="relative">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap gap-2">
                  {brands.map((item, index) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => goTo(index)}
                      aria-pressed={index === current}
                      className={`rounded-full px-3.5 py-2 text-[11px] font-semibold transition ${
                        index === current
                          ? "bg-primary/15 text-primary ring-1 ring-primary/30"
                          : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                      }`}
                    >
                      {item.name}
                    </button>
                  ))}
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => goTo(current - 1)}
                    aria-label="Previous brand"
                    className="grid h-9 w-9 place-items-center rounded-full border border-border/70 text-muted-foreground transition hover:border-primary/50 hover:text-primary"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => goTo(current + 1)}
                    aria-label="Next brand"
                    className="grid h-9 w-9 place-items-center rounded-full border border-border/70 text-muted-foreground transition hover:border-primary/50 hover:text-primary"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="mt-5 h-1 w-full overflow-hidden rounded-full bg-border/50">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
                  style={{ width: `${((current + 1) / brands.length) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Image panel */}
          <div className="relative min-h-[300px] overflow-hidden sm:min-h-[380px] lg:min-h-[540px]">
            <Image
              key={brand.id}
              src={brand.image}
              alt={brand.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="animate-fade-in object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent lg:bg-gradient-to-r lg:from-card lg:via-card/15 lg:to-transparent" />
            <span className="absolute bottom-5 right-5 rounded-full border border-white/15 bg-black/35 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white backdrop-blur">
              {brand.name} collection
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
