"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import {
  fetchUsersAction,
  setUserActiveAction,
  setUserVerifiedAction,
  setUserVipAction,
  deleteUserAction,
} from "@/lib/actions/users";
import type { AppUser } from "@/lib/types";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [search, setSearch] = useState("");
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

  async function handleToggleVerified(u: AppUser) {
    await setUserVerifiedAction(u.id, !u.isVerified);
    load();
  }

  async function handleToggleVip(u: AppUser) {
    await setUserVipAction(u.id, !u.isVip);
    load();
  }

  async function handleDelete(id: string) {
    if (
      !confirm(
        "Remove this user? Their account will be deleted. Any products they added will stay on the site but become unassigned.",
      )
    )
      return;
    await deleteUserAction(id);
    load();
  }

  const filteredUsers = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.phone.toLowerCase().includes(q) ||
        (u.whatsapp ?? "").toLowerCase().includes(q),
    );
  }, [users, search]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold text-foreground font-heading">
          Users
        </h1>
      </div>

      {/* Add user button */}
      <div className="mb-6">
        <Link
          href="/admin/users/new"
          className="neu-pill bg-primary text-primary-foreground font-bold px-5 py-2 text-sm inline-block"
        >
          + Add User
        </Link>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, phone or WhatsApp…"
          className="neu-inset w-full sm:w-80 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
        />
      </div>

      {/* List */}
      {loading ? (
        <p className="text-center text-muted-foreground text-sm py-8">
          Loading…
        </p>
      ) : filteredUsers.length === 0 ? (
        <p className="text-center text-muted-foreground text-sm py-8">
          No users found.
        </p>
      ) : (
        <>
          {/* Mobile cards */}
          <div className="space-y-3 lg:hidden">
            {filteredUsers.map((u) => (
              <div
                key={u.id}
                className="rounded-xl border border-border bg-card p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary text-xs font-bold text-primary-foreground">
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
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-foreground">
                      {u.name}
                    </p>
                    {u.isAdmin && (
                      <span className="mt-1 inline-block rounded bg-primary px-1.5 py-0.5 text-[10px] font-bold text-primary-foreground">
                        Admin
                      </span>
                    )}
                    <p className="mt-1 text-xs text-muted-foreground">
                      {u.phone}
                    </p>
                    {u.whatsapp && (
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

                <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <p className="text-muted-foreground">Products</p>
                    <Link
                      href={`/admin?user=${u.id}`}
                      className="font-semibold text-primary hover:underline"
                    >
                      {u.productCount ?? 0}
                    </Link>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Joined</p>
                    <p className="text-foreground">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-4 border-t border-border pt-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                    Verified
                    <button
                      type="button"
                      onClick={() => handleToggleVerified(u)}
                      role="switch"
                      aria-checked={u.isVerified}
                      title={u.isVerified ? "Verified" : "Not verified"}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        u.isVerified ? "bg-secondary" : "bg-muted"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                          u.isVerified ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                    VIP
                    <button
                      type="button"
                      onClick={() => handleToggleVip(u)}
                      role="switch"
                      aria-checked={u.isVip ?? false}
                      title={u.isVip ? "VIP" : "Not VIP"}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        u.isVip ? "bg-amber-500" : "bg-muted"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                          u.isVip ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                </div>

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

          <div className="hidden overflow-x-auto rounded-xl border border-border bg-card lg:block">
            <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted-foreground text-xs uppercase tracking-wide">
                <th className="pb-3 pr-4 font-semibold">Name</th>
                <th className="pb-3 pr-4 font-semibold">Phone</th>
                <th className="pb-3 pr-4 font-semibold">WhatsApp</th>
                <th className="pb-3 pr-4 font-semibold">Products</th>
                <th className="pb-3 pr-4 font-semibold">Status</th>
                <th className="pb-3 pr-4 font-semibold">Verified</th>
                <th className="pb-3 pr-4 font-semibold">VIP</th>
                <th className="pb-3 pr-4 font-semibold">Joined</th>
                <th className="pb-3 pr-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => (
                <tr key={u.id} className="border-t border-border align-middle">
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold overflow-hidden shrink-0">
                        {u.avatar ? (
                          <img
                            src={u.avatar}
                            alt={u.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          u.name[0].toUpperCase()
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-foreground truncate">
                          {u.name}
                        </p>
                        {u.isAdmin && (
                          <span className="bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded">
                            Admin
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-muted-foreground">{u.phone}</td>
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
                  <td className="py-3 pr-4">
                    <Link
                      href={`/admin?user=${u.id}`}
                      className="text-primary font-semibold hover:underline"
                    >
                      {u.productCount ?? 0}
                    </Link>
                  </td>
                  <td className="py-3 pr-4">
                    {u.isActive ? (
                      <span className="text-primary text-xs font-bold">
                        ● Active
                      </span>
                    ) : (
                      <span className="text-muted-foreground text-xs font-bold">
                        ● Disabled
                      </span>
                    )}
                  </td>
                  <td className="py-3 pr-4">
                    <button
                      onClick={() => handleToggleVerified(u)}
                      role="switch"
                      aria-checked={u.isVerified}
                      title={u.isVerified ? "Verified" : "Not verified"}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        u.isVerified ? "bg-secondary" : "bg-muted"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                          u.isVerified ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </td>
                  <td className="py-3 pr-4">
                    <button
                      onClick={() => handleToggleVip(u)}
                      role="switch"
                      aria-checked={u.isVip ?? false}
                      title={u.isVip ? "VIP" : "Not VIP"}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        u.isVip ? "bg-amber-500" : "bg-muted"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                          u.isVip ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </td>
                  <td className="py-3 pr-4 text-muted-foreground">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/users/${u.id}/edit`}
                        className="neu-pill bg-card text-primary text-xs font-semibold px-3 py-1.5"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleToggleActive(u)}
                        className="neu-pill bg-card text-primary text-xs font-semibold px-3 py-1.5"
                      >
                        {u.isActive ? "Disable" : "Enable"}
                      </button>
                      <button
                        onClick={() => handleDelete(u.id)}
                        className="neu-pill bg-card text-destructive text-xs font-semibold px-3 py-1.5"
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
