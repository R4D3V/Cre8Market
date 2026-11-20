"use client";

import { ArrowRight, Flame } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/lib/types";

interface Countdown {
  hours: string;
  minutes: string;
  seconds: string;
}

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function useMidnightCountdown(): Countdown | null {
  const [left, setLeft] = useState<Countdown | null>(null);

  useEffect(() => {
    function tick() {
      const now = new Date();
      const end = new Date(now);
      end.setHours(24, 0, 0, 0);
      const diff = Math.max(0, end.getTime() - now.getTime());
      const hours = Math.floor(diff / 3_600_000);
      const minutes = Math.floor((diff % 3_600_000) / 60_000);
      const seconds = Math.floor((diff % 60_000) / 1_000);
      setLeft({ hours: pad(hours), minutes: pad(minutes), seconds: pad(seconds) });
    }

    tick();
    const timer = setInterval(tick, 1_000);
    return () => clearInterval(timer);
  }, []);

  return left;
}

interface Props {
  products: Product[];
}

export default function FlashDeals({ products }: Props) {
  const countdown = useMidnightCountdown();

  if (products.length === 0) return null;

  const parts = countdown
    ? [countdown.hours, countdown.minutes, countdown.seconds]
    : ["--", "--", "--"];

  return (
    <section className="container pt-6 sm:pt-8">
      <div className="overflow-hidden rounded-3xl border border-featured/25 bg-gradient-to-br from-[#2a0d13] via-card to-card">
        <div className="flex flex-col gap-3 border-b border-white/5 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-2xl bg-featured/15 text-featured">
              <Flame className="size-5" />
            </span>
            <div>
              <h2 className="font-heading text-lg font-extrabold tracking-tight text-foreground sm:text-xl">
                Flash deals
              </h2>
              <p className="text-[11px] text-muted-foreground sm:text-xs">
                Limited stock from verified sellers — ends at midnight
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-semibold text-muted-foreground">Ends in</span>
              {parts.map((part, index) => (
                <span
                  key={`count-${index}`}
                  className="rounded-lg bg-black/35 px-2 py-1 font-mono text-xs font-bold tabular-nums text-foreground ring-1 ring-white/5"
                >
                  {part}
                </span>
              ))}
            </div>
            <Link
              href="/deals"
              className="inline-flex items-center gap-1.5 rounded-full bg-featured/15 px-3.5 py-2 text-[11px] font-bold text-featured transition hover:bg-featured/25"
            >
              See all deals
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>

        <div className="flex snap-x gap-3 overflow-x-auto p-4 no-scrollbar sm:gap-4 sm:p-5">
          {products.map((product) => (
            <div
              key={`flash-${product.id}`}
              className="w-[45%] shrink-0 snap-start sm:w-[30%] md:w-[23%] lg:w-[18.6%]"
            >
              <ProductCard
                product={product}
                size="small"
                source={product.isDeal ? "deals" : "default"}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
