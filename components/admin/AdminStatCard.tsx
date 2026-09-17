import type { LucideIcon } from "lucide-react";

type AdminStatCardProps = {
  label: string;
  value: number | string;
  icon: LucideIcon;
};

export function AdminStatCard({ label, value, icon: Icon }: AdminStatCardProps) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-background/40 p-5">
      <div className="flex items-center gap-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Icon className="size-4" />
        </span>
        {label}
      </div>
      <p className="font-heading text-3xl font-bold text-foreground">{value}</p>
    </div>
  );
}