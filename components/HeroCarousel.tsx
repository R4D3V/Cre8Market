"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const slides = [
  {
    eyebrow: "New Season",
    title: "Next-Gen Tech Gadgets",
    description: "Discover cutting-edge devices that keep you ahead of the curve.",
    image: "/images/hero-images/electronics-bg.avif",
    alt: "Next-Gen Tech Gadgets",
    priority: true,
  },
  {
    eyebrow: "Fresh Fits",
    title: "Fashion Forward Styles",
    description: "Trend-setting pieces for every wardrobe and every occasion.",
    image: "/images/hero-images/fashion-bg.webp",
    alt: "Fashion Forward Styles",
  },
  {
    eyebrow: "Handmade Love",
    title: "Artisan Crafts & Decor",
    description: "One-of-a-kind creations crafted with passion by local makers.",
    image: "/images/hero-images/art-bg.webp",
    alt: "Artisan Crafts & Decor",
  },
  {
    eyebrow: "Glow Up",
    title: "Beauty Essentials",
    description: "Skincare and beauty must-haves to keep you radiant every day.",
    image: "/images/hero-images/makeup-bg.webp",
    alt: "Beauty Essentials",
  },
  {
    eyebrow: "Game On",
    title: "Sports & Fitness Gear",
    description: "Level up your training with pro-grade equipment and apparel.",
    image: "/images/hero-images/sports-bg.webp",
    alt: "Sports & Fitness Gear",
  },
];

const AUTOPLAY_MS = 6000;

export default function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    timer.current = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, AUTOPLAY_MS);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [index]);

  const goTo = (i: number) => setIndex((i + slides.length) % slides.length);

  return (
    <section className="relative overflow-hidden border-b border-border">
      <div
        className="flex transition-transform duration-700 ease-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {slides.map((s) => (
          <div
            key={s.title}
            className="container grid min-w-full items-center gap-x-10 py-10 lg:grid-cols-2 lg:py-16"
          >
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-primary">
                {s.eyebrow}
              </p>
              <h2 className="mt-3 text-h2-sm sm:text-h2 font-heading">
                {s.title}
              </h2>
              <p className="mt-4 max-w-md text-muted-foreground">
                {s.description}
              </p>
              <Link
                href="/products"
                className="button mt-6 bg-primary px-8 py-3 text-primary-foreground hover:bg-background hover:text-primary"
              >
                Shop Now
              </Link>
            </div>
            <div className="relative mx-auto hidden aspect-[480/510] w-full max-w-[480px] lg:block">
              <Image
                src={s.image}
                alt={s.alt}
                fill
                priority={s.priority}
                sizes="(max-width: 1023px) 0px, 480px"
                className="rounded-xl object-cover"
              />
            </div>
          </div>
        ))}
      </div>

      <button
        aria-label="Previous slide"
        onClick={() => goTo(index - 1)}
        className="absolute left-4 top-1/2 z-10 grid size-11 -translate-y-1/2 place-items-center rounded-md border border-border bg-background text-foreground transition hover:bg-primary hover:text-background"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-5"
        >
          <path d="m15 18-6-6 6-6"></path>
        </svg>
      </button>
      <button
        aria-label="Next slide"
        onClick={() => goTo(index + 1)}
        className="absolute right-4 top-1/2 z-10 grid size-11 -translate-y-1/2 place-items-center rounded-md border border-border bg-background text-foreground transition hover:bg-primary hover:text-background"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-5"
        >
          <path d="m9 18 6-6-6-6"></path>
        </svg>
      </button>

      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-x-2">
        {slides.map((s, i) => (
          <button
            key={s.title}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => goTo(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === index ? "w-6 bg-primary" : "w-1.5 bg-border"
            }`}
          />
        ))}
      </div>
    </section>
  );
}