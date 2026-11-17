import type { LucideIcon } from "lucide-react";

type AdminStatCardProps = {
  label: string;
  value: number | string;
  icon: LucideIcon;
  hint?: string;
};

export function AdminStatCard({ label, value, icon: Icon, hint }: AdminStatCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border/70 bg-card/80 p-5 transition duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_28px_60px_-30px_rgba(0,0,0,0.9)]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-primary/10 blur-2xl transition group-hover:bg-primary/20"
      />
      <div className="relative flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-xl border border-primary/25 bg-primary/10 text-primary">
          <Icon className="size-4" />
        </span>
        {label}
      </div>
      <p className="relative mt-4 font-heading text-3xl font-extrabold tracking-tight text-foreground">
        {value}
      </p>
      {hint && <p className="relative mt-0.5 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
