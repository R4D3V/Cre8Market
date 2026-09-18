"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  fetchUserByIdAction,
  updateUserByAdminAction,
  setUserActiveAction,
  setUserVerifiedAction,
  setUserAdminAction,
  resetUserPasswordByAdminAction,
} from "@/lib/actions/users";
import { AdminPanel } from "@/components/admin/AdminPanel";
import { PhoneInput, toLocalPart, toFullNumber } from "@/components/PhoneInput";
import { compressImage } from "@/lib/imageCompress";
import type { AppUser } from "@/lib/types";

function Toggle({
  checked,
  onChange,
  onLabel,
  offLabel,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  onLabel: string;
  offLabel: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition-all ${
        checked
          ? "bg-primary/10 text-primary"
          : "bg-muted text-muted-foreground hover:bg-muted/70"
      }`}
    >
      <span
        className={`size-2 rounded-full ${checked ? "bg-primary" : "bg-muted-foreground"}`}
      />
      {checked ? onLabel : offLabel}
    </button>
  );
}

export default function EditUserPage() {
  const { id } = useParams();
  const router = useRouter();
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState({ name: "", phone: "", whatsapp: "" });
  const [avatar, setAvatar] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetchUserByIdAction(id as string)
      .then((u) => {
        if (!u) {
          router.push("/admin/users");
          return;
        }
        setUser(u);
        setForm({
          name: u.name,
          phone: toLocalPart(u.phone),
          whatsapp: toLocalPart(u.whatsapp ?? ""),
        });
        setAvatar(u.avatar ?? "");
        setIsActive(u.isActive);
        setIsVerified(u.isVerified);
        setIsAdmin(u.isAdmin);
        setLoading(false);
      })
      .catch(() => router.push("/admin/users"));
  }, [id, router]);

  async function handleAvatarUpload(file: File | null) {
    if (!file) return;
    try {
      const dataUrl = await compressImage(file, 400, 0.7);
      setAvatar(dataUrl);
      setError("");
    } catch {
      setError("Could not read that image. Please try a different file.");
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSaved(false);

    try {
      await updateUserByAdminAction(id as string, {
        name: form.name,
        phone: toFullNumber(form.phone),
        whatsapp: form.whatsapp ? toFullNumber(form.whatsapp) : undefined,
        avatar: avatar || null,
      });

      if (isActive !== user?.isActive) {
        await setUserActiveAction(id as string, isActive);
      }
      if (isVerified !== user?.isVerified) {
        await setUserVerifiedAction(id as string, isVerified);
      }
      if (isAdmin !== user?.isAdmin) {
        await setUserAdminAction(id as string, isAdmin);
      }
      if (newPassword) {
        await resetUserPasswordByAdminAction(id as string, newPassword);
      }

      setNewPassword("");
      setSaved(true);
      await fetchUserByIdAction(id as string).then((u) => {
        if (u) setUser(u);
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save changes");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="text-center py-12 text-muted-foreground text-sm">Loading…</div>;
  }

  const initial = (form.name || user?.name || "U")[0].toUpperCase();

  return (
    <AdminPanel
      title="Edit User"
      description={
        user
          ? `${user.name} · joined ${new Date(user.createdAt).toLocaleDateString()} · ${
              user.productCount ?? 0
            } product${(user.productCount ?? 0) === 1 ? "" : "s"}`
          : "Update this user's account"
      }
      action={
        <Link
          href="/admin/users"
          className="inline-flex items-center gap-2 rounded-xl bg-background px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/10"
        >
          ← Back to Users
        </Link>
      }
    >
      <form onSubmit={handleSave} className="space-y-8">
        {/* Avatar */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-muted-foreground">
            Profile Photo
          </label>
          <div className="flex items-center gap-5">
            <div className="flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-muted text-3xl font-bold text-muted-foreground">
              {avatar ? (
                <img src={avatar} alt="Avatar" className="h-full w-full object-cover" />
              ) : (
                initial
              )}
            </div>
            <div className="flex flex-col gap-2">
              <label className="cursor-pointer rounded-xl border border-border px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/10">
                {avatar ? "Change photo" : "Upload photo"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleAvatarUpload(e.target.files?.[0] ?? null)}
                />
              </label>
              {avatar && (
                <button
                  type="button"
                  onClick={() => setAvatar("")}
                  className="text-left text-sm font-semibold text-destructive hover:underline"
                >
                  Remove photo
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Personal details */}
        <div>
          <h2 className="mb-3 font-heading text-lg font-bold text-foreground">Personal Details</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-muted-foreground">
                Full Name *
              </label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="neu-inset w-full px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-muted-foreground">
                Phone *
              </label>
              <PhoneInput
                required
                value={form.phone}
                onChange={(v) => setForm((f) => ({ ...f, phone: v }))}
                placeholder="700000000"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-muted-foreground">
                WhatsApp (optional)
              </label>
              <PhoneInput
                value={form.whatsapp}
                onChange={(v) => setForm((f) => ({ ...f, whatsapp: v }))}
                placeholder={form.phone}
              />
            </div>
          </div>
        </div>

        {/* Account status */}
        <div>
          <h2 className="mb-3 font-heading text-lg font-bold text-foreground">Account Status</h2>
          <div className="flex flex-wrap items-center gap-3">
            <Toggle
              checked={isActive}
              onChange={setIsActive}
              onLabel="● Active"
              offLabel="○ Disabled"
            />
            <Toggle
              checked={isVerified}
              onChange={setIsVerified}
              onLabel="✓ Verified Seller"
              offLabel="○ Not Verified"
            />
            <Toggle
              checked={isAdmin}
              onChange={setIsAdmin}
              onLabel="★ Admin"
              offLabel="○ Regular User"
            />
          </div>
          {isAdmin && (
            <p className="mt-3 text-xs text-muted-foreground">
              Making this user an admin grants them access to the admin panel.
            </p>
          )}
        </div>

        {/* Security */}
        <div>
          <h2 className="mb-3 font-heading text-lg font-bold text-foreground">
            Security
          </h2>
          <div className="max-w-md">
            <label className="mb-1.5 block text-sm font-semibold text-muted-foreground">
              New Password (optional — leave blank to keep current)
            </label>
            <input
              type="text"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="At least 6 characters"
              minLength={6}
              className="neu-inset w-full px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
          </div>
        </div>

        {error && (
          <div className="bg-destructive/10 border border-destructive/40 text-destructive text-sm rounded-xl px-4 py-3">
            {error}
          </div>
        )}
        {saved && (
          <div className="bg-primary/10 border border-primary/40 text-primary text-sm rounded-xl px-4 py-3">
            Changes saved successfully.
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="neu-pill bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-6 py-2.5 text-sm transition-all disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save Changes"}
          </button>
          <Link
            href="/admin/users"
            className="text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
          >
            Cancel
          </Link>
        </div>
      </form>
    </AdminPanel>
  );
}