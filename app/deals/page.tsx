import { BellRing, Flame } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
// import CategoryBar from "@/components/CategoryBar";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import ProductCard from "@/components/ProductCard";
import ScrollReveal from "@/components/ScrollReveal";
import { getDeals } from "@/lib/db/queries";
import type { Product } from "@/lib/types";

export const metadata: Metadata = {
  title: "Daily Deals & Discounts in Entebbe",
  description:
    "Browse today’s best deals on phones, laptops, electronics, and household items in Entebbe.",
  alternates: {
    canonical: "/deals",
  },
};

export const revalidate = 60;

function DealCardSkeleton() {
  return (
    <div className="neu-card overflow-hidden flex flex-col">
      <div className="relative aspect-[4/3] rounded-t-3xl bg-muted animate-pulse" />
      <div className="p-3.5 flex flex-col gap-2 flex-1">
        <div className="h-2.5 w-16 rounded-full bg-muted animate-pulse" />
        <div className="h-3 w-3/4 rounded-full bg-muted animate-pulse" />
        <div className="h-3 w-1/2 rounded-full bg-muted animate-pulse" />
        <div className="flex items-center justify-between mt-auto pt-2">
          <div className="h-3.5 w-20 rounded-full bg-muted animate-pulse" />
          <div className="h-2.5 w-12 rounded-full bg-muted animate-pulse" />
        </div>
      </div>
      <div className="px-3.5 pb-3.5">
        <div className="h-3 w-24 rounded-full bg-muted animate-pulse" />
      </div>
    </div>
  );
}

function DealsSkeleton() {
  return (
    <div className="container py-8 pb-28 sm:pb-8" aria-busy="true">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
        {Array.from({ length: 10 }).map((_, i) => (
          <DealCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

async function DealsContent() {
  let deals: Product[] = [];
  try {
    deals = await getDeals();
  } catch (err) {
    console.error("DB unavailable on deals page load, using empty list:", (err as Error).message);
  }

  return (
    <main className="page-ambient container py-8 pb-28 sm:pb-8">
      <ScrollReveal>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-primary/80">
              Live now
            </p>
            <h2 className="mt-3 font-heading text-3xl font-extrabold tracking-tight text-foreground">
              Today&apos;s Deals
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">{deals.length} deals available</p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-featured/25 bg-featured/10 px-3 py-1.5 text-xs font-bold text-featured">
            <span className="h-2 w-2 animate-pulse rounded-full bg-featured" />
            Live · Updates daily
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={100}>
        {deals.length === 0 ? (
          <div className="rounded-3xl border border-border/70 bg-card/80 py-12 text-center">
            <span className="mx-auto mb-3 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
              <Flame className="h-6 w-6" />
            </span>
            <h3 className="mb-1 font-bold text-foreground">No active deals right now</h3>
            <p className="text-sm text-muted-foreground">
              Check back soon or browse everything on the marketplace.
            </p>
            <Link
              href="/products"
              className="mt-4 inline-flex rounded-full bg-primary px-5 py-2 text-sm font-bold text-primary-foreground transition hover:bg-primary/90"
            >
              Browse products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
            {deals.map((p) => (
              <ProductCard key={`${p.id}-${p.slug}`} product={p} source="deals" />
            ))}
          </div>
        )}
      </ScrollReveal>

      {/* WhatsApp CTA */}
      <ScrollReveal delay={200}>
        <div className="mt-10 rounded-3xl border border-border/70 bg-card/80 p-7 text-center backdrop-blur-sm">
          <span className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
            <BellRing className="h-6 w-6" />
          </span>
          <h3 className="font-heading text-lg font-extrabold text-foreground mb-1">
            Never miss a deal
          </h3>
          <p className="text-muted-foreground text-sm mb-5">
            Get instant alerts for deals matching your interests
          </p>
          <a
            href="https://wa.me/256767155113?text=Hi+I+want+to+subscribe+for+deal+alerts"
            target="_blank"
            rel="noreferrer"
            className="neu-pill inline-flex items-center gap-2 bg-wa hover:bg-wa-dark text-white font-bold px-6 py-3 transition-all"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Get Deals on WhatsApp
          </a>
        </div>
      </ScrollReveal>
    </main>
  );
}

export default function DealsPage() {
  return (
    <>
      <Navbar />
      {/* <CategoryBar /> */}

      <PageHero
        eyebrow="Updated daily"
        title={
          <span className="inline-flex items-center gap-3">
            <Flame className="h-8 w-8 text-featured" />
            Hot Deals
          </span>
        }
        description="The best prices on electronics, phones, laptops and more in Uganda — refreshed every day."
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-featured/25 bg-featured/10 px-3 py-1.5 text-xs font-bold text-featured">
          <span className="h-2 w-2 animate-pulse rounded-full bg-featured" />
          Live · Updates daily
        </div>
      </PageHero>

      <Suspense fallback={<DealsSkeleton />}>
        <DealsContent />
      </Suspense>

      <Footer />
    </>
  );
}
