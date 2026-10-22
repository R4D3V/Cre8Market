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
    load();
  }, [load]);

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
        <div className="bg-card border border-border rounded-xl overflow-hidden">
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
      )}
    </div>
  );
}
