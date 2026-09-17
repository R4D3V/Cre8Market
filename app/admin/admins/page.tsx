"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  fetchAdminUsersAction,
  createAdminUserAction,
  deleteAdminUserAction,
} from "@/lib/actions/admin";
import type { AdminUserRow } from "@/lib/db/queries";
import { compressImage } from "@/lib/imageCompress";

export default function AdminUsersPage() {
  const { data: session } = useSession();
  const [admins, setAdmins] = useState<AdminUserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    whatsapp: "",
    avatar: "",
    password: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");

  const load = useCallback(async () => {
    const data = await fetchAdminUsersAction();
    setAdmins(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleAvatarUpload(file: File | null) {
    if (!file) return;
    try {
      const dataUrl = await compressImage(file, 400, 0.7);
      setForm((f) => ({ ...f, avatar: dataUrl }));
    } catch {
      setError("Could not read that image. Please try a different file.");
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setMsg("");
    try {
      await createAdminUserAction({
        name: form.name,
        email: form.email,
        phone: form.phone,
        whatsapp: form.whatsapp,
        avatar: form.avatar || null,
        password: form.password,
      });
      setForm({ name: "", email: "", phone: "", whatsapp: "", avatar: "", password: "" });
      setMsg("New admin added. They can now log in with the email and password.");
      await load();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to add admin");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string, email: string) {
    if (!confirm(`Remove ${email}? They will no longer be able to access the dashboard.`)) return;
    setError("");
    try {
      await deleteAdminUserAction(id);
      setMsg(`${email} removed.`);
      await load();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to remove admin");
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground font-heading">Admins</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Add another person to manage the dashboard
          </p>
        </div>
        <Link
          href="/admin"
          className="neu-pill bg-card text-primary text-sm font-semibold px-4 py-2 transition-all"
        >
          ← Back to Dashboard
        </Link>
      </div>

      {/* Add admin */}
      <div className="neu-card p-6 mb-6">
        <h2 className="font-bold text-foreground mb-4 font-heading">Add a New Admin</h2>
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-2xl shrink-0 overflow-hidden">
              {form.avatar ? (
                <img src={form.avatar} alt="Admin avatar" className="w-full h-full object-cover" />
              ) : (
                (form.name || "A")[0].toUpperCase()
              )}
            </div>
            <div className="flex flex-col gap-2">
              <label className="neu-pill bg-card text-primary text-xs font-semibold px-3 py-1.5 cursor-pointer text-center">
                📷 Upload Photo
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleAvatarUpload(e.target.files?.[0] ?? null)}
                />
              </label>
              {form.avatar && (
                <button
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, avatar: "" }))}
                  className="text-xs text-destructive hover:opacity-80 font-semibold"
                >
                  Remove Photo
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-muted-foreground mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Sarah Mwesigwa"
              className="neu-inset w-full px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-muted-foreground mb-1.5">
              Email (login)
            </label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="name@cre8market.com"
              className="neu-inset w-full px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-muted-foreground mb-1.5">
                Phone Number
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+256 700 000 000"
                className="neu-inset w-full px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-muted-foreground mb-1.5">
                WhatsApp Number
              </label>
              <input
                type="tel"
                value={form.whatsapp}
                onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                placeholder="+256 700 000 000"
                className="neu-inset w-full px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-muted-foreground mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Min 6 characters"
              className="neu-inset w-full px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
          </div>

          {error && (
            <div className="bg-destructive/10 border border-destructive/40 text-destructive text-sm rounded-xl px-4 py-3">
              {error}
            </div>
          )}
          {msg && (
            <div className="bg-primary/10 border border-primary/40 text-primary text-sm rounded-xl px-4 py-3">
              {msg}
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="neu-pill w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 text-sm transition-all disabled:opacity-60"
          >
            {saving ? "Adding…" : "+ Add Admin"}
          </button>
        </form>
      </div>

      {/* Existing admins */}
      <div className="neu-card p-6">
        <h2 className="font-bold text-foreground mb-4 font-heading">Current Admins</h2>
        {loading ? (
          <p className="text-muted-foreground text-sm">Loading…</p>
        ) : admins.length === 0 ? (
          <p className="text-muted-foreground text-sm">No admins yet.</p>
        ) : (
          <ul className="divide-y divide-border">
            {admins.map((a) => (
              <li key={a.id} className="py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm shrink-0 overflow-hidden">
                    {a.avatar ? (
                      <img src={a.avatar} alt={a.name ?? "Admin"} className="w-full h-full object-cover" />
                    ) : (
                      (a.name || "A")[0].toUpperCase()
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground text-sm truncate">
                      {a.name || "Admin"}
                      {session?.user?.email === a.email && (
                        <span className="ml-2 text-[10px] font-bold text-primary uppercase">
                          You
                        </span>
                      )}
                    </p>
                    <p className="text-muted-foreground text-xs truncate">{a.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(a.id, a.email)}
                  disabled={session?.user?.email === a.email}
                  className="text-destructive hover:opacity-80 text-xs font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
