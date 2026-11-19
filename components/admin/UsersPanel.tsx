"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import {
  deleteUserAction,
  fetchUsersAction,
  setUserActiveAction,
  setUserPlanAction,
} from "@/lib/actions/users";
import type { AppUser } from "@/lib/types";

export type UsersPanelKind = "seller" | "buyer";

type PlanFilter = "all" | "free" | "standard" | "premium";

const COPY: Record<
  UsersPanelKind,
  {
    eyebrow: string;
    heading: string;
    description: string;
    searchPlaceholder: string;
    empty: string;
    addHref: string | null;
    addLabel: string;
    deleteMessage: string;
  }
> = {
  seller: {
    eyebrow: "Admin · Sellers",
    heading: "Sellers",
    description: "Seller accounts — people who post listings and manage their storefront.",
    searchPlaceholder: "Search sellers by name, phone or WhatsApp…",
    empty: "No sellers found.",
    addHref: "/admin/users/new",
    addLabel: "+ Add Seller",
    deleteMessage:
      "Remove this seller? Their account will be deleted. Any products they added will stay on the site but become unassigned.",
  },
  buyer: {
    eyebrow: "Admin · Buyers",
    heading: "Buyers",
    description: "Buyer accounts — people who browse listings and chat with sellers.",
    searchPlaceholder: "Search buyers by name, phone or WhatsApp…",
    empty: "No buyers found.",
    addHref: null,
    addLabel: "",
    deleteMessage: "Remove this buyer? Their account and their chats will be deleted.",
  },
};

function isBuyerAccount(user: AppUser) {
  return user.accountType === "buyer";
}

function planOf(user: AppUser): "Free" | "Standard" | "Premium" {
  if (user.isVip) return "Premium";
  if (user.isVerified) return "Standard";
  return "Free";
}

function planChipClass(plan: "Free" | "Standard" | "Premium") {
  if (plan === "Premium") {
    return "border-amber-500/30 bg-amber-500/10 text-amber-700";
  }
  if (plan === "Standard") {
    return "border-sky-500/30 bg-sky-500/10 text-sky-700";
  }
  return "border-border bg-muted text-muted-foreground";
}

export function UsersPanel({ kind }: { kind: UsersPanelKind }) {
  return (
    <Suspense fallback={null}>
      <UsersPanelInner kind={kind} />
    </Suspense>
  );
}

