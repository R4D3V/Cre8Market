import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import CopyButton from "@/components/CopyButton";
import { PLANS, PLAN_BENEFITS, PLAN_SLOGAN } from "@/lib/plans";
import { fetchSubscriptionPlansAction } from "@/lib/actions/subscriptions";

export const metadata: Metadata = {
  title: "Seller Subscriptions | CRE8MARKET Entebbe",
  description:
    "Choose a CRE8MARKET seller subscription — Free, Standard, or Premium. List your products, get a verified badge, and reach more buyers in Entebbe.",
  alternates: { canonical: "/subscription" },
};

const benefits = PLAN_BENEFITS;

export default async function SubscriptionPage() {
  const waUrl = "https://wa.me/256767155113?text=" + encodeURIComponent(
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
    <>
      <Navbar />
      <main className="container py-6 pb-28 sm:pb-8">
        <Link
          href="/"
          className="text-sm text-primary font-semibold hover:underline mb-6 inline-block"
        >
          ← Home
        </Link>

        {/* Hero */}
        <ScrollReveal>
          <div className="neu-dark-card text-white text-center py-12 px-6 mb-8 relative overflow-hidden">
            <Image
              src="/brand/hero.jpeg"
              alt=""
              fill
              priority
              className="absolute inset-0 object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-navy/90 via-navy/80 to-navy/90" />
            <p className="eyebrow text-primary relative z-10">Seller Plans</p>
            <h1 className="text-3xl font-extrabold font-heading relative z-10 mb-3">
              Grow Your Business on CRE8MARKET
            </h1>
            <p className="text-muted-foreground text-base max-w-lg mx-auto relative z-10">
              List your products, reach more buyers in Entebbe, and manage your
              own sales — with a plan that fits your business.
            </p>
          </div>
        </ScrollReveal>

        {/* Pricing cards */}
        <ScrollReveal delay={80}>
          <h2 className="font-heading text-xl font-extrabold text-foreground mb-6 text-center">
            Choose Your Plan
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {plans.map((plan, i) => (
            <ScrollReveal key={plan.name} delay={100 + i * 80}>
              <div
                className={`neu-card p-6 sm:p-8 flex flex-col h-full ${
                  plan.highlight
                    ? "ring-2 ring-primary shadow-lg"
                    : ""
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                  {plan.icon === "user" && (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  )}
                  {plan.icon === "star" && (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118L2.98 10.101c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  )}
                  {plan.icon === "rocket" && (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 7.5h.01" />
                    </svg>
                  )}
                </div>
                {plan.highlight && (
                  <span className="self-start mb-3 text-[10px] font-bold uppercase tracking-wide bg-primary text-primary-foreground px-2.5 py-1 rounded-full">
                    Most Popular
                  </span>
                )}
                <h3 className="font-heading text-xl font-extrabold text-foreground mb-1">
                  {plan.name}
                </h3>
                <p className="text-3xl font-extrabold text-primary mb-0.5">
                  {plan.price}
                </p>
                <p className="text-sm text-muted-foreground mb-5">
                  {plan.period}
                </p>
                <ul className="space-y-2.5 mb-6 flex-1">
                  {plan.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-2 text-sm text-foreground"
                    >
                      <span className="text-primary font-bold mt-0.5">✓</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href={plan.name === "Free" ? "/register" : waUrl}
                  target={plan.name === "Free" ? undefined : "_blank"}
                  rel={plan.name === "Free" ? undefined : "noreferrer"}
                  className={`neu-pill w-full text-center font-bold py-3 text-sm transition-all ${
                    plan.highlight
                      ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                      : "bg-muted text-foreground hover:bg-muted/80"
                  }`}
                >
                  {plan.cta}
                </a>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Payment options */}
        <ScrollReveal delay={110}>
          <div className="neu-card p-6 sm:p-8 mb-6">
            <h2 className="font-heading text-lg font-extrabold text-foreground mb-2 text-center">
              Payment Options
            </h2>
            <p className="text-sm text-muted-foreground text-center mb-6">
              Pay for your subscription using any of the methods below.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* MTN Mobile Money */}
              <div className="neu-inset p-5 flex flex-col items-center text-center gap-3">
                <div className="w-14 h-14 rounded-xl bg-[#ffcc00] flex items-center justify-center shadow-sm">
                  <svg viewBox="0 0 48 48" className="w-9 h-9" aria-hidden="true">
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
                </div>
                <p className="font-bold text-foreground text-sm">MTN Mobile Money</p>
                <p className="text-xs text-muted-foreground">
                  Pay instantly from your MTN MoMo wallet.
                </p>
              </div>

              {/* Airtel Money */}
              <div className="neu-inset p-5 flex flex-col items-center text-center gap-3">
                <div className="w-14 h-14 rounded-xl bg-[#e60000] flex items-center justify-center shadow-sm">
                  <svg viewBox="0 0 48 48" className="w-9 h-9" aria-hidden="true">
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
                </div>
                <p className="font-bold text-foreground text-sm">Airtel Money</p>
                <p className="text-xs text-muted-foreground">
                  Pay instantly from your Airtel Money wallet.
                </p>
              </div>

              {/* Crypto Currency */}
              <div className="neu-inset p-5 flex flex-col items-center text-center gap-3">
                <div className="w-14 h-14 rounded-xl bg-[#f7931a] flex items-center justify-center shadow-sm">
                  <svg viewBox="0 0 48 48" className="w-9 h-9" aria-hidden="true">
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
                </div>
                <p className="font-bold text-foreground text-sm">Crypto Currency</p>
                <p className="text-xs text-muted-foreground">
                  Pay with Bitcoin or other supported crypto.
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* CoinCraft unique payment method */}
        <ScrollReveal delay={115}>
          <div className="neu-card p-6 sm:p-8 mb-6 border-2 border-secondary/40 bg-secondary/5">
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-5">
              <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center shadow-sm shrink-0 overflow-hidden">
                <Image
                  src="/images/coincraft.png"
                  alt="CoinCraft logo"
                  width={64}
                  height={64}
                  className="w-14 h-14 object-contain"
                />
              </div>
              <div className="text-center sm:text-left">
                <div className="flex items-center gap-2 justify-center sm:justify-start mb-1">
                  <h2 className="font-heading text-lg font-extrabold text-foreground">
                    Pay with COINCRAFT
                  </h2>
                  <span className="text-[10px] font-bold uppercase tracking-wide bg-secondary text-secondary-foreground px-2.5 py-1 rounded-full">
                    Unique
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  A unique payment option — pay your subscription using the
                  COINCRAFT ($CC) token and get an exclusive{" "}
                  <span className="font-bold text-secondary">20% discount</span>.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
              <div className="neu-inset p-4">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-1">
                  Coin Name
                </p>
                <p className="text-sm font-semibold text-foreground">
                  COIN CRAFT ($CC)
                </p>
              </div>
              <div className="neu-inset p-4">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-1">
                  Type
                </p>
                <p className="text-sm font-semibold text-foreground">
                  Meme coin · Community owned
                </p>
              </div>
              <div className="neu-inset p-4">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-1">
                  Chain
                </p>
                <p className="text-sm font-semibold text-foreground">Solana</p>
              </div>
              <div className="neu-inset p-4">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-1">
                  Contract
                </p>
                <div className="flex items-start justify-between gap-2">
                  <p className="text-xs font-mono text-foreground break-all">
                    5yyfNYbP1WnkZDyB6UwtAZtbgo48joJgXU9Kai7Dpump
                  </p>
                  <CopyButton text="5yyfNYbP1WnkZDyB6UwtAZtbgo48joJgXU9Kai7Dpump" />
                </div>
              </div>
            </div>

            <p className="text-xs text-muted-foreground mb-4">
              COIN CRAFT is an open-source, community-owned meme coin on Solana
              made for fun and the creator community. It has no intrinsic value
              or expectation of financial return — use it at your own discretion.
              Nothing here is financial advice; always do your own research.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="https://www.coincraft.cc/buy"
                target="_blank"
                rel="noreferrer"
                className="neu-pill inline-flex items-center justify-center gap-2 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold px-6 py-3 text-sm transition-all"
              >
                Buy $CC
              </a>
              <a
                href="https://www.coincraft.cc/"
                target="_blank"
                rel="noreferrer"
                className="neu-pill inline-flex items-center justify-center gap-2 bg-muted text-foreground hover:bg-muted/80 font-bold px-6 py-3 text-sm transition-all"
              >
                Learn more
              </a>
            </div>
          </div>
        </ScrollReveal>

        {/* Why subscribe */}
        <ScrollReveal delay={120}>
          <div className="neu-card p-6 sm:p-8 mb-6">
            <h2 className="font-heading text-lg font-extrabold text-foreground mb-4">
              Why Subscribe?
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {benefits.map((b) => (
                <li
                  key={b}
                  className="flex items-start gap-2 text-sm text-foreground"
                >
                  <span className="text-secondary font-bold mt-0.5">•</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </ScrollReveal>

        {/* Slogan */}
        <ScrollReveal delay={160}>
          <div className="neu-dark-card text-center py-10 px-6 mb-6">
            <p className="font-heading text-xl font-extrabold text-foreground">
              {PLAN_SLOGAN}
            </p>
            <p className="text-muted-foreground text-sm mt-2">
              Ready to start selling? Pick a plan and message us on WhatsApp to get
              set up.
            </p>
            <a
              href={waUrl}
              target="_blank"
              rel="noreferrer"
              className="neu-pill inline-flex items-center gap-2 bg-wa hover:bg-wa-dark text-white font-bold px-6 py-3 text-sm transition-all mt-5"
            >
              Contact Us on WhatsApp
            </a>
          </div>
        </ScrollReveal>
      </main>
      <Footer />
    </>
  );
}
