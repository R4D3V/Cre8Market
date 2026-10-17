"use client";

import { useEffect, useState } from "react";

const categories = [
  { label: "Phones", emoji: "📱" },
  { label: "Laptops", emoji: "💻" },
  { label: "TVs & Audio", emoji: "📺" },
  { label: "Appliances", emoji: "🧺" },
  { label: "Vehicles", emoji: "🚗" },
  { label: "Property", emoji: "🏠" },
];

const rotatingWords = ["simple", "easy", "swift"];

export default function Hero() {
  const [displayedWord, setDisplayedWord] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const targetWord = rotatingWords[wordIndex];

    if (!isDeleting && displayedWord === targetWord) {
      const pause = setTimeout(() => setIsDeleting(true), 4000);
      return () => clearTimeout(pause);
    }

    const speed = 300;
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        const nextValue = targetWord.slice(0.1, displayedWord.length + 1);
        setDisplayedWord(nextValue);

        if (nextValue === targetWord) {
          setIsDeleting(true);
        }
        return;
      }

      const nextValue = targetWord.slice(
        0,
        Math.max(0, displayedWord.length - 1),
      );
      setDisplayedWord(nextValue);

        if (nextValue.length === 0) {
          const nextPause = setTimeout(() => {
            setIsDeleting(false);
            setWordIndex((prev) => (prev + 1) % rotatingWords.length);
          }, 4000);
          return;
        }
    }, speed);

    return () => clearTimeout(timeout);
  }, [displayedWord, isDeleting, wordIndex]);
  return (
    <section className="relative isolate overflow-hidden bg-[#101b33] text-white font-body">
      {/* Diagonal corrugated-panel backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "repeating-linear-gradient(115deg, rgba(255,255,255,0.06) 0px, rgba(255,255,255,0.06) 2px, transparent 2px, transparent 10px)",
        }}
      />
      {/* Soft top-right light wash */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 h-[28rem] w-[28rem] rounded-full bg-slate-400/10 blur-3xl"
      />
      {/* Faint oversized watermark wordmark */}
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-12 left-1/2 hidden -translate-x-1/2 select-none text-[8rem] font-extrabold leading-none text-white/5 sm:block sm:text-[11rem] lg:text-[13rem]"
      >
        Cre8 Market
      </span>

      <div className="relative mx-auto w-full max-w-7xl px-4 pb-16 pt-12 sm:px-6 sm:pb-20 sm:pt-16 lg:px-8">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          {/* Logo */}
          <div className="mb-8 flex items-center gap-3 rounded-lg bg-[#101b33] px-4 py-3 shadow-lg ring-1 ring-white/10 sm:mb-10 sm:px-5">
            <svg
              aria-hidden
              viewBox="0 0 24 24"
              className="h-6 w-6 shrink-0 fill-[#7ddc6f]"
            >
              <path d="M3 21V9l5-4 5 4v12H3zm7-12.5L6 11v8h4v-4h4v4h4v-8l-4-2.5V5l-4-2v5.5zM17 21v-6l4 2v4h-4z" />
            </svg>
            <div className="text-left leading-none">
              <p className="font-heading text-lg font-bold tracking-tight text-white sm:text-xl">
                Cre8 Market<span className="align-top text-[10px]">®</span>
              </p>
              <p className="mt-1 text-[10px] tracking-[0.18em] text-slate-300 uppercase">
                Inspire. Innovate. Shop.
              </p>
            </div>
          </div>

          {/* Eyebrow */}
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#7ddc6f] sm:text-sm">
            Buy &middot; Sell &middot; Discover &middot; Entebbe, Uganda
          </p>

          {/* Headline */}
          <h1 className="font-heading text-[clamp(2.75rem,7vw,5.5rem)] font-extrabold leading-[0.96] tracking-[-0.06em] text-white">
            Business made
            <br />
            <span className="inline-block min-w-[5ch] text-[#7ddc6f]">
              {displayedWord}
              <span className="ml-[2px] inline-block animate-pulse align-middle text-[#7ddc6f]">
                |
              </span>
            </span>
            <br />
            <span className="text-[#7ddc6f]">No thirdparty.</span>
          </h1>

          {/* Supporting copy */}
          <p className="mx-auto mt-6 max-w-2xl text-base text-slate-300 sm:text-lg">
            Direct to seller, no middleman. As a local marketplace, we connect
            buyers and sellers in Entebbe, Uganda. Listed items reach thousands
            of potential buyers instantly.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 sm:gap-x-8">
            <a
              href="/about"
              className="rounded-full bg-[#7ddc6f] px-6 py-3 text-sm font-bold text-[#101b33] transition hover:bg-[#8fe583] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7ddc6f] focus-visible:ring-offset-2 focus-visible:ring-offset-[#101b33] sm:px-8 sm:text-base"
            >
              About Us
            </a>
            <a
              href="/products"
              className="text-sm font-bold text-white underline-offset-4 transition hover:underline sm:text-base"
            >
              Browse Listings
            </a>
          </div>

          {/* Category chips */}
          <ul className="mt-12 grid w-full max-w-3xl grid-cols-2 gap-x-6 gap-y-4 text-left sm:grid-cols-3 sm:gap-x-8 sm:gap-y-5">
            {categories.map((c) => (
              <li
                key={c.label}
                className="flex items-center gap-2 text-sm font-medium text-white/90 sm:text-base"
              >
                <span aria-hidden className="text-base sm:text-lg">
                  {c.emoji}
                </span>
                {c.label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
