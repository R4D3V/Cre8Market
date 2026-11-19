"use client";

import { useCallback, useEffect, useState } from "react";
import PasswordInput from "@/components/PasswordInput";
import {
  createAdminUserAction,
  deleteAdminUserAction,
  fetchAdminUsersAction,
  isMainAdminAction,
  updateAdminUserByMainAdminAction,
} from "@/lib/actions/admin";
import { useSession } from "@/lib/auth-client";
import type { AdminUserRow } from "@/lib/db/queries";
import { compressImage } from "@/lib/imageCompress";

export default function AdminUsersPage() {
  const { data: session } = useSession();
  const [admins, setAdmins] = useState<AdminUserRow[]>([]);
  const [isMain, setIsMain] = useState<boolean | null>(null);
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

  // Inline editor for an existing admin, opened from the list below.
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    phone: "",
    whatsapp: "",
    avatar: "",
    password: "",
  });
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState("");
  const [editMsg, setEditMsg] = useState("");

  const load = useCallback(async () => {
    const main = await isMainAdminAction();
    setIsMain(main);
    if (!main) {
      setLoading(false);
      return;
    }
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
      setForm({
        name: "",
        email: "",
        phone: "",
        whatsapp: "",
        avatar: "",
        password: "",
      });
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

  function startEdit(admin: AdminUserRow) {
    setEditingId(admin.id);
    setEditError("");
    setEditMsg("");
    setEditForm({
      name: admin.name ?? "",
      phone: admin.phone ?? "",
      whatsapp: admin.whatsapp ?? "",
      avatar: admin.avatar ?? "",
      password: "",
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setEditError("");
    setEditForm({ name: "", phone: "", whatsapp: "", avatar: "", password: "" });
  }

  async function handleEditAvatarUpload(file: File | null) {
    if (!file) return;
    try {
      const dataUrl = await compressImage(file, 400, 0.7);
      setEditForm((f) => ({ ...f, avatar: dataUrl }));
    } catch {
      setEditError("Could not read that image. Please try a different file.");
    }
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!editingId) return;
    setEditSaving(true);
    setEditError("");
    setEditMsg("");
    try {
      const updated = await updateAdminUserByMainAdminAction(editingId, {
        name: editForm.name,
        phone: editForm.phone,
        whatsapp: editForm.whatsapp,
        avatar: editForm.avatar || null,
        password: editForm.password.trim() || undefined,
      });
      setEditMsg(`${updated.name || updated.email} updated.`);
      cancelEdit();
      await load();
    } catch (err: unknown) {
      setEditError(err instanceof Error ? err.message : "Failed to update admin");
    } finally {
      setEditSaving(false);
    }
  }

  if (isMain === false) {
    return (
      <div className="neu-card p-8 text-center">
        <h1 className="text-xl font-bold text-foreground mb-2">Access denied</h1>
        <p className="text-muted-foreground text-sm">
          Only the main admin can manage admin accounts.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-primary/80">
            Admin · Access control
          </p>
          <h1 className="mt-2 font-heading text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            Admins
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Add another person to manage the dashboard
          </p>
        </div>
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
            <PasswordInput
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
        {editMsg && (
          <div className="mb-4 rounded-xl border border-primary/40 bg-primary/10 px-4 py-3 text-sm text-primary">
            {editMsg}
          </div>
        )}
        {loading ? (
          <p className="text-muted-foreground text-sm">Loading…</p>
        ) : admins.length === 0 ? (
          <p className="text-muted-foreground text-sm">No admins yet.</p>
        ) : (
          <ul className="divide-y divide-border">
            {admins.map((a) => {
              const isSelf = session?.user?.email === a.email;

              if (editingId === a.id) {
                return (
                  <li key={a.id} className="py-4">
                    <form onSubmit={handleUpdate} className="space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h3 className="font-heading text-base font-bold text-foreground">
                          Edit {a.name || a.email}
                        </h3>
                        <button
                          type="button"
                          onClick={cancelEdit}
                          className="text-xs font-semibold text-muted-foreground hover:text-foreground"
                        >
                          Cancel
                        </button>
                      </div>

                      <p className="text-xs text-muted-foreground">
                        Email (login):{" "}
                        <span className="font-semibold text-foreground">{a.email}</span> — cannot
                        be changed.
                      </p>

                      <div className="flex items-center gap-4">
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary text-xl font-bold text-primary-foreground">
                          {editForm.avatar ? (
                            <img
                              src={editForm.avatar}
                              alt="Admin avatar"
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            (editForm.name || "A")[0].toUpperCase()
                          )}
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="neu-pill cursor-pointer bg-card px-3 py-1.5 text-center text-xs font-semibold text-primary">
                            📷 Change Photo
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleEditAvatarUpload(e.target.files?.[0] ?? null)}
                            />
                          </label>
                          {editForm.avatar && (
                            <button
                              type="button"
                              onClick={() => setEditForm((f) => ({ ...f, avatar: "" }))}
                              className="text-xs font-semibold text-destructive hover:opacity-80"
                            >
                              Remove Photo
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                          <label className="mb-1.5 block text-sm font-semibold text-muted-foreground">
                            Full Name
                          </label>
                          <input
                            type="text"
                            required
                            value={editForm.name}
                            onChange={(e) =>
                              setEditForm((f) => ({ ...f, name: e.target.value }))
                            }
                            className="neu-inset w-full px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="mb-1.5 block text-sm font-semibold text-muted-foreground">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            value={editForm.phone}
                            onChange={(e) =>
                              setEditForm((f) => ({ ...f, phone: e.target.value }))
                            }
                            placeholder="+256 700 000 000"
                            className="neu-inset w-full px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="mb-1.5 block text-sm font-semibold text-muted-foreground">
                            WhatsApp Number
                          </label>
                          <input
                            type="tel"
                            value={editForm.whatsapp}
                            onChange={(e) =>
                              setEditForm((f) => ({ ...f, whatsapp: e.target.value }))
                            }
                            placeholder="+256 700 000 000"
                            className="neu-inset w-full px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="mb-1.5 block text-sm font-semibold text-muted-foreground">
                            New Password (optional)
                          </label>
                          <PasswordInput
                            value={editForm.password}
                            onChange={(e) =>
                              setEditForm((f) => ({ ...f, password: e.target.value }))
                            }
                            placeholder="Leave blank to keep the current password"
                            className="neu-inset w-full px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                          />
                          <p className="mt-1 text-xs text-muted-foreground">
                            Use this if this admin is locked out. Minimum 6 characters.
                          </p>
                        </div>
                      </div>

                      {editError && (
                        <div className="rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                          {editError}
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={editSaving}
                        className="neu-pill w-full bg-primary py-2.5 text-sm font-bold text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-60"
                      >
                        {editSaving ? "Saving…" : "Save Changes"}
                      </button>
                    </form>
                  </li>
                );
              }

              return (
                <li key={a.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary text-sm font-bold text-primary-foreground">
                      {a.avatar ? (
                        <img
                          src={a.avatar}
                          alt={a.name ?? "Admin"}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        (a.name || "A")[0].toUpperCase()
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {a.name || "Admin"}
                        {isSelf && (
                          <span className="ml-2 text-[10px] font-bold uppercase text-primary">
                            You
                          </span>
                        )}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">{a.email}</p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    {!isSelf && (
                      <button
                        type="button"
                        onClick={() => startEdit(a)}
                        className="text-xs font-semibold text-primary transition-colors hover:opacity-80"
                      >
                        Edit
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDelete(a.id, a.email)}
                      disabled={isSelf}
                      className="text-xs font-semibold text-destructive transition-colors hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Remove
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
