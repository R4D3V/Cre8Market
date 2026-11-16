import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface Props {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: {
    label: string;
    href: string;
  };
  className?: string;
}

export default function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  className = "",
}: Props) {
  return (
    <div
      className={`flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between ${className}`}
    >
      <div className="max-w-2xl">
        {eyebrow && (
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-primary/80">
            {eyebrow}
          </p>
        )}
        <h2 className="mt-3 font-heading text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          {title}
        </h2>
        {description && (
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-[0.95rem]">
            {description}
          </p>
        )}
      </div>

      {action && (
        <Link
          href={action.href}
          className="group inline-flex w-fit items-center gap-2 rounded-full border border-border/70 bg-card/60 px-4 py-2.5 text-xs font-semibold text-foreground transition hover:border-primary/50 hover:text-primary"
        >
          {action.label}
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}
