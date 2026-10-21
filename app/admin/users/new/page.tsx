"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createUserByAdminAction } from "@/lib/actions/users";
import { PhoneInput, toFullNumber } from "@/components/PhoneInput";

export default function AdminNewUserPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    whatsapp: "",
    password: "",
    pin: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

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
      setSuccess(true);
      setTimeout(() => router.push("/admin/users"), 1200);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to add user");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold text-foreground font-heading">
          Add User
        </h1>
        <Link
          href="/admin/users"
          className="text-sm text-primary font-semibold hover:underline"
        >
          ← Back to Users
        </Link>
      </div>

      {success ? (
        <div className="neu-card p-8 text-center">
          <p className="text-4xl mb-3">✅</p>
          <h2 className="font-heading text-xl font-bold text-foreground mb-2">
            User added successfully
          </h2>
          <p className="text-muted-foreground text-sm">
            Redirecting back to users…
          </p>
        </div>
      ) : (
        <form onSubmit={handleCreate} className="neu-card p-5 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Full Name *
              </label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="neu-inset w-full px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                placeholder="Jane Doe"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Phone *
              </label>
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
                onChange={(e) =>
                  setForm((f) => ({ ...f, password: e.target.value }))
                }
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
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    pin: e.target.value.replace(/\D/g, ""),
                  }))
                }
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
      )}
    </div>
  );
}