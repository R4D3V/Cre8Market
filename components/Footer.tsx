import {
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  BadgeCheck,
  Heart,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const MARKETPLACE_LINKS = [
  { label: "Shop all products", href: "/products" },
  { label: "Today's deals", href: "/deals" },
  { label: "Our sellers", href: "/sellers" },
  { label: "New arrivals", href: "/products?sort=latest" },
  { label: "Subscriptions", href: "/subscription" },
];

const COMPANY_LINKS = [
  { label: "About us", href: "/about" },
  { label: "Sell to us", href: "/selltous" },
  { label: "Contact", href: "/contact" },
  { label: "Install app", href: "/install" },
  { label: "Become a seller", href: "/register" },
];

const SUPPORT_LINKS = [
  { label: "Login", href: "/login" },
  { label: "Help & support", href: "/contact" },
  { label: "Privacy policy", href: "/privacy" },
  { label: "Terms of service", href: "/terms" },
];

function LinkColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <nav aria-label={title}>
      <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/80">
        {title}
      </h3>
      <ul className="mt-4 space-y-3">
        {links.map(({ label, href }) => (
          <li key={`${title}-${label}`}>
            <Link
              href={href}
              className="group inline-flex items-center gap-1.5 text-sm text-muted-foreground transition hover:text-foreground"
            >
              {label}
              <ArrowUpRight className="size-3 text-primary opacity-0 transition duration-300 group-hover:opacity-100" />
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-border/50 bg-[#011a31] pb-20 sm:pb-0">
      {/* Ambient backdrop */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-0 h-80 w-80 rounded-full bg-secondary/10 blur-[120px]" />
        <div className="absolute -right-24 top-24 h-96 w-96 rounded-full bg-primary/10 blur-[140px]" />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.045) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage:
              "radial-gradient(ellipse 80% 60% at 50% 0%, black 20%, transparent 100%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 80% 60% at 50% 0%, black 20%, transparent 100%)",
          }}
        />
      </div>

      <div className="container relative py-12 sm:py-16">
        {/* Footer CTA */}
        <div className="relative overflow-hidden rounded-[1.75rem] border border-primary/20 bg-[#04202b] p-6 sm:rounded-[2rem] sm:p-8 lg:p-10">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
          >
            <div className="absolute -right-24 -top-28 h-64 w-64 rounded-full bg-primary/20 blur-[100px]" />
            <div className="absolute -bottom-24 left-1/4 h-56 w-56 rounded-full bg-secondary/20 blur-[110px]" />
          </div>

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
                <Sparkles className="size-3" />
                Entebbe&apos;s local marketplace
              </span>
              <h2 className="mt-4 font-heading text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                Buy local. Sell direct. Keep it simple.
              </h2>
              <p className="mt-2 max-w-lg text-sm leading-relaxed text-white/60">
                Fresh deals from trusted sellers, with no middlemen and no
                hidden fees — right here in Entebbe.
              </p>
            </div>

            <div className="flex flex-col gap-2.5 sm:flex-row lg:shrink-0">
              <Link
                href="/products"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition hover:bg-primary/90"
              >
                Browse the market
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/selltous"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/10"
              >
                Sell to us
              </Link>
            </div>
          </div>
        </div>

        {/* Main footer */}
        <div className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-12">
          {/* Brand */}
          <div className="lg:col-span-3">
            <Link
              href="/"
              aria-label="CRE8MARKET home"
              className="inline-flex items-center"
            >
              <Image
                src="/brand/cre8-market-logo-transparent.svg"
                alt="Cre8 Market"
                width={954}
                height={257}
                loading="eager"
                className="h-10 w-auto shrink-0 object-contain"
              />
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Entebbe&apos;s #1 marketplace for new and secondhand electronics,
              phones, surplus goods, and discounted products.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-muted/25 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                <BadgeCheck className="size-3.5 text-primary" />
                Entebbe-owned
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-muted/25 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                <MapPin className="size-3.5 text-primary" />
                Kitoro, Entebbe
              </span>
            </div>
          </div>

          <div className="lg:col-span-2">
            <LinkColumn title="Marketplace" links={MARKETPLACE_LINKS} />
          </div>
          <div className="lg:col-span-2">
            <LinkColumn title="Company" links={COMPANY_LINKS} />
          </div>
          <div className="lg:col-span-2">
            <LinkColumn title="Support" links={SUPPORT_LINKS} />
          </div>

          {/* Contact */}
          <div className="lg:col-span-3">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/80">
              Get in touch
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <a
                  href="tel:+256767155113"
                  className="group flex items-start gap-2.5 text-sm text-muted-foreground transition hover:text-foreground"
                >
                  <Phone className="mt-0.5 size-3.5 shrink-0 text-primary/80" />
                  <span>+256 767 155 113</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:raymonjohns@gmail.com"
                  className="group flex items-start gap-2.5 text-sm text-muted-foreground transition hover:text-foreground"
                >
                  <Mail className="mt-0.5 size-3.5 shrink-0 text-primary/80" />
                  <span className="break-words">raymonjohns@gmail.com</span>
                </a>
              </li>
            </ul>

            <a
              href="https://wa.me/256767155113"
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-wa/30 bg-wa/10 px-3.5 py-2 text-xs font-bold text-wa transition hover:bg-wa/15"
            >
              <MessageCircle className="size-3.5" />
              WhatsApp us
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="relative border-t border-border/50 bg-background/20">
        <div className="container flex flex-col items-center justify-between gap-3 py-5 text-center text-[11px] text-muted-foreground sm:flex-row sm:text-left">
          <p>
            <Link
              href="/admin"
              className="font-semibold text-foreground/80 transition hover:text-primary"
            >
              © 2026
            </Link>
            .CRE8MARKET ENTEBBE. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            <span className="inline-flex items-center gap-1.5">
              <Heart className="size-3 text-primary" />
              Made in Entebbe
            </span>
            <Link href="/privacy" className="transition hover:text-primary">
              Privacy
            </Link>
            <Link href="/terms" className="transition hover:text-primary">
              Terms
            </Link>
            <a
              href="#main-content"
              aria-label="Back to top"
              className="grid size-7 place-items-center rounded-full border border-border/60 bg-muted/20 text-muted-foreground transition hover:border-primary/40 hover:text-primary"
            >
              <ArrowUp className="size-3.5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
