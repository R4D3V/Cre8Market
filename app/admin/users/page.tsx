"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  fetchUsersAction,
  createUserByAdminAction,
  setUserActiveAction,
  updateUserByAdminAction,
  resetUserPasswordByAdminAction,
  deleteUserAction,
} from "@/lib/actions/users";
import type { AppUser } from "@/lib/types";
import { PhoneInput, toLocalPart, toFullNumber } from "@/components/PhoneInput";
import { compressImage } from "@/lib/imageCompress";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", phone: "", whatsapp: "", password: "", pin: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    phone: "",
    whatsapp: "",
    avatar: "",
    newPassword: "",
  });
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState("");

  const load = useCallback(async () => {
    const data = await fetchUsersAction();
    setUsers(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function startEdit(u: AppUser) {
    setEditingId(u.id);
    setEditForm({
      name: u.name,
      phone: toLocalPart(u.phone),
      whatsapp: toLocalPart(u.whatsapp ?? ""),
      avatar: u.avatar ?? "",
      newPassword: "",
    });
    setEditError("");
  }

  async function handleAvatarUpload(file: File | null) {
    if (!file) return;
    try {
      const dataUrl = await compressImage(file, 400, 0.7);
      setEditForm((f) => ({ ...f, avatar: dataUrl }));
    } catch {
      setEditError("Could not read that image. Please try a different file.");
    }
  }

  async function handleSaveEdit(u: AppUser) {
    setEditSaving(true);
    setEditError("");
    try {
      await updateUserByAdminAction(u.id, {
        name: editForm.name,
        phone: toFullNumber(editForm.phone),
        whatsapp: editForm.whatsapp ? toFullNumber(editForm.whatsapp) : undefined,
        avatar: editForm.avatar || null,
      });
      if (editForm.newPassword) {
        await resetUserPasswordByAdminAction(u.id, editForm.newPassword);
      }
      setEditingId(null);
      await load();
    } catch (err: unknown) {
      setEditError(err instanceof Error ? err.message : "Failed to save user");
    } finally {
      setEditSaving(false);
    }
  }

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
        <h1 className="text-2xl font-extrabold text-gray-900">Users</h1>
        <Link href="/admin" className="text-sm text-navy font-semibold hover:underline">
          ← Back to Dashboard
        </Link>
      </div>

      {/* Add user form */}
      <form onSubmit={handleCreate} className="neu-card p-5 max-w-xl mb-8 space-y-3">
        <h2 className="font-bold text-gray-900">Add User</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Full Name *</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="neu-inset w-full px-3 py-2 text-sm focus:outline-none"
              placeholder="Jane Doe"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Phone *</label>
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
            <label className="block text-xs font-semibold text-gray-500 mb-1">
              WhatsApp (optional — defaults to phone)
            </label>
            <PhoneInput
              value={form.whatsapp}
              onChange={(v) => setForm((f) => ({ ...f, whatsapp: v }))}
              placeholder="700000000"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">
              Temporary Password *
            </label>
            <input
              required
              type="text"
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              className="neu-inset w-full px-3 py-2 text-sm focus:outline-none"
              placeholder="At least 6 characters"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">
              4-Digit Reset Pin (optional)
            </label>
            <input
              type="text"
              inputMode="numeric"
              pattern="\d{4}"
              maxLength={4}
              value={form.pin}
              onChange={(e) => setForm((f) => ({ ...f, pin: e.target.value.replace(/\D/g, "") }))}
              className="neu-inset w-full px-3 py-2 text-sm focus:outline-none"
              placeholder="e.g. 1234"
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          className="neu-pill bg-navy text-white font-bold px-5 py-2 text-sm disabled:opacity-60"
        >
          {saving ? "Adding…" : "+ Add User"}
        </button>
      </form>

      {/* List */}
      {loading ? (
        <p className="text-center text-gray-500 text-sm py-8">Loading…</p>
      ) : users.length === 0 ? (
        <p className="text-center text-gray-400 text-sm py-8">No users yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-400 text-xs uppercase tracking-wide">
                <th className="pb-3 pr-4 font-semibold">Name</th>
                <th className="pb-3 pr-4 font-semibold">Phone</th>
                <th className="pb-3 pr-4 font-semibold">WhatsApp</th>
                <th className="pb-3 pr-4 font-semibold">Products</th>
                <th className="pb-3 pr-4 font-semibold">Status</th>
                <th className="pb-3 pr-4 font-semibold">Joined</th>
                <th className="pb-3 pr-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const editing = editingId === u.id;
                return (
                  <tr key={u.id} className="border-t border-gray-100 align-top">
                    <td className="py-3 pr-4 font-semibold text-gray-900">
                      {editing ? (
                        <div className="flex items-start gap-2">
                          <input
                            value={editForm.name}
                            onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                            className="neu-inset w-full px-3 py-1.5 text-sm focus:outline-none"
                          />
                          <div className="flex flex-col items-center gap-1 shrink-0">
                            <div className="w-9 h-9 rounded-full bg-navy flex items-center justify-center text-white font-bold text-sm overflow-hidden">
                              {editForm.avatar ? (
                                <img
                                  src={editForm.avatar}
                                  alt="Avatar"
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                (editForm.name || "U")[0].toUpperCase()
                              )}
                            </div>
                            <label className="text-[10px] font-semibold text-navy cursor-pointer hover:underline">
                              {editForm.avatar ? "Change" : "Add"}
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleAvatarUpload(e.target.files?.[0] ?? null)}
                              />
                            </label>
                            {editForm.avatar && (
                              <button
                                type="button"
                                onClick={() => setEditForm((f) => ({ ...f, avatar: "" }))}
                                className="text-[10px] font-semibold text-red-500 hover:underline"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-navy flex items-center justify-center text-white text-xs font-bold overflow-hidden shrink-0">
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
                          <span>{u.name}</span>
                          {u.isAdmin && (
                            <span className="bg-navy text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                              Admin
                            </span>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="py-3 pr-4 text-gray-500">
                      {editing ? (
                        <PhoneInput
                          required
                          value={editForm.phone}
                          onChange={(v) => setEditForm((f) => ({ ...f, phone: v }))}
                        />
                      ) : (
                        u.phone
                      )}
                    </td>
                    <td className="py-3 pr-4 text-gray-500">
                      {editing ? (
                        <PhoneInput
                          value={editForm.whatsapp}
                          onChange={(v) => setEditForm((f) => ({ ...f, whatsapp: v }))}
                          placeholder={editForm.phone}
                        />
                      ) : u.whatsapp ? (
                        <a
                          href={`https://wa.me/${u.whatsapp}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-green-600 hover:underline"
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
                        className="text-navy font-semibold hover:underline"
                      >
                        {u.productCount ?? 0}
                      </Link>
                    </td>
                    <td className="py-3 pr-4">
                      {u.isActive ? (
                        <span className="text-green-600 text-xs font-bold">● Active</span>
                      ) : (
                        <span className="text-gray-400 text-xs font-bold">● Disabled</span>
                      )}
                    </td>
                    <td className="py-3 pr-4 text-gray-500">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 pr-4">
                      {editing ? (
                        <div className="flex flex-col items-start gap-2">
                          <input
                            type="text"
                            value={editForm.newPassword}
                            onChange={(e) =>
                              setEditForm((f) => ({ ...f, newPassword: e.target.value }))
                            }
                            placeholder="New password (optional)"
                            minLength={6}
                            className="neu-inset w-40 px-2.5 py-1.5 text-xs focus:outline-none"
                          />
                          {editError && (
                            <span className="text-xs text-red-600">{editError}</span>
                          )}
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleSaveEdit(u)}
                              disabled={editSaving}
                              className="neu-pill bg-navy text-white text-xs font-semibold px-3 py-1.5 disabled:opacity-60"
                            >
                              {editSaving ? "Saving…" : "Save"}
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="neu-pill bg-surface text-gray-500 text-xs font-semibold px-3 py-1.5"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => startEdit(u)}
                            className="neu-pill bg-surface text-navy text-xs font-semibold px-3 py-1.5"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleToggleActive(u)}
                            className="neu-pill bg-surface text-navy text-xs font-semibold px-3 py-1.5"
                          >
                            {u.isActive ? "Disable" : "Enable"}
                          </button>
                          <button
                            onClick={() => handleDelete(u.id)}
                            className="neu-pill bg-surface text-red-500 text-xs font-semibold px-3 py-1.5"
                          >
                            Remove
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
