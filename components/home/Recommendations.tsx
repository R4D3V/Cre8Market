import { ArrowUpRight, Flame, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import SectionHeading from "./SectionHeading";

const cards = [
  {
    badge: "Curated for you",
    icon: Sparkles,
    title: "Picks that match your taste.",
    description:
      "A hand-picked edit of the listings worth a second look — refreshed as new finds arrive.",
    cta: "Explore recommendations",
    href: "/products",
    image: "/images/site/recommendation-2.webp",
    alt: "Laptop glowing in a dark room",
    accent: "text-primary",
    badgeClass: "border-white/15 bg-white/10",
    overlay: "bg-gradient-to-t from-[#021321] via-[#021321]/55 to-[#021321]/10",
  },
  {
    badge: "Limited time",
    icon: Flame,
    title: "Deals that won't last the week.",
    description:
      "Real markdowns from verified sellers. When they're gone, they're gone — no waiting around.",
    cta: "Grab a deal",
    href: "/deals",
    image: "/images/site/recommendation-1.webp",
    alt: "Gaming controller on a yellow background",
    accent: "text-amber-100",
    badgeClass: "border-amber-200/40 bg-black/30",
    overlay: "bg-gradient-to-t from-[#140d02] via-[#1a1203]/75 to-[#3a2a02]/25",
  },
];

export default function Recommendations() {
  return (
    <section className="container pt-16 sm:pt-24">
      <SectionHeading
        eyebrow="Made for you"
        title="Two ways to shop smarter."
        description="Browse the edit, or skip straight to the good stuff."
      />

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.title}
              href={card.href}
              className="group relative flex min-h-[290px] flex-col justify-end overflow-hidden rounded-[2rem] border border-border/70 p-6 sm:min-h-[340px] sm:p-8"
            >
              <Image
                src={card.image}
                alt={card.alt}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition duration-[900ms] ease-out group-hover:scale-105"
              />
              <div className={`absolute inset-0 ${card.overlay}`} />

              <span
                className={`relative z-10 inline-flex w-fit items-center gap-1.5 rounded-full border px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.18em] backdrop-blur sm:text-[10px] ${card.accent} ${card.badgeClass}`}
              >
                <Icon className="h-3 w-3" />
                {card.badge}
              </span>

              <h3 className="relative z-10 mt-4 max-w-sm font-heading text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                {card.title}
              </h3>
              <p className="relative z-10 mt-2 max-w-md text-sm leading-relaxed text-white/65">
                {card.description}
              </p>

              <span className="relative z-10 mt-5 inline-flex w-fit items-center gap-2 text-sm font-bold text-white">
                {card.cta}
                <span className="grid h-7 w-7 place-items-center rounded-full border border-white/20 bg-white/10 transition duration-300 group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
