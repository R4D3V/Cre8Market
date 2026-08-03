"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  fetchCategoriesAction,
  createCategoryAction,
  updateCategoryAction,
  deleteCategoryAction,
} from "@/lib/actions/categories";

interface Cat {
  id: string;
  name: string;
  slug: string;
  icon: string;
  color: string;
  bg_color: string;
}

const defaultColors = [
  { color: "#3b82f6", bg: "#eff6ff" },
  { color: "#8b5cf6", bg: "#f5f3ff" },
  { color: "#6366f1", bg: "#eef2ff" },
  { color: "#10b981", bg: "#ecfdf5" },
  { color: "#f59e0b", bg: "#fffbeb" },
  { color: "#ec4899", bg: "#fdf2f8" },
  { color: "#6b7280", bg: "#f9fafb" },
  { color: "#ef4444", bg: "#fef2f2" },
  { color: "#f97316", bg: "#fff7ed" },
  { color: "#64748b", bg: "#f8fafc" },
  { color: "#f43f5e", bg: "#fff1f2" },
  { color: "#7c3aed", bg: "#f5f3ff" },
  { color: "#22c55e", bg: "#f0fdf4" },
];

export default function AdminCategoriesPage() {
  const [cats, setCats] = useState<Cat[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", slug: "", icon: "📦", color: "#64748b", bg_color: "#f8fafc" });
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const data = await fetchCategoriesAction();
    setCats((data as Cat[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  function slugify(t: string) {
    return t.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim();
  }

  function resetForm() {
    setForm({ name: "", slug: "", icon: "📦", color: "#64748b", bg_color: "#f8fafc" });
    setEditing(null);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const payload = { ...form, slug: form.slug || slugify(form.name) };
    if (editing) {
      await updateCategoryAction(editing, payload);
    } else {
      await createCategoryAction(payload);
    }
    setSaving(false);
    resetForm();
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this category?")) return;
    await deleteCategoryAction(id);
    load();
  }

  function startEdit(c: Cat) {
    setForm({ name: c.name, slug: c.slug, icon: c.icon, color: c.color, bg_color: c.bg_color });
    setEditing(c.id);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900">Categories</h1>
        <Link
          href="/admin"
          className="text-sm text-navy font-semibold hover:underline"
        >
          ← Back to Dashboard
        </Link>
      </div>

      {/* Form */}
      <form onSubmit={handleSave} className="neu-card p-5 max-w-xl mb-8 space-y-3">
        <h2 className="font-bold text-gray-900">
          {editing ? "Edit Category" : "Add Category"}
        </h2>
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="block text-xs font-semibold text-gray-500 mb-1">Name</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value, slug: editing ? f.slug : slugify(e.target.value) }))}
              className="neu-inset w-full px-3 py-2 text-sm focus:outline-none"
              placeholder="Electronics"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs font-semibold text-gray-500 mb-1">Slug</label>
            <input
              required
              value={form.slug}
              onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
              className="neu-inset w-full px-3 py-2 text-sm focus:outline-none font-mono"
              placeholder="electronics"
            />
          </div>
        </div>
        <div className="flex gap-3">
          <div className="w-20">
            <label className="block text-xs font-semibold text-gray-500 mb-1">Icon</label>
            <input
              value={form.icon}
              onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))}
              className="neu-inset w-full px-3 py-2 text-sm text-center focus:outline-none"
              placeholder="📦"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs font-semibold text-gray-500 mb-1">Color</label>
            <input
              value={form.color}
              onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))}
              className="neu-inset w-full px-3 py-2 text-sm focus:outline-none font-mono"
              placeholder="#64748b"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs font-semibold text-gray-500 mb-1">BG Color</label>
            <input
              value={form.bg_color}
              onChange={(e) => setForm((f) => ({ ...f, bg_color: e.target.value }))}
              className="neu-inset w-full px-3 py-2 text-sm focus:outline-none font-mono"
              placeholder="#f8fafc"
            />
          </div>
        </div>
        {/* Quick color picker */}
        <div className="flex flex-wrap gap-1.5">
          {defaultColors.map((dc) => (
            <button
              key={dc.color}
              type="button"
              onClick={() => setForm((f) => ({ ...f, color: dc.color, bg_color: dc.bg }))}
              className="w-6 h-6 rounded-full border border-gray-200"
              style={{ backgroundColor: dc.color }}
              title={`${dc.color} / ${dc.bg}`}
            />
          ))}
        </div>
        <div className="flex items-center gap-3 pt-1">
          <button
            type="submit"
            disabled={saving}
            className="neu-pill bg-navy text-white font-bold px-5 py-2 text-sm disabled:opacity-60"
          >
            {saving ? "Saving…" : editing ? "Update" : "Add Category"}
          </button>
          {editing && (
            <button type="button" onClick={resetForm} className="text-sm text-gray-500 hover:text-gray-700">
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* List */}
      {loading ? (
        <p className="text-center text-gray-500 text-sm py-8">Loading…</p>
      ) : cats.length === 0 ? (
        <p className="text-center text-gray-400 text-sm py-8">No categories yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-400 text-xs uppercase tracking-wide">
                <th className="pb-3 pr-4 font-semibold">Icon</th>
                <th className="pb-3 pr-4 font-semibold">Name</th>
                <th className="pb-3 pr-4 font-semibold">Slug</th>
                <th className="pb-3 pr-4 font-semibold">Colors</th>
                <th className="pb-3 pr-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {cats.map((c) => (
                <tr key={c.id} className="border-t border-gray-100">
                  <td className="py-3 pr-4 text-xl">{c.icon}</td>
                  <td className="py-3 pr-4 font-semibold text-gray-900">{c.name}</td>
                  <td className="py-3 pr-4 text-gray-500 font-mono text-xs">{c.slug}</td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full border" style={{ backgroundColor: c.color }} />
                      <span className="w-5 h-5 rounded-full border" style={{ backgroundColor: c.bg_color }} />
                    </div>
                  </td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => startEdit(c)}
                        className="neu-pill bg-surface text-navy text-xs font-semibold px-3 py-1.5"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="neu-pill bg-surface text-red-500 text-xs font-semibold px-3 py-1.5"
                      >
                        Delete
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
