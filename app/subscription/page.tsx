import {
  BadgeCheck,
  Bitcoin,
  Check,
  CreditCard,
  Rocket,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Star,
  User,
  Wallet,
} from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import CopyButton from "@/components/CopyButton";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import ScrollReveal from "@/components/ScrollReveal";
import { fetchSubscriptionPlansAction } from "@/lib/actions/subscriptions";
import { PLAN_BENEFITS, PLAN_SLOGAN, PLANS } from "@/lib/plans";

export const metadata: Metadata = {
  title: "Seller Subscriptions | CRE8MARKET Entebbe",
  description:
    "Choose a CRE8MARKET seller subscription — Free, Standard, or Premium. List your products, get a verified badge, and reach more buyers in Entebbe.",
  alternates: { canonical: "/subscription" },
};

const benefits = PLAN_BENEFITS;

const PLAN_ICONS = {
  user: User,
  star: Star,
  rocket: Rocket,
};

const PAYMENT_METHODS = [
  {
    name: "MTN Mobile Money",
    description: "Pay instantly from your MTN MoMo wallet.",
    icon: Wallet,
    logo: (
      <svg viewBox="0 0 48 48" className="h-9 w-9" aria-hidden="true">
        <rect width="48" height="48" rx="8" fill="#ffcc00" />
        <text
          x="24"
          y="30"
          textAnchor="middle"
          fontFamily="Arial, sans-serif"
          fontWeight="900"
          fontSize="16"
          fill="#000"
        >
          MTN
        </text>
      </svg>
    ),
  },
  {
    name: "Airtel Money",
    description: "Pay instantly from your Airtel Money wallet.",
    icon: Smartphone,
    logo: (
      <svg viewBox="0 0 48 48" className="h-9 w-9" aria-hidden="true">
        <rect width="48" height="48" rx="8" fill="#e60000" />
        <text
          x="24"
          y="30"
          textAnchor="middle"
          fontFamily="Arial, sans-serif"
          fontWeight="900"
          fontSize="12"
          fill="#fff"
        >
          airtel
        </text>
      </svg>
    ),
  },
  {
    name: "Crypto Currency",
    description: "Pay with Bitcoin or other supported crypto.",
    icon: Bitcoin,
    logo: (
      <svg viewBox="0 0 48 48" className="h-9 w-9" aria-hidden="true">
        <circle cx="24" cy="24" r="22" fill="#f7931a" />
        <text
          x="24"
          y="32"
          textAnchor="middle"
          fontFamily="Arial, sans-serif"
          fontWeight="900"
          fontSize="26"
          fill="#fff"
        >
          ₿
        </text>
      </svg>
    ),
  },
];

