import type { ReactNode } from "react";

type AdminSectionProps = {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function AdminSection({
  title,
  description,
  action,
  children,
  className = "",
}: AdminSectionProps) {
  return (
    <section
      className={`relative overflow-hidden rounded-2xl border border-border/70 bg-card/80 p-5 ${className}`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-primary/5 blur-3xl"
      />
      <header className="relative mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-[11px] font-bold uppercase tracking-[0.22em] text-primary/80">
            {title}
          </h2>
          {description && (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        {action}
      </header>
      <div className="relative">{children}</div>
    </section>
  );
}
