"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Download, RefreshCw, Search, X } from "lucide-react";
import { fetchAuditLogAction } from "@/lib/actions/products";

interface AuditEntry {
  id: string;
  actor_id: string | null;
  actor_role: string | null;
  actor_name: string | null;
  action: string;
  target_type: string | null;
  target_id: string | null;
  metadata: Record<string, unknown>;
  ip: string | null;
  user_agent: string | null;
  created_at: string;
}

interface AuditFacets {
  actions: string[];
  actor_roles: string[];
  target_types: string[];
}

const PAGE_SIZE = 100;

const EMPTY_FACETS: AuditFacets = {
  actions: [],
  actor_roles: [],
  target_types: [],
};

function actionTone(action: string) {
  if (action.includes("delete") || action.includes("demote")) {
    return "border-red-500/30 bg-red-500/10 text-red-600";
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

function formatMetadata(metadata: Record<string, unknown> | null) {
  if (!metadata || Object.keys(metadata).length === 0) return "—";
  return JSON.stringify(metadata);
}

function escapeCsv(value: unknown) {
  const text = String(value ?? "");
  return `"${text.replaceAll('"', '""')}"`;
}

export default function AdminAuditPage() {
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [facets, setFacets] = useState<AuditFacets>(EMPTY_FACETS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [action, setAction] = useState("");
  const [actorRole, setActorRole] = useState("");
  const [targetType, setTargetType] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [limit, setLimit] = useState(PAGE_SIZE);
  const [refreshKey, setRefreshKey] = useState(0);

  const hasFilters = Boolean(
    search || action || actorRole || targetType || from || to,
  );

  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      setLoading(true);
      setError(null);

      const filters: {
        limit: number;
        search?: string;
        action?: string;
        actorRole?: string;
        targetType?: string;
        from?: string;
        to?: string;
      } = { limit };

      if (search.trim()) filters.search = search.trim();
      if (action) filters.action = action;
      if (actorRole) filters.actorRole = actorRole;
      if (targetType) filters.targetType = targetType;
      if (from) filters.from = new Date(`${from}T00:00:00`).toISOString();
      if (to) filters.to = new Date(`${to}T23:59:59.999`).toISOString();

      fetchAuditLogAction(filters)
        .then((data) => {
          if (cancelled) return;
          setEntries((data.entries as AuditEntry[]) ?? []);
          setTotal(data.total ?? 0);
          setFacets((data.facets as AuditFacets) ?? EMPTY_FACETS);
        })
        .catch((err: unknown) => {
          if (cancelled) return;
          setError(
            err instanceof Error ? err.message : "Failed to load audit log",
          );
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [search, action, actorRole, targetType, from, to, limit, refreshKey]);

  const clearFilters = useCallback(() => {
    setSearch("");
    setAction("");
    setActorRole("");
    setTargetType("");
    setFrom("");
    setTo("");
    setLimit(PAGE_SIZE);
  }, []);

  const exportCsv = useCallback(() => {
    const header = [
      "timestamp",
      "actor_name",
      "actor_role",
      "actor_id",
      "action",
      "target_type",
      "target_id",
      "ip",
      "user_agent",
      "metadata",
    ];
    const rows = entries.map((entry) =>
      [
        entry.created_at,
        entry.actor_name,
        entry.actor_role,
        entry.actor_id,
        entry.action,
        entry.target_type,
        entry.target_id,
        entry.ip,
        entry.user_agent,
        formatMetadata(entry.metadata),
      ]
        .map(escapeCsv)
        .join(","),
    );
    const csv = [header.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `audit-log-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }, [entries]);

  const shownLabel = useMemo(
    () =>
      `Showing ${entries.length.toLocaleString()} of ${total.toLocaleString()} ${
        total === 1 ? "entry" : "entries"
      }`,
    [entries.length, total],
  );

  return (
    <main className="container py-6">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-extrabold text-foreground">
            Audit Log
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Every create, update, delete and security action across the
            marketplace.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setRefreshKey((key) => key + 1)}
            className="inline-flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <RefreshCw className="size-4" />
            Refresh
          </button>
          <button
            type="button"
            onClick={exportCsv}
            disabled={entries.length === 0}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            <Download className="size-4" />
            Export CSV
          </button>
        </div>
      </div>

      <div className="neu-card mb-5 grid gap-3 p-4 md:grid-cols-2 xl:grid-cols-6">
        <label className="relative md:col-span-2 xl:col-span-2">
          <span className="mb-1 block text-xs font-semibold text-muted-foreground">
            Search
          </span>
          <Search className="pointer-events-none absolute left-3 top-[2.1rem] size-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Action, actor, target or metadata…"
            className="w-full rounded-xl border border-border bg-background py-2 pl-9 pr-3 text-sm outline-none focus:border-primary"
          />
        </label>

        <label>
          <span className="mb-1 block text-xs font-semibold text-muted-foreground">
            Action
          </span>
          <select
            value={action}
            onChange={(event) => setAction(event.target.value)}
            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
          >
            <option value="">All actions</option>
            {facets.actions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span className="mb-1 block text-xs font-semibold text-muted-foreground">
            Actor role
          </span>
          <select
            value={actorRole}
            onChange={(event) => setActorRole(event.target.value)}
            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
          >
            <option value="">All roles</option>
            {facets.actor_roles.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span className="mb-1 block text-xs font-semibold text-muted-foreground">
            Target type
          </span>
          <select
            value={targetType}
            onChange={(event) => setTargetType(event.target.value)}
            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
          >
            <option value="">All targets</option>
            {facets.target_types.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span className="mb-1 block text-xs font-semibold text-muted-foreground">
            From
          </span>
          <input
            type="date"
            value={from}
            onChange={(event) => setFrom(event.target.value)}
            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
          />
        </label>

        <label>
          <span className="mb-1 block text-xs font-semibold text-muted-foreground">
            To
          </span>
          <input
            type="date"
            value={to}
            onChange={(event) => setTo(event.target.value)}
            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
          />
        </label>

        <div className="flex items-end">
          <button
            type="button"
            onClick={clearFilters}
            disabled={!hasFilters}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border px-3 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-40"
          >
            <X className="size-4" />
            Clear filters
          </button>
        </div>
      </div>

      <div className="mb-3 flex items-center justify-between gap-2 text-xs text-muted-foreground">
        <span>{loading ? "Loading…" : shownLabel}</span>
        {error ? <span className="text-red-600">{error}</span> : null}
      </div>

      <div className="overflow-x-auto neu-card">
        <table className="w-full min-w-[900px] text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase text-muted-foreground">
              <th className="p-3">Time</th>
              <th className="p-3">Actor</th>
              <th className="p-3">Action</th>
              <th className="p-3">Target</th>
              <th className="p-3">IP</th>
              <th className="p-3">Metadata</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr
                key={entry.id}
                className="border-b border-border/50 align-top last:border-0"
              >
                <td className="whitespace-nowrap p-3 text-xs">
                  {new Date(entry.created_at).toLocaleString()}
                </td>
                <td className="p-3">
                  <span className="block text-xs font-semibold text-foreground">
                    {entry.actor_name ?? entry.actor_role ?? "—"}
                  </span>
                  <span className="block max-w-[180px] truncate text-xs text-muted-foreground">
                    {entry.actor_role ? `${entry.actor_role} · ` : ""}
                    {entry.actor_id ?? "—"}
                  </span>
                </td>
                <td className="p-3">
                  <span
                    className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-semibold ${actionTone(
                      entry.action,
                    )}`}
                  >
                    {entry.action}
                  </span>
                </td>
                <td className="p-3 text-xs">
                  <span className="font-semibold">
                    {entry.target_type ?? "—"}
                  </span>
                  <span className="block max-w-[180px] truncate text-muted-foreground">
                    {entry.target_id ?? ""}
                  </span>
                </td>
                <td className="p-3 text-xs text-muted-foreground">
                  {entry.ip ?? "—"}
                </td>
                <td className="max-w-[360px] p-3">
                  {Object.keys(entry.metadata ?? {}).length > 0 ? (
                    <details>
                      <summary className="cursor-pointer text-xs text-muted-foreground">
                        View details
                      </summary>
                      <pre className="mt-1 max-h-40 overflow-auto whitespace-pre-wrap break-all rounded-lg bg-muted p-2 text-xs">
                        {JSON.stringify(entry.metadata, null, 2)}
                      </pre>
                    </details>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!loading && entries.length === 0 ? (
          <p className="p-6 text-center text-sm text-muted-foreground">
            {hasFilters
              ? "No audit entries match these filters."
              : "No audit entries yet."}
          </p>
        ) : null}
      </div>

      {entries.length < total ? (
        <div className="mt-4 flex justify-center">
          <button
            type="button"
            onClick={() => setLimit((current) => current + PAGE_SIZE)}
            disabled={loading}
            className="rounded-xl border border-border px-4 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-40"
          >
            Load {Math.min(PAGE_SIZE, total - entries.length)} more
          </button>
        </div>
      ) : null}
    </main>
  );
}
