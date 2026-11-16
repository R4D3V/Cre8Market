import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  BadgeCheck,
  Banknote,
  CheckCircle2,
  Flame,
  Handshake,
  Mail,
  Megaphone,
  MessageCircle,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Store,
  Target,
  Users,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import ScrollReveal from "@/components/ScrollReveal";

export const metadata: Metadata = {
  title: "About CRE8MARKET Entebbe | Trusted Local Marketplace",
  description:
    "Learn about CRE8MARKET Entebbe, a trusted local marketplace connecting buyers and sellers directly across Uganda.",
  alternates: {
    canonical: "/about",
  },
};

const SERVICES = [
  {
    icon: ShoppingBag,
    title: "Marketplace",
    description:
      "List and browse items for sale across dozens of categories. Direct seller contact, no commissions.",
  },
  {
    icon: Banknote,
    title: "Sell to Us",
    description:
      "Have something valuable? Send us your item details and get a cash offer via WhatsApp within 24 hours.",
  },
  {
    icon: Flame,
    title: "Daily Deals",
    description:
      "We curate the best deals on electronics, phones, laptops, and more — updated daily.",
  },
  {
    icon: Megaphone,
    title: "Wanted Board",
    description:
      "Looking for something specific? Post what you need and sellers will reach out to you.",
  },
];

const STATS = [
  { value: "200+", label: "Live listings" },
  { value: "50+", label: "Trusted sellers" },
  { value: "24hrs", label: "Offer response" },
  { value: "100%", label: "Direct contact" },
];

