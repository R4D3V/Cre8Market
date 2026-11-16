import Link from "next/link";
import {
  ArrowRight,
  Camera,
  MessageCircle,
  Sparkles,
  Wallet,
} from "lucide-react";

const steps = [
  {
    icon: Camera,
    title: "Snap & list",
    description: "Add a few photos and a price. It takes about two minutes.",
  },
  {
    icon: MessageCircle,
    title: "Chat & agree",
    description: "Buyers message you directly. No middlemen, no runaround.",
  },
  {
    icon: Wallet,
    title: "Meet & get paid",
    description: "Close the deal your way — cash, mobile money, whatever works.",
  },
];

export default function SellCta() {
  return (
    <section className="container pt-16 sm:pt-24">
      <div className="relative overflow-hidden rounded-[2rem] border border-primary/20 bg-[#04202b] p-7 sm:rounded-[2.5rem] sm:p-10 lg:p-14">
        {/* Ambient background */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute -right-24 -top-32 h-80 w-80 rounded-full bg-primary/20 blur-[110px]" />
          <div className="absolute -bottom-32 left-1/4 h-72 w-72 rounded-full bg-secondary/20 blur-[120px]" />
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
              maskImage:
                "radial-gradient(ellipse 70% 80% at 70% 20%, black 20%, transparent 100%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 70% 80% at 70% 20%, black 20%, transparent 100%)",
            }}
          />
        </div>

        <div className="relative grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
              <Sparkles className="h-3 w-3" />
              Sell with us
            </span>

            <h2 className="mt-5 max-w-xl font-heading text-3xl font-extrabold leading-[1.08] tracking-[-0.03em] text-white sm:text-4xl lg:text-[2.9rem]">
              Turn what you don&apos;t need into what you do.
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-white/60 sm:text-base">
              List in minutes, chat directly with verified buyers, and get paid
              your way. No listing fees on your first item — just a simpler way
              to sell in Entebbe.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                href="/selltous"
                className="group inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition hover:bg-accent"
              >
                Start selling
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/sellers"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/10"
              >
                Meet the sellers
              </Link>
            </div>
          </div>

          <div className="grid gap-2.5">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.title}
                  className="group flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-sm transition hover:border-primary/30 hover:bg-white/[0.07]"
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/5 text-primary">
                    <Icon className="h-4.5 w-4.5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-bold text-white">{step.title}</p>
                      <span className="font-heading text-xs font-bold text-white/25">
                        0{index + 1}
                      </span>
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-white/55">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
