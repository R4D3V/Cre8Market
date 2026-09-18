"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  fetchUsersAction,
  createUserByAdminAction,
  setUserActiveAction,
  setUserVerifiedAction,
  deleteUserAction,
} from "@/lib/actions/users";
import type { AppUser } from "@/lib/types";
import { PhoneInput, toFullNumber } from "@/components/PhoneInput";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", phone: "", whatsapp: "", password: "", pin: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    const data = await fetchUsersAction();
    setUsers(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await createUserByAdminAction({
        name: form.name,
        phone: toFullNumber(form.phone),
        whatsapp: form.whatsapp ? toFullNumber(form.whatsapp) : undefined,
        password: form.password,
        pin: form.pin || undefined,
      });
      setForm({ name: "", phone: "", whatsapp: "", password: "", pin: "" });
      await load();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to add user");
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleActive(u: AppUser) {
    await setUserActiveAction(u.id, !u.isActive);
    load();
  }

  async function handleToggleVerified(u: AppUser) {
    await setUserVerifiedAction(u.id, !u.isVerified);
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

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold text-foreground font-heading">Users</h1>
        <Link href="/admin" className="text-sm text-primary font-semibold hover:underline">
          ← Back to Dashboard
        </Link>
      </div>

      {/* Add user form */}
      <form onSubmit={handleCreate} className="neu-card p-5 max-w-xl mb-8 space-y-3">
        <h2 className="font-bold text-foreground font-heading">Add User</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">Full Name *</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="neu-inset w-full px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              placeholder="Jane Doe"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">Phone *</label>
            <PhoneInput
              required
              value={form.phone}
              onChange={(v) => setForm((f) => ({ ...f, phone: v }))}
              placeholder="700000000"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              WhatsApp (optional — defaults to phone)
            </label>
            <PhoneInput
              value={form.whatsapp}
              onChange={(v) => setForm((f) => ({ ...f, whatsapp: v }))}
              placeholder="700000000"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              Temporary Password *
            </label>
            <input
              required
              type="text"
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              className="neu-inset w-full px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              placeholder="At least 6 characters"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              4-Digit Reset Pin (optional)
            </label>
            <input
              type="text"
              inputMode="numeric"
              pattern="\d{4}"
              maxLength={4}
              value={form.pin}
              onChange={(e) => setForm((f) => ({ ...f, pin: e.target.value.replace(/\D/g, "") }))}
              className="neu-inset w-full px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              placeholder="e.g. 1234"
            />
          </div>
        </div>

        {error && (
          <div className="bg-destructive/10 border border-destructive/40 text-destructive text-sm rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          className="neu-pill bg-primary text-primary-foreground font-bold px-5 py-2 text-sm disabled:opacity-60"
        >
          {saving ? "Adding…" : "+ Add User"}
        </button>
      </form>

      {/* List */}
      {loading ? (
        <p className="text-center text-muted-foreground text-sm py-8">Loading…</p>
      ) : users.length === 0 ? (
        <p className="text-center text-muted-foreground text-sm py-8">No users yet.</p>
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
                <th className="pb-3 pr-4 font-semibold">Joined</th>
                <th className="pb-3 pr-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t border-border align-middle">
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold overflow-hidden shrink-0">
                        {u.avatar ? (
                          <img src={u.avatar} alt={u.name} className="w-full h-full object-cover" />
                        ) : (
                          u.name[0].toUpperCase()
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-foreground truncate">{u.name}</p>
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
                      <span className="text-primary text-xs font-bold">● Active</span>
                    ) : (
                      <span className="text-muted-foreground text-xs font-bold">● Disabled</span>
                    )}
                  </td>
                  <td className="py-3 pr-4">
                    <button
                      onClick={() => handleToggleVerified(u)}
                      className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full transition-all ${
                        u.isVerified
                          ? "bg-secondary/10 text-secondary hover:bg-secondary/20"
                          : "bg-muted text-muted-foreground hover:bg-muted/70"
                      }`}
                    >
                      {u.isVerified ? "✓ Verified" : "○ Not Verified"}
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