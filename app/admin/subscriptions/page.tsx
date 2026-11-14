"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  fetchAllSubscriptionPlansAction,
  upsertSubscriptionPlanAction,
  deleteSubscriptionPlanAction,
} from "@/lib/actions/subscriptions";
import type { SubscriptionPlan } from "@/lib/types";

const emptyForm = {
  name: "",
  price: "0",
  period: "Free Forever",
  features: "",
  highlight: false,
  icon: "user",
  sortOrder: "0",
  active: true,
};

export default function AdminSubscriptionsPage() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    const data = await fetchAllSubscriptionPlansAction();
    setPlans((data as SubscriptionPlan[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function startEdit(p: SubscriptionPlan) {
    setEditingId(p.id);
    setForm({
      name: p.name,
      price: String(p.price),
      period: p.period,
      features: p.features.join("\n"),
      highlight: p.highlight,
      icon: p.icon,
      sortOrder: String(p.sortOrder),
      active: p.active,
    });
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await upsertSubscriptionPlanAction({
        id: editingId ?? undefined,
        name: form.name.trim(),
        price: Number(form.price) || 0,
        period: form.period.trim(),
        features: form.features
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
        highlight: form.highlight,
        icon: form.icon,
        sortOrder: Number(form.sortOrder) || 0,
        active: form.active,
      });
      resetForm();
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save plan");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this plan?")) return;
    try {
      await deleteSubscriptionPlanAction(id);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete plan");
    }
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-extrabold text-foreground">
            Subscription Plans
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage seller subscription plans shown on /subscription.
          </p>
        </div>
        <Link
          href="/admin"
          className="text-sm text-primary font-semibold hover:underline"
        >
          ← Admin
        </Link>
      </div>

      {error && (
        <div className="mb-4 bg-destructive/10 border border-destructive/40 text-destructive text-sm rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      <form onSubmit={handleSave} className="neu-card p-5 mb-6 space-y-4">
        <h2 className="font-bold text-foreground text-sm">
          {editingId ? "Edit Plan" : "New Plan"}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
              Name
            </label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="neu-inset w-full px-3 py-2 text-sm text-foreground focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
              Price (UGX)
            </label>
            <input
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="neu-inset w-full px-3 py-2 text-sm text-foreground focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
              Period
            </label>
            <input
              value={form.period}
              onChange={(e) => setForm({ ...form, period: e.target.value })}
              className="neu-inset w-full px-3 py-2 text-sm text-foreground focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
              Icon
            </label>
            <select
              value={form.icon}
              onChange={(e) => setForm({ ...form, icon: e.target.value })}
              className="neu-inset w-full px-3 py-2 text-sm text-foreground focus:outline-none"
            >
              <option value="user">user</option>
              <option value="star">star</option>
              <option value="rocket">rocket</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
              Sort order
            </label>
            <input
              type="number"
              value={form.sortOrder}
              onChange={(e) => setForm({ ...form, sortOrder: e.target.value })}
              className="neu-inset w-full px-3 py-2 text-sm text-foreground focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-4 pt-6">
            <label className="flex items-center gap-2 text-sm text-foreground">
              <input
                type="checkbox"
                checked={form.highlight}
                onChange={(e) => setForm({ ...form, highlight: e.target.checked })}
              />
              Highlight
            </label>
            <label className="flex items-center gap-2 text-sm text-foreground">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) => setForm({ ...form, active: e.target.checked })}
              />
              Active
            </label>
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
            Features (one per line)
          </label>
          <textarea
            rows={4}
            value={form.features}
            onChange={(e) => setForm({ ...form, features: e.target.value })}
            className="neu-inset w-full px-3 py-2 text-sm text-foreground focus:outline-none resize-none"
          />
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={saving}
            className="neu-pill bg-primary text-primary-foreground font-bold px-5 py-2 text-sm transition-all disabled:opacity-60"
          >
            {saving ? "Saving…" : editingId ? "Update Plan" : "Create Plan"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="neu-pill bg-muted text-foreground font-bold px-5 py-2 text-sm transition-all"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {loading ? (
        <p className="text-muted-foreground text-sm">Loading…</p>
      ) : (
        <div className="space-y-3">
          {plans.map((p) => (
            <div
              key={p.id}
              className="neu-card p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-foreground">{p.name}</span>
                  {p.highlight && (
                    <span className="text-[10px] font-bold uppercase tracking-wide bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                      Highlight
                    </span>
                  )}
                  {!p.active && (
                    <span className="text-[10px] font-bold uppercase tracking-wide bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                      Inactive
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {p.price === 0 ? "UGX 0" : `UGX ${p.price.toLocaleString()}`} · {p.period}
                </p>
                <ul className="text-xs text-muted-foreground mt-1 space-y-0.5">
                  {p.features.map((f) => (
                    <li key={f}>• {f}</li>
                  ))}
                </ul>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => startEdit(p)}
                  className="neu-pill bg-background text-primary text-xs font-semibold px-3 py-1.5 transition-all"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="neu-pill bg-background text-destructive text-xs font-semibold px-3 py-1.5 transition-all"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}