import { ArrowRight, Search, ShieldCheck, Star, TrendingUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const quickLinks = [
  { label: "Phones", href: "/products?category=phones-tablets" },
  { label: "Laptops", href: "/products?q=laptops" },
  { label: "Gaming", href: "/products?q=gaming" },
  { label: "Today's deals", href: "/deals" },
];

const avatars = [
  { initials: "AK", className: "from-emerald-400 to-teal-600" },
  { initials: "NM", className: "from-violet-400 to-indigo-600" },
  { initials: "SJ", className: "from-amber-300 to-orange-500" },
  { initials: "TB", className: "from-sky-400 to-blue-600" },
];

export default function HomeHero() {
  return (
    <section className="relative overflow-hidden">
      {/* Ambient background */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <Image
          src="/brand/hero.jpeg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[68%_35%] opacity-[0.15] sm:opacity-[0.22] lg:opacity-[0.28]"
          style={{
            maskImage: "radial-gradient(ellipse 90% 80% at 72% 18%, black 30%, transparent 82%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 90% 80% at 72% 18%, black 30%, transparent 82%)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

        <div className="absolute -top-48 right-[-10%] h-[560px] w-[560px] rounded-full bg-primary/15 blur-[130px]" />
        <div className="absolute -left-40 top-32 h-[420px] w-[420px] rounded-full bg-secondary/20 blur-[120px]" />
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.045) 1px, transparent 1px)",
            backgroundSize: "58px 58px",
            maskImage: "radial-gradient(ellipse 80% 65% at 50% 0%, black 35%, transparent 100%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 80% 65% at 50% 0%, black 35%, transparent 100%)",
          }}
        />
      </div>

      <div className="container relative py-12 sm:py-16 lg:py-24">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 xl:gap-16">
          {/* Copy */}
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2.5 rounded-full border border-primary/25 bg-primary/10 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-primary sm:text-[11px]">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-70" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
              </span>
              Entebbe&apos;s curated marketplace
            </span>

            <h1 className="mt-6 font-heading text-[2.75rem] font-extrabold leading-[1.02] tracking-[-0.04em] text-foreground sm:text-6xl lg:text-[4.25rem]">
              Find something{" "}
              <span className="mt-1 block bg-gradient-to-r from-primary via-emerald-300 to-teal-200 bg-clip-text text-transparent">
                worth keeping.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-[0.95rem] leading-relaxed text-muted-foreground sm:text-base">
              Hand-picked tech, verified local sellers, and honest prices — all in one beautifully
              simple place. Shop Entebbe&apos;s best finds without the guesswork.
            </p>

            {/* Search */}
            <form
              action="/products"
              method="get"
              className="mt-8 flex items-center gap-2 rounded-2xl border border-border/80 bg-card/80 p-2 shadow-[0_24px_70px_-28px_rgba(0,0,0,0.9)] backdrop-blur-xl transition focus-within:border-primary/60"
            >
              <Search className="ml-2.5 h-5 w-5 shrink-0 text-muted-foreground" />
              <label htmlFor="home-search" className="sr-only">
                Search products
              </label>
              <input
                id="home-search"
                type="search"
                name="q"
                placeholder="What are you looking for?"
                autoComplete="off"
                className="min-w-0 flex-1 bg-transparent py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
              <button
                type="submit"
                className="button shrink-0 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground transition hover:bg-accent sm:px-6"
              >
                Search
              </button>
            </form>

            {/* Quick links */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground/70">
                Popular
              </span>
              {quickLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="rounded-full border border-border/60 bg-card/40 px-3 py-1.5 text-[11px] font-semibold text-muted-foreground transition hover:border-primary/40 hover:text-primary"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Social proof */}
            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
              <div className="flex -space-x-2.5">
                {avatars.map((avatar) => (
                  <span
                    key={avatar.initials}
                    className={`grid h-9 w-9 place-items-center rounded-full border-2 border-background bg-gradient-to-br ${avatar.className} text-[10px] font-bold text-white`}
                  >
                    {avatar.initials}
                  </span>
                ))}
                <span className="grid h-9 w-9 place-items-center rounded-full border-2 border-background bg-muted text-[10px] font-bold text-foreground">
                  +2k
                </span>
              </div>
              <div>
                <div className="flex items-center gap-1 text-amber-300">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-current" />
                  ))}
                  <span className="ml-1 text-xs font-bold text-foreground">4.9</span>
                </div>
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  Loved by 2,400+ shoppers &amp; sellers
                </p>
              </div>
            </div>
          </div>

          {/* Visual */}
          <div className="relative mx-auto w-full max-w-[500px] lg:max-w-none">
            <div
              aria-hidden="true"
              className="absolute -inset-8 rounded-full bg-primary/20 blur-[90px]"
            />

            <div className="relative grid grid-cols-5 gap-3 sm:gap-4">
              {/* Main card */}
              <div className="relative col-span-3 aspect-[3/4.25] overflow-hidden rounded-[1.75rem] border border-white/10 bg-card shadow-[0_40px_90px_-40px_rgba(0,0,0,0.9)] sm:rounded-[2rem]">
                <Image
                  src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80"
                  alt="Smartphone held in hand"
                  fill
                  priority
                  sizes="(max-width: 1024px) 45vw, 300px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#021321] via-[#021321]/25 to-transparent" />

                <span className="absolute left-3.5 top-3.5 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/35 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.16em] text-white backdrop-blur sm:left-4 sm:top-4 sm:text-[10px]">
                  <TrendingUp className="h-3 w-3 text-primary" />
                  Trending now
                </span>

                <div className="absolute inset-x-3.5 bottom-4 sm:inset-x-4">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/55 sm:text-[10px]">
                    Editor&apos;s pick
                  </p>
                  <p className="mt-1 font-heading text-base font-bold text-white sm:text-lg">
                    iPhone 15 Pro
                  </p>
                  <div className="mt-2.5 flex items-center justify-between gap-2">
                    <span className="font-heading text-lg font-extrabold text-primary sm:text-xl">
                      UGX 4.2M
                    </span>
                    <Link
                      href="/products?q=iphone"
                      aria-label="Shop iPhone"
                      className="grid h-8 w-8 place-items-center rounded-full bg-white text-background transition hover:bg-primary sm:h-9 sm:w-9"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Side cards */}
              <div className="col-span-2 flex flex-col gap-3 sm:gap-4">
                <div className="group relative flex-1 overflow-hidden rounded-[1.4rem] border border-white/10 bg-card sm:rounded-[1.75rem]">
                  <Image
                    src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=80"
                    alt="Premium over-ear headphones"
                    fill
                    sizes="(max-width: 1024px) 25vw, 170px"
                    className="object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#021321] via-transparent to-transparent" />
                  <div className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-1">
                    <span className="text-[11px] font-bold text-white">Audio</span>
                    <span className="rounded-full border border-white/15 bg-white/10 px-2 py-0.5 text-[9px] font-semibold text-white/75 backdrop-blur">
                      24 items
                    </span>
                  </div>
                </div>

                <div className="group relative flex-1 overflow-hidden rounded-[1.4rem] border border-white/10 bg-card sm:rounded-[1.75rem]">
                  <Image
                    src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=700&q=80"
                    alt="Minimal wristwatch"
                    fill
                    sizes="(max-width: 1024px) 25vw, 170px"
                    className="object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#021321] via-transparent to-transparent" />
                  <div className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-1">
                    <span className="text-[11px] font-bold text-white">Wearables</span>
                    <span className="rounded-full border border-white/15 bg-white/10 px-2 py-0.5 text-[9px] font-semibold text-white/75 backdrop-blur">
                      18 items
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating proof cards */}
            <div className="animate-float absolute -left-4 top-[38%] hidden items-center gap-2.5 rounded-2xl border border-white/10 bg-[#062537]/90 px-3.5 py-2.5 shadow-2xl backdrop-blur-xl sm:flex lg:-left-7">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary/15 text-primary">
                <ShieldCheck className="h-4.5 w-4.5" />
              </span>
              <div>
                <p className="text-xs font-bold text-white">Verified sellers</p>
                <p className="text-[10px] text-white/55">120+ checked this month</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
