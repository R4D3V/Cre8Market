import Link from "next/link";
import { ArrowRight, History } from "lucide-react";
import type { AuditEntry } from "@/lib/db/queries";
import { AdminSection } from "./AdminSection";

function actionTone(action: string) {
  if (action.includes("delete") || action.includes("demote")) {
    return "border-rose-500/30 bg-rose-500/10 text-rose-700";
  }
  if (
    action.includes("create") ||
    action.includes("register") ||
    action.includes("promote") ||
    action.includes("verify") ||
    action.includes("feature")
  ) {
    return "border-emerald-500/30 bg-emerald-500/10 text-emerald-700";
  }
  if (action.includes("password") || action.includes("reset")) {
    return "border-violet-500/30 bg-violet-500/10 text-violet-700";
  }
  if (action.includes("update") || action.includes("change")) {
    return "border-sky-500/30 bg-sky-500/10 text-sky-700";
  }
  return "border-border bg-muted text-muted-foreground";
}

function formatWhen(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function RecentActivity({ entries }: { entries: AuditEntry[] }) {
  return (
    <AdminSection
      title="Recent activity"
      description="The latest admin and seller actions."
      action={
        <Link
          href="/admin/audit"
          className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
        >
          View all
          <ArrowRight className="size-3.5" />
        </Link>
      }
      className="h-full"
    >
      {entries.length === 0 ? (
        <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-muted/15 p-3">
          <span className="flex size-8 items-center justify-center rounded-lg border border-primary/25 bg-primary/10 text-primary">
            <History className="size-4" />
          </span>
          <p className="text-sm text-muted-foreground">
            No activity recorded yet.
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-border/60">
          {entries.map((entry) => (
            <li
              key={entry.id}
              className="flex items-start gap-3 py-2.5 first:pt-0 last:pb-0"
            >
              <span
                className={`mt-0.5 inline-flex shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-bold ${actionTone(
                  entry.action,
                )}`}
              >
                {entry.action}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm text-foreground">
                  <span className="font-semibold">
                    {entry.actor_name ?? entry.actor_role ?? "System"}
                  </span>
                  {entry.target_type && (
                    <span className="text-muted-foreground">
                      {" "}
                      · {entry.target_type}
                    </span>
                  )}
                </span>
                <span className="block text-[11px] text-muted-foreground">
                  {formatWhen(entry.created_at)}
                </span>
              </span>
            </li>
          ))}
        </ul>
      )}
    </AdminSection>
  );
}
