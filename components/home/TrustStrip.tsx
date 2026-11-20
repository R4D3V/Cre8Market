import { BadgeCheck, ShieldCheck, Truck, Zap } from "lucide-react";

const benefits = [
  {
    icon: ShieldCheck,
    title: "Verified sellers",
    description: "Every seller is vetted before they list.",
  },
  {
    icon: Truck,
    title: "Fast local delivery",
    description: "Same-day drop-offs across Entebbe.",
  },
  {
    icon: BadgeCheck,
    title: "Honest pricing",
    description: "Clear prices with zero hidden charges.",
  },
  {
    icon: Zap,
    title: "Chat instantly",
    description: "Talk directly to sellers on WhatsApp.",
  },
];

export default function TrustStrip() {
  return (
    <section className="container pt-2">
      <div className="grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-border/60 bg-border/50 sm:grid-cols-2 lg:grid-cols-4">
        {benefits.map(({ icon: Icon, title, description }) => (
          <div
            key={title}
            className="group flex items-start gap-3.5 bg-card/70 p-5 transition hover:bg-card sm:p-6"
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-primary/20 bg-primary/10 text-primary transition group-hover:border-primary/40 group-hover:bg-primary/15">
              <Icon className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-bold text-foreground">{title}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                {description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
