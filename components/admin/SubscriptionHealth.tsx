import {
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  CircleSlash,
  Clock3,
  Sparkles,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import type { AdminOverview } from "@/lib/db/queries";
import { AdminSection } from "./AdminSection";

function formatDate(value: string | null) {
  if (!value) return "No end date";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "No end date";
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function SubscriptionHealth({ overview }: { overview: AdminOverview }) {
  const { subscriptions, renewals } = overview;

  const stats = [
    {
      label: "Active",
      value: subscriptions.active,
      icon: CheckCircle2,
      tone: "border-emerald-500/25 bg-emerald-500/10 text-emerald-700",
    },
    {
      label: "Expiring in 7 days",
      value: subscriptions.expiringSoon,
      icon: Clock3,
      tone: "border-amber-500/25 bg-amber-500/10 text-amber-700",
    },
    {
      label: "Expired",
      value: subscriptions.expired,
      icon: CircleSlash,
      tone: "border-rose-500/25 bg-rose-500/10 text-rose-700",
    },
    {
      label: "No paid plan",
      value: subscriptions.free,
      icon: UserRound,
      tone: "border-border bg-muted text-muted-foreground",
    },
  ];

  return (
    <AdminSection
      title="Subscription health"
      description="Plans are assigned manually — renew the ones about to lapse."
      action={
        <Link
          href="/admin/subscriptions"
          className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
        >
          Manage plans
          <ArrowRight className="size-3.5" />
        </Link>
      }
      className="h-full"
    >
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, tone }) => (
          <div key={label} className="rounded-xl border border-border/60 bg-muted/20 p-3">
            <span
              className={`inline-flex size-7 items-center justify-center rounded-lg border ${tone}`}
            >
              <Icon className="size-3.5" />
            </span>
            <p className="mt-2 font-heading text-2xl font-extrabold text-foreground">{value}</p>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              {label}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <div className="mb-2 flex items-center justify-between gap-2">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
            Renewals due
          </p>
          {renewals.length > 0 && (
            <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-700">
              {renewals.length} seller{renewals.length === 1 ? "" : "s"}
            </span>
          )}
        </div>

        {renewals.length === 0 ? (
          <div className="flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-emerald-500/25 bg-emerald-500/10 text-emerald-700">
              <Sparkles className="size-4" />
            </span>
            <div>
              <p className="text-sm font-semibold text-foreground">Nothing needs renewing</p>
              <p className="text-xs text-muted-foreground">
                No plan expires in the next seven days.
              </p>
            </div>
          </div>
        ) : (
          <ul className="divide-y divide-border/60 overflow-hidden rounded-xl border border-border/60">
            {renewals.map((renewal) => (
              <li key={renewal.id}>
                <Link
                  href={`/admin/users/${renewal.id}/edit`}
                  className="group flex items-center gap-3 bg-background/40 px-3 py-2.5 transition hover:bg-primary/5"
                >
                  <span
                    className={`flex size-8 shrink-0 items-center justify-center rounded-lg border ${
                      renewal.status === "expired"
                        ? "border-rose-500/25 bg-rose-500/10 text-rose-700"
                        : "border-amber-500/25 bg-amber-500/10 text-amber-700"
                    }`}
                  >
                    <CalendarClock className="size-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-foreground">
                      {renewal.name}
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      {renewal.planName} ·{" "}
                      {renewal.status === "expired"
                        ? `expired ${formatDate(renewal.expiresAt)}`
                        : `expires ${formatDate(renewal.expiresAt)}`}
                    </span>
                  </span>
                  <span
                    className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                      renewal.status === "expired"
                        ? "border-rose-500/30 bg-rose-500/10 text-rose-700"
                        : "border-amber-500/30 bg-amber-500/10 text-amber-700"
                    }`}
                  >
                    {renewal.status === "expired" ? "Expired" : "Soon"}
                  </span>
                  <ArrowRight className="size-4 shrink-0 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-primary" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </AdminSection>
  );
}