export default async function SubscriptionPage() {
  const waUrl =
    "https://wa.me/256767155113?text=" +
    encodeURIComponent(
      "Hi CRE8MARKET ENTEBBE! I'd like to subscribe to a seller plan. Please guide me.",
    );

  let dbPlans: Awaited<ReturnType<typeof fetchSubscriptionPlansAction>> = [];
  try {
    dbPlans = await fetchSubscriptionPlansAction(true);
  } catch {
    dbPlans = [];
  }
  const plans =
    dbPlans.length > 0
      ? dbPlans.map((p) => ({
          name: p.name,
          price: `UGX ${Number(p.price).toLocaleString()}`,
          period: p.period,
          highlight: p.highlight,
          icon: p.icon as "user" | "star" | "rocket",
          features: p.features,
          cta:
            p.name === "Free"
              ? "Start Free"
              : p.name === "Standard"
                ? "Get Standard"
                : "Get Premium",
        }))
      : PLANS;

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <Navbar />

      <PageHero
        backHref="/"
        backLabel="Back to home"
        eyebrow="Seller plans"
        eyebrowIcon={Sparkles}
        align="center"
        size="large"
        title={
          <>
            Grow your business{" "}
            <span className="mt-1 block bg-gradient-to-r from-primary via-emerald-300 to-teal-200 bg-clip-text text-transparent">
              on CRE8MARKET.
            </span>
          </>
        }
        description="List your products, reach more buyers in Entebbe, and manage your own sales — with a plan that fits your business."
      >
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-primary" />
            No commission on sales
          </span>
          <span className="inline-flex items-center gap-2">
            <BadgeCheck className="h-4 w-4 text-primary" />
            Verified seller badge
          </span>
          <span className="inline-flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-primary" />
            Flexible payment options
          </span>
        </div>
      </PageHero>

      <main className="page-ambient container py-12 pb-28 sm:py-16 sm:pb-16">
        {/* Pricing */}
        <ScrollReveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-primary/80">
              Simple pricing
            </p>
            <h2 className="mt-3 font-heading text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Choose your plan.
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Start free, then upgrade as your listings grow.
            </p>
          </div>
        </ScrollReveal>

        <div className="mt-9 grid grid-cols-1 gap-5 md:grid-cols-3">
          {plans.map((plan, i) => {
            const Icon = PLAN_ICONS[plan.icon];
            return (
              <ScrollReveal key={plan.name} delay={100 + i * 80} className="h-full">
                <div
                  className={`relative flex h-full flex-col overflow-hidden rounded-3xl border p-6 backdrop-blur-sm sm:p-8 ${
                    plan.highlight
                      ? "border-primary/40 bg-gradient-to-b from-primary/12 via-card/80 to-card/80 shadow-[0_35px_80px_-45px_rgba(109,232,124,0.55)]"
                      : "border-border/70 bg-card/80"
                  }`}
                >
                  {plan.highlight && (
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-primary/15 blur-[80px]"
                    />
                  )}

                  <div className="relative">
                    <div className="flex items-start justify-between gap-3">
                      <span
                        className={`grid h-12 w-12 place-items-center rounded-xl border ${
                          plan.highlight
                            ? "border-primary/30 bg-primary/15 text-primary"
                            : "border-primary/20 bg-primary/10 text-primary"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                      </span>
                      {plan.highlight && (
                        <span className="rounded-full bg-primary px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-primary-foreground">
                          Most popular
                        </span>
                      )}
                    </div>

                    <h3 className="mt-5 font-heading text-xl font-extrabold tracking-tight text-foreground">
                      {plan.name}
                    </h3>
                    <p className="mt-2 bg-gradient-to-r from-primary to-emerald-300 bg-clip-text font-heading text-3xl font-extrabold tracking-tight text-transparent">
                      {plan.price}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">{plan.period}</p>

                    <div className="my-5 h-px bg-border/60" />

                    <ul className="flex-1 space-y-3">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-start gap-2.5 text-sm text-foreground">
                          <span className="mt-0.5 grid h-4.5 w-4.5 shrink-0 place-items-center rounded-full bg-primary/15 text-primary">
                            <Check className="h-3 w-3" />
                          </span>
                          <span className="leading-relaxed">{f}</span>
                        </li>
                      ))}
                    </ul>

                    <a
                      href={plan.name === "Free" ? "/register" : waUrl}
                      target={plan.name === "Free" ? undefined : "_blank"}
                      rel={plan.name === "Free" ? undefined : "noreferrer"}
                      className={`mt-7 block w-full rounded-full py-3 text-center text-sm font-bold transition ${
                        plan.highlight
                          ? "bg-primary text-primary-foreground hover:bg-primary/90"
                          : "border border-border/70 bg-muted/40 text-foreground hover:border-primary/40 hover:text-primary"
                      }`}
                    >
                      {plan.cta}
                    </a>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        {/* Payment options */}
        <ScrollReveal delay={110}>
          <div className="mt-14">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-primary/80">
                Easy payments
              </p>
              <h2 className="mt-3 font-heading text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                Payment options.
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Pay for your subscription using any of the methods below.
              </p>
            </div>

            <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {PAYMENT_METHODS.map(({ name, description, icon: Icon, logo }) => (
                <div
                  key={name}
                  className="group flex flex-col items-center rounded-3xl border border-border/70 bg-card/80 p-5 text-center backdrop-blur-sm transition hover:-translate-y-1 hover:border-primary/40"
                >
                  <div className="overflow-hidden rounded-2xl shadow-sm">{logo}</div>
                  <p className="mt-4 text-sm font-bold text-foreground">{name}</p>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                    {description}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-muted/30 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                    <Icon className="h-3 w-3" />
                    Supported
                  </span>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* CoinCraft */}
        <ScrollReveal delay={120}>
          <div className="relative mt-6 overflow-hidden rounded-3xl border border-secondary/35 bg-secondary/5 p-6 sm:p-8">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-20 -top-24 h-56 w-56 rounded-full bg-secondary/15 blur-[90px]"
            />
            <div className="relative">
              <div className="flex flex-col items-center gap-4 sm:flex-row">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white shadow-sm">
                  <Image
                    src="/images/coincraft.png"
                    alt="CoinCraft logo"
                    width={64}
                    height={64}
                    className="h-14 w-14 object-contain"
                  />
                </div>
                <div className="text-center sm:text-left">
                  <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                    <h2 className="font-heading text-lg font-extrabold tracking-tight text-foreground">
                      Pay with COINCRAFT
                    </h2>
                    <span className="rounded-full bg-secondary px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-secondary-foreground">
                      Unique
                    </span>
                  </div>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    A unique payment option — pay your subscription using the COINCRAFT ($CC) token
                    and get an exclusive{" "}
                    <span className="font-bold text-secondary">20% discount</span>.
                  </p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-border/60 bg-card/60 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                    Coin name
                  </p>
                  <p className="mt-1 text-sm font-semibold text-foreground">COIN CRAFT ($CC)</p>
                </div>
                <div className="rounded-2xl border border-border/60 bg-card/60 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                    Type
                  </p>
                  <p className="mt-1 text-sm font-semibold text-foreground">
                    Meme coin · Community owned
                  </p>
                </div>
                <div className="rounded-2xl border border-border/60 bg-card/60 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                    Chain
                  </p>
                  <p className="mt-1 text-sm font-semibold text-foreground">Solana</p>
                </div>
                <div className="rounded-2xl border border-border/60 bg-card/60 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                    Contract
                  </p>
                  <div className="mt-1 flex items-start justify-between gap-2">
                    <p className="break-all font-mono text-xs text-foreground">
                      5yyfNYbP1WnkZDyB6UwtAZtbgo48joJgXU9Kai7Dpump
                    </p>
                    <CopyButton text="5yyfNYbP1WnkZDyB6UwtAZtbgo48joJgXU9Kai7Dpump" />
                  </div>
                </div>
              </div>

              <p className="mt-5 text-xs leading-relaxed text-muted-foreground">
                COIN CRAFT is an open-source, community-owned meme coin on Solana made for fun and
                the creator community. It has no intrinsic value or expectation of financial return
                — use it at your own discretion. Nothing here is financial advice; always do your
                own research.
              </p>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <a
                  href="https://www.coincraft.cc/buy"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-secondary px-6 py-3 text-sm font-bold text-secondary-foreground transition hover:bg-secondary/90"
                >
                  <Bitcoin className="h-4 w-4" />
                  Buy $CC
                </a>
                <a
                  href="https://www.coincraft.cc/"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Learn more about CoinCraft"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-border/70 bg-card/60 px-6 py-3 text-sm font-semibold text-foreground transition hover:border-secondary/50 hover:text-secondary"
                >
                  Learn more
                </a>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Why subscribe */}
        <ScrollReveal delay={130}>
          <div className="mt-6 rounded-3xl border border-border/70 bg-card/80 p-6 backdrop-blur-sm sm:p-8">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
                <BadgeCheck className="h-5 w-5" />
              </span>
              <h2 className="font-heading text-xl font-extrabold tracking-tight text-foreground">
                Why subscribe?
              </h2>
            </div>
            <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {benefits.map((b) => (
                <li
                  key={b}
                  className="flex items-start gap-2.5 rounded-2xl border border-border/60 bg-muted/20 p-3.5 text-sm text-foreground"
                >
                  <span className="mt-0.5 grid h-4.5 w-4.5 shrink-0 place-items-center rounded-full bg-primary/15 text-primary">
                    <Check className="h-3 w-3" />
                  </span>
                  <span className="leading-relaxed">{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </ScrollReveal>

        {/* Slogan CTA */}
        <ScrollReveal delay={160}>
          <div className="relative mt-6 overflow-hidden rounded-[2rem] border border-primary/20 bg-[#04202b] p-8 text-center sm:rounded-[2.5rem] sm:p-12">
            <div aria-hidden="true" className="pointer-events-none absolute inset-0">
              <div className="absolute -right-24 -top-28 h-72 w-72 rounded-full bg-primary/20 blur-[110px]" />
              <div className="absolute -bottom-28 left-1/4 h-64 w-64 rounded-full bg-secondary/20 blur-[120px]" />
            </div>
            <div className="relative">
              <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl border border-primary/25 bg-primary/10 text-primary">
                <Sparkles className="h-5 w-5" />
              </span>
              <p className="mx-auto mt-5 max-w-xl font-heading text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                {PLAN_SLOGAN}
              </p>
              <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-white/60">
                Ready to start selling? Pick a plan and message us on WhatsApp to get set up.
              </p>
              <a
                href={waUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-wa px-6 py-3 text-sm font-bold text-white transition hover:bg-wa-dark"
              >
                <Wallet className="h-4 w-4" />
                Contact Us on WhatsApp
              </a>
            </div>
          </div>
        </ScrollReveal>
      </main>

      <Footer />
    </div>
  );
}