function UsersPanelInner({ kind }: { kind: UsersPanelKind }) {
  const copy = COPY[kind];
  const isSellers = kind === "seller";

  const searchParams = useSearchParams();
  const verifiedFromUrl = searchParams.get("verified");
  const statusFromUrl = searchParams.get("status");

  const [users, setUsers] = useState<AppUser[]>([]);
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState<PlanFilter>(
    isSellers && verifiedFromUrl === "unverified" ? "free" : "all",
  );
  // The dashboard's "unverified sellers" queue only counts sellers that already
  // have at least one listing, so mirror that here.
  const onlyUnverifiedWithListings = isSellers && verifiedFromUrl === "unverified";
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">(
    statusFromUrl === "active" || statusFromUrl === "inactive" ? statusFromUrl : "all",
  );
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const data = await fetchUsersAction();
    setUsers(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    let active = true;
    fetchUsersAction().then((data) => {
      if (!active) return;
      setUsers(data ?? []);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  async function handleToggleActive(u: AppUser) {
    await setUserActiveAction(u.id, !u.isActive);
    load();
  }

  async function handleTogglePlan(u: AppUser, plan: "Standard" | "Premium") {
    await setUserPlanAction(u.id, planOf(u) === plan ? "Free" : plan);
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm(copy.deleteMessage)) return;
    await deleteUserAction(id);
    load();
  }

  const filteredUsers = useMemo(() => {
    const q = search.trim().toLowerCase();
    return users.filter((u) => {
      // Each page only lists its own account type.
      if (isBuyerAccount(u) !== (kind === "buyer")) return false;
      if (q) {
        const matches =
          u.name.toLowerCase().includes(q) ||
          u.phone.toLowerCase().includes(q) ||
          (u.whatsapp ?? "").toLowerCase().includes(q);
        if (!matches) return false;
      }
      if (isSellers && planFilter !== "all") {
        const plan = planOf(u).toLowerCase();
        if (planFilter === "free" && plan !== "free") return false;
        if (planFilter === "standard" && plan !== "standard") return false;
        if (planFilter === "premium" && plan !== "premium") return false;
      }
      if (onlyUnverifiedWithListings && (u.productCount ?? 0) === 0) return false;
      if (statusFilter === "active" && !u.isActive) return false;
      if (statusFilter === "inactive" && u.isActive) return false;
      return true;
    });
  }, [users, search, planFilter, statusFilter, isSellers, kind, onlyUnverifiedWithListings]);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-primary/80">
            {copy.eyebrow}
          </p>
          <h1 className="mt-2 font-heading text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            {copy.heading}
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">{copy.description}</p>
        </div>
        {copy.addHref && (
          <Link
            href={copy.addHref}
            className="rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground transition hover:bg-primary/90"
          >
            {copy.addLabel}
          </Link>
        )}
      </div>

      {/* Search + filters */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={copy.searchPlaceholder}
          className="neu-inset w-full px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none sm:w-80"
        />
        {isSellers && (
          <select
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value as PlanFilter)}
            className="neu-inset px-3 py-2 text-sm text-foreground focus:outline-none"
          >
            <option value="all">All plans</option>
            <option value="free">Free</option>
            <option value="standard">Standard</option>
            <option value="premium">Premium</option>
          </select>
        )}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as "all" | "active" | "inactive")}
          className="neu-inset px-3 py-2 text-sm text-foreground focus:outline-none"
        >
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Disabled</option>
        </select>
      </div>

      {/* List */}
      {loading ? (
        <p className="py-8 text-center text-sm text-muted-foreground">Loading…</p>
      ) : filteredUsers.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">{copy.empty}</p>
      ) : (
        <>
          {/* Mobile cards */}
          <div className="space-y-3 lg:hidden">
            {filteredUsers.map((u) => (
              <div key={u.id} className="rounded-xl border border-border/70 bg-card/80 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    {u.avatar ? (
                      <img src={u.avatar} alt={u.name} className="h-full w-full object-cover" />
                    ) : (
                      u.name[0].toUpperCase()
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-foreground">{u.name}</p>
                    {isSellers && (
                      <div className="mt-1 flex flex-wrap items-center gap-1.5">
                        <span
                          className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${planChipClass(
                            planOf(u),
                          )}`}
                        >
                          {planOf(u)} plan
                        </span>
                      </div>
                    )}

                    <p className="mt-1 text-xs text-muted-foreground">{u.phone}</p>
                    {isSellers && u.whatsapp && (
                      <a
                        href={`https://wa.me/${u.whatsapp}`}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-0.5 block truncate text-xs text-primary hover:underline"
                      >
                        WhatsApp: {u.whatsapp}
                      </a>
                    )}
                  </div>
                  <span
                    className={`shrink-0 text-xs font-bold ${
                      u.isActive ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    ● {u.isActive ? "Active" : "Disabled"}
                  </span>
                </div>

                <div
                  className={`mt-3 grid gap-3 text-xs ${isSellers ? "grid-cols-2" : "grid-cols-1"}`}
                >
                  {isSellers && (
                    <div>
                      <p className="text-muted-foreground">Products</p>
                      <Link
                        href={`/admin?user=${u.id}`}
                        className="font-semibold text-primary hover:underline"
                      >
                        {u.productCount ?? 0}
                      </Link>
                    </div>
                  )}
                  <div>
                    <p className="text-muted-foreground">Joined</p>
                    <p className="text-foreground">{new Date(u.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                {isSellers && (
                  <div className="mt-3 flex flex-wrap items-center gap-4 border-t border-border pt-3">
                    <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                      Standard
                      <button
                        type="button"
                        onClick={() => handleTogglePlan(u, "Standard")}
                        role="switch"
                        aria-checked={planOf(u) === "Standard"}
                        title={
                          planOf(u) === "Standard"
                            ? "Standard plan active — click for Free"
                            : "Set Standard plan"
                        }
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          planOf(u) === "Standard" ? "bg-sky-500" : "bg-muted"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                            planOf(u) === "Standard" ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                      Premium
                      <button
                        type="button"
                        onClick={() => handleTogglePlan(u, "Premium")}
                        role="switch"
                        aria-checked={planOf(u) === "Premium"}
                        title={
                          planOf(u) === "Premium"
                            ? "Premium plan active — click for Free"
                            : "Set Premium plan"
                        }
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          planOf(u) === "Premium" ? "bg-amber-500" : "bg-muted"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                            planOf(u) === "Premium" ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                )}

                <div className="mt-3 flex flex-wrap gap-2">
                  <Link
                    href={`/admin/users/${u.id}/edit`}
                    className="neu-pill bg-card px-3 py-1.5 text-xs font-semibold text-primary"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleToggleActive(u)}
                    className="neu-pill bg-card px-3 py-1.5 text-xs font-semibold text-primary"
                  >
                    {u.isActive ? "Disable" : "Enable"}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(u.id)}
                    className="neu-pill bg-card px-3 py-1.5 text-xs font-semibold text-destructive"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="hidden overflow-x-auto rounded-xl border border-border/70 bg-card/80 lg:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="pb-3 pr-4 font-semibold">Name</th>
                  <th className="pb-3 pr-4 font-semibold">Phone</th>
                  {isSellers && <th className="pb-3 pr-4 font-semibold">WhatsApp</th>}
                  {isSellers && <th className="pb-3 pr-4 font-semibold">Products</th>}
                  <th className="pb-3 pr-4 font-semibold">Status</th>
                  {isSellers && (
                    <>
                      <th className="pb-3 pr-4 font-semibold">Standard</th>
                      <th className="pb-3 pr-4 font-semibold">Premium</th>
                    </>
                  )}
                  <th className="pb-3 pr-4 font-semibold">Joined</th>
                  <th className="pb-3 pr-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="border-t border-border align-middle">
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary text-xs font-bold text-primary-foreground">
                          {u.avatar ? (
                            <img
                              src={u.avatar}
                              alt={u.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            u.name[0].toUpperCase()
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-foreground">{u.name}</p>
                          {isSellers && (
                            <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
                              <span
                                className={`inline-flex rounded-full border px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${planChipClass(
                                  planOf(u),
                                )}`}
                              >
                                {planOf(u)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-muted-foreground">{u.phone}</td>
                    {isSellers && (
                      <td className="py-3 pr-4 text-muted-foreground">
                        {u.whatsapp ? (
                          <a
                            href={`https://wa.me/${u.whatsapp}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-primary hover:underline"
                          >
                            {u.whatsapp}
                          </a>
                        ) : (
                          "—"
                        )}
                      </td>
                    )}
                    {isSellers && (
                      <td className="py-3 pr-4">
                        <Link
                          href={`/admin?user=${u.id}`}
                          className="font-semibold text-primary hover:underline"
                        >
                          {u.productCount ?? 0}
                        </Link>
                      </td>
                    )}
                    <td className="py-3 pr-4">
                      {u.isActive ? (
                        <span className="text-xs font-bold text-primary">● Active</span>
                      ) : (
                        <span className="text-xs font-bold text-muted-foreground">
                          ● Disabled
                        </span>
                      )}
                    </td>
                    {isSellers && (
                      <>
                        <td className="py-3 pr-4">
                          <button
                            onClick={() => handleTogglePlan(u, "Standard")}
                            role="switch"
                            aria-checked={planOf(u) === "Standard"}
                            title={
                              planOf(u) === "Standard"
                                ? "Standard plan active — click for Free"
                                : "Set Standard plan"
                            }
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              planOf(u) === "Standard" ? "bg-sky-500" : "bg-muted"
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                                planOf(u) === "Standard" ? "translate-x-6" : "translate-x-1"
                              }`}
                            />
                          </button>
                        </td>
                        <td className="py-3 pr-4">
                          <button
                            onClick={() => handleTogglePlan(u, "Premium")}
                            role="switch"
                            aria-checked={planOf(u) === "Premium"}
                            title={
                              planOf(u) === "Premium"
                                ? "Premium plan active — click for Free"
                                : "Set Premium plan"
                            }
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              planOf(u) === "Premium" ? "bg-amber-500" : "bg-muted"
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                                planOf(u) === "Premium" ? "translate-x-6" : "translate-x-1"
                              }`}
                            />
                          </button>
                        </td>
                      </>
                    )}
                    <td className="py-3 pr-4 text-muted-foreground">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/users/${u.id}/edit`}
                          className="neu-pill bg-card px-3 py-1.5 text-xs font-semibold text-primary"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleToggleActive(u)}
                          className="neu-pill bg-card px-3 py-1.5 text-xs font-semibold text-primary"
                        >
                          {u.isActive ? "Disable" : "Enable"}
                        </button>
                        <button
                          onClick={() => handleDelete(u.id)}
                          className="neu-pill bg-card px-3 py-1.5 text-xs font-semibold text-destructive"
                        >
                          Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
