import { ArrowRight, BadgeCheck, Store } from "lucide-react";
import Link from "next/link";

const promos = [
  {
    eyebrow: "Sell in minutes",
    title: "Turn your old phone into cash.",
    description:
      "Free quote, instant inspection and same-day payment at our Entebbe hub. No listing, no waiting.",
    cta: "Sell to us",
    href: "/selltous",
    Icon: Store,
    accent: "text-primary",
    iconClass: "bg-primary/15 text-primary",
    ring: "border-primary/25",
    gradient: "from-primary/20 via-card to-card",
    glow: "bg-primary/20",
  },
  {
    eyebrow: "For sellers",
    title: "Open your store on Cre8Market.",
    description:
      "Get a verified badge, chat with buyers directly and reach thousands of local shoppers.",
    cta: "Start selling",
    href: "/register",
    Icon: BadgeCheck,
    accent: "text-secondary",
    iconClass: "bg-secondary/15 text-secondary",
    ring: "border-secondary/25",
    gradient: "from-secondary/20 via-card to-card",
    glow: "bg-secondary/20",
  },
];

export default function PromoBand() {
  return (
    <section className="container pt-8 sm:pt-10">
      <div className="grid gap-3 md:grid-cols-2">
        {promos.map((promo) => (
          <div
            key={promo.href}
            className={`group relative overflow-hidden rounded-3xl border bg-gradient-to-br p-5 sm:p-6 ${promo.ring} ${promo.gradient}`}
          >
            <div
              aria-hidden="true"
              className={`absolute -right-12 -top-16 size-48 rounded-full blur-[80px] transition group-hover:scale-110 ${promo.glow}`}
            />
            <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="max-w-sm">
                <p className={`text-[10px] font-bold uppercase tracking-[0.2em] ${promo.accent}`}>
                  {promo.eyebrow}
                </p>
                <h3 className="mt-2 font-heading text-xl font-extrabold leading-tight tracking-tight text-foreground sm:text-2xl">
                  {promo.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                  {promo.description}
                </p>
                <Link
                  href={promo.href}
                  className={`mt-4 inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-xs font-bold transition sm:text-sm ${
                    promo.href === "/selltous"
                      ? "bg-primary text-primary-foreground hover:bg-accent"
                      : "bg-secondary text-secondary-foreground hover:opacity-90"
                  }`}
                >
                  {promo.cta}
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
              <span
                className={`grid size-16 shrink-0 place-items-center rounded-3xl sm:size-20 ${promo.iconClass}`}
              >
                <promo.Icon className="size-8 sm:size-9" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
