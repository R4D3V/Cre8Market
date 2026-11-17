import { ArrowLeft, type LucideIcon } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

interface Props {
  eyebrow?: string;
  eyebrowIcon?: LucideIcon;
  title: ReactNode;
  description?: ReactNode;
  backHref?: string;
  backLabel?: string;
  align?: "left" | "center";
  size?: "default" | "large";
  /** Optional right-hand column, e.g. an image on split heroes. */
  aside?: ReactNode;
  children?: ReactNode;
}

export default function PageHero({
  eyebrow,
  eyebrowIcon: EyebrowIcon,
  title,
  description,
  backHref,
  backLabel = "Back",
  align = "left",
  size = "default",
  aside,
  children,
}: Props) {
  const centered = align === "center" && !aside;
  const large = size === "large";

  return (
    <section className="relative overflow-hidden border-b border-border/40">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 right-[-8%] h-[460px] w-[460px] rounded-full bg-primary/12 blur-[120px]" />
        <div className="absolute -left-32 top-16 h-[340px] w-[340px] rounded-full bg-secondary/15 blur-[110px]" />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, black 30%, transparent 100%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 80% 60% at 50% 0%, black 30%, transparent 100%)",
          }}
        />
      </div>

      <div className={`container relative ${large ? "py-14 sm:py-20" : "py-10 sm:py-14"}`}>
        <div className={aside ? "grid items-center gap-12 lg:grid-cols-2 lg:gap-16" : undefined}>
          <div className={centered ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
            {backHref && (
              <Link
                href={backHref}
                className={`inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground transition hover:text-primary ${
                  centered ? "mb-7" : "mb-5"
                }`}
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                {backLabel}
              </Link>
            )}

            {eyebrow &&
              (EyebrowIcon ? (
                <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-primary sm:text-[11px]">
                  <EyebrowIcon className="h-3 w-3" />
                  {eyebrow}
                </span>
              ) : (
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-primary/80">
                  {eyebrow}
                </p>
              ))}

            <h1
              className={`font-heading font-extrabold text-foreground ${
                EyebrowIcon ? "mt-6" : "mt-3"
              } ${
                large
                  ? "text-[2.15rem] leading-[1.06] tracking-[-0.035em] sm:text-5xl lg:text-[3.5rem]"
                  : "text-3xl leading-tight tracking-tight sm:text-4xl lg:text-5xl"
              }`}
            >
              {title}
            </h1>

            {description && (
              <p
                className={`${centered ? "mx-auto max-w-xl" : ""} ${
                  large ? "mt-5" : "mt-3"
                } text-sm leading-relaxed text-muted-foreground sm:text-base`}
              >
                {description}
              </p>
            )}

            {children && <div className={large ? "mt-8" : "mt-6"}>{children}</div>}
          </div>

          {aside && <div className="relative">{aside}</div>}
        </div>
      </div>
    </section>
  );
}