const REASONS = [
  {
    title: "No middleman",
    description:
      "Contact the seller directly. No commissions, no platform fees, no bureaucracy.",
  },
  {
    title: "Local & trusted",
    description:
      "Based in Kitoro, Entebbe. We verify sellers and keep the marketplace safe for everyone.",
  },
  {
    title: "Fast cash offers",
    description:
      "Selling to us? Get a WhatsApp cash offer within 24 hours and instant payment on acceptance.",
  },
  {
    title: "WhatsApp integrated",
    description:
      "All communication happens on WhatsApp — Uganda's favourite messaging platform. Fast and familiar.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <Navbar />

      <PageHero
        eyebrow="Our story"
        eyebrowIcon={Sparkles}
        size="large"
        title={
          <>
            Entebbe&apos;s trusted marketplace,{" "}
            <span className="mt-1 block bg-gradient-to-r from-primary via-emerald-300 to-teal-200 bg-clip-text text-transparent">
              built for real people.
            </span>
          </>
        }
        description="CRE8MARKET ENTEBBE is a Ugandan-owned marketplace that connects local buyers and sellers directly — no middleman, no hidden fees. From phones and laptops to furniture and vehicles, we make it easy to find a great deal or sell something fast."
        aside={
          <div className="relative h-[300px] overflow-hidden rounded-[2rem] border border-border/60 sm:h-[400px]">
            <Image
              src="/brand/hero.jpeg"
              alt="CRE8MARKET Entebbe marketplace"
              fill
              priority
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#021321]/90 via-[#021321]/20 to-transparent" />

            <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/35 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-white backdrop-blur-md">
              <BadgeCheck className="h-3 w-3 text-primary" />
              Ugandan-owned
            </span>

            <div className="absolute inset-x-4 bottom-4 flex items-center gap-3 rounded-2xl border border-white/10 bg-black/35 p-3.5 backdrop-blur-md">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-primary/25 bg-primary/15 text-primary">
                <Store className="h-4.5 w-4.5" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-bold text-white">Kitoro, Entebbe</p>
                <p className="text-xs text-white/60">
                  Serving buyers and sellers across Uganda
                </p>
              </div>
            </div>
          </div>
        }
      >
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/products"
            className="group inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition hover:bg-primary/90"
          >
            Browse listings
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/selltous"
            className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/60 px-5 py-3 text-sm font-semibold text-foreground transition hover:border-primary/40 hover:text-primary"
          >
            Sell to us
          </Link>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-primary" />
            Verified sellers
          </span>
          <span className="inline-flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            50+ local sellers
          </span>
          <span className="inline-flex items-center gap-2">
            <Store className="h-4 w-4 text-primary" />
            Kitoro, Entebbe
          </span>
        </div>
      </PageHero>

      <main className="page-ambient container py-12 pb-28 sm:py-16 sm:pb-16">
        {/* Who we are + mission */}
        <div className="grid gap-5 lg:grid-cols-2">
          <ScrollReveal>
            <div className="relative h-full overflow-hidden rounded-3xl border border-border/70 bg-card/80 p-6 backdrop-blur-sm sm:p-8">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-16 -top-20 h-44 w-44 rounded-full bg-primary/10 blur-[80px]"
              />
              <div className="relative">
                <span className="grid h-11 w-11 place-items-center rounded-xl border border-primary/25 bg-primary/10 text-primary">
                  <Store className="h-5 w-5" />
                </span>
                <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.2em] text-primary/80">
                  Who we are
                </p>
                <h2 className="mt-2 font-heading text-2xl font-extrabold tracking-tight text-foreground">
                  Local roots, modern marketplace.
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  CRE8MARKET ENTEBBE is a Ugandan-owned and operated marketplace
                  based in Entebbe. We connect local buyers and sellers directly
                  — no middleman, no hidden fees. From phones and laptops to
                  furniture and vehicles, our platform makes it easy to find
                  great deals or sell your items fast.
                </p>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={80}>
            <div className="relative h-full overflow-hidden rounded-3xl border border-border/70 bg-card/80 p-6 backdrop-blur-sm sm:p-8">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -left-16 -top-20 h-44 w-44 rounded-full bg-secondary/12 blur-[80px]"
              />
              <div className="relative">
                <span className="grid h-11 w-11 place-items-center rounded-xl border border-secondary/25 bg-secondary/10 text-secondary">
                  <Target className="h-5 w-5" />
                </span>
                <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.2em] text-secondary/90">
                  Our mission
                </p>
                <h2 className="mt-2 font-heading text-2xl font-extrabold tracking-tight text-foreground">
                  Make trading simple for everyone.
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  To make buying and selling in Uganda simple, direct, and
                  accessible to everyone. We believe marketplace transactions
                  should happen without unnecessary middlemen, hidden fees, or
                  complicated processes.
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  By leveraging WhatsApp — Uganda&apos;s most widely used
                  messaging platform — we remove barriers and let buyers and
                  sellers connect instantly.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* What we do */}
        <ScrollReveal>
          <div className="mt-14">
            <div className="max-w-2xl">
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-primary/80">
                What we do
              </p>
              <h2 className="mt-3 font-heading text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                Four ways to move things forward.
              </h2>
            </div>

            <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {SERVICES.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="group relative overflow-hidden rounded-2xl border border-border/70 bg-card/70 p-5 transition duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_28px_60px_-30px_rgba(0,0,0,0.9)]"
                >
                  <span className="grid h-10 w-10 place-items-center rounded-xl border border-primary/25 bg-primary/10 text-primary transition group-hover:bg-primary/15">
                    <Icon className="h-4.5 w-4.5" />
                  </span>
                  <h3 className="mt-4 font-heading text-base font-extrabold tracking-tight text-foreground">
                    {title}
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Stats */}
        <ScrollReveal>
          <div className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-border/60 bg-border/50 lg:grid-cols-4">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="bg-card/70 px-5 py-7 text-center transition hover:bg-card"
              >
                <p className="bg-gradient-to-r from-primary to-emerald-300 bg-clip-text font-heading text-3xl font-extrabold tracking-tight text-transparent sm:text-4xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs font-medium text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </ScrollReveal>

        {/* Why choose us */}
        <ScrollReveal>
          <div className="mt-14">
            <div className="max-w-2xl">
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-primary/80">
                Why choose us
              </p>
              <h2 className="mt-3 font-heading text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                Built around trust and speed.
              </h2>
            </div>

            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              {REASONS.map((reason) => (
                <div
                  key={reason.title}
                  className="flex items-start gap-3.5 rounded-2xl border border-border/70 bg-card/70 p-5"
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-primary/25 bg-primary/10 text-primary">
                    <CheckCircle2 className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-foreground">
                      {reason.title}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {reason.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Contact CTA */}
        <ScrollReveal>
          <div className="relative mt-14 overflow-hidden rounded-[2rem] border border-primary/20 bg-[#04202b] p-8 text-center sm:p-12">
            <div aria-hidden="true" className="pointer-events-none absolute inset-0">
              <div className="absolute -right-24 -top-28 h-72 w-72 rounded-full bg-primary/20 blur-[110px]" />
              <div className="absolute -bottom-28 left-1/4 h-64 w-64 rounded-full bg-secondary/20 blur-[120px]" />
            </div>
            <div className="relative">
              <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl border border-primary/25 bg-primary/10 text-primary">
                <Handshake className="h-5 w-5" />
              </span>
              <h2 className="mt-5 font-heading text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                Let&apos;s talk.
              </h2>
              <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-white/60">
                Have questions? We&apos;d love to hear from you. Reach us on
                WhatsApp or send an email.
              </p>
              <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                <a
                  href="https://wa.me/256767155113"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition hover:bg-primary/90"
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp us
                </a>
                <a
                  href="mailto:raymonjohns@gmail.com"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/10"
                >
                  <Mail className="h-4 w-4" />
                  Email us
                </a>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </main>

      <Footer />
    </div>
  );
}
