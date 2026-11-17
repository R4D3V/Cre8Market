import type { ReactNode } from "react";

type DashboardPanelProps = {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
};

export function DashboardPanel({ title, description, action, children }: DashboardPanelProps) {
  return (
    <section className="page-ambient relative flex-1 overflow-hidden rounded-3xl border border-border/70 bg-card/80 p-6 backdrop-blur-sm sm:p-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-28 h-64 w-64 rounded-full bg-primary/10 blur-[90px]"
      />
      <header className="relative mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-primary/80">
            Seller studio
          </p>
          <h1 className="mt-2 font-heading text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            {title}
          </h1>
          {description && <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>}
        </div>
        {action}
      </header>
      <div className="relative">{children}</div>
    </section>
  );
}
