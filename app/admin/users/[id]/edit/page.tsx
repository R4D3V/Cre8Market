"use client";

import { type ReactNode, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ImagePlus, Star } from "lucide-react";
import {
  fetchUserByIdAction,
  updateUserByAdminAction,
  setUserActiveAction,
  setUserPlanAction,
  setUserAdminAction,
  resetUserPasswordByAdminAction,
} from "@/lib/actions/users";
import {
  fetchAllSubscriptionPlansAction,
  assignSubscriptionAction,
  fetchUserSubscriptionAction,
} from "@/lib/actions/subscriptions";
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
  onLabel: ReactNode;
  offLabel: ReactNode;
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

function planIdFor(
  user: AppUser,
  planList: { id: string; name: string }[],
): string {
  const tier = user.isVip ? "Premium" : user.isVerified ? "Standard" : "Free";
  return (
    planList.find((p) => p.name.toLowerCase() === tier.toLowerCase())?.id ?? ""
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
  const [banner, setBanner] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [isVip, setIsVip] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [plans, setPlans] = useState<{ id: string; name: string }[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState("");
  const [expiresAt, setExpiresAt] = useState("");

  const currentPlan = isVip ? "Premium" : isVerified ? "Standard" : "Free";

  useEffect(() => {
    let active = true;

    Promise.all([
      fetchUserByIdAction(id as string),
      fetchAllSubscriptionPlansAction().catch(
        () => [] as { id: string; name: string }[],
      ),
      fetchUserSubscriptionAction(id as string).catch(() => null),
    ])
      .then(([u, planData, s]) => {
        if (!active) return;
        if (!u) {
          router.push("/admin/users");
          return;
        }
        const planList = (planData as { id: string; name: string }[]) ?? [];
        setUser(u);
        setForm({
          name: u.name,
          phone: toLocalPart(u.phone),
          whatsapp: toLocalPart(u.whatsapp ?? ""),
        });
        setAvatar(u.avatar ?? "");
        setBanner(u.banner ?? "");
        setIsActive(u.isActive);
        setIsVerified(u.isVerified);
        setIsVip(u.isVip ?? false);
        setIsAdmin(u.isAdmin);
        setPlans(planList);
        // The Standard / Premium switches are the canonical plan, so the Plan
        // dropdown follows them rather than a stale subscription record.
        setSelectedPlanId(planIdFor(u, planList));
        if (s?.expiresAt) setExpiresAt(s.expiresAt.slice(0, 10));
        setLoading(false);
      })
      .catch(() => router.push("/admin/users"));

    return () => {
      active = false;
    };
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

  async function handleBannerUpload(file: File | null) {
    if (!file) return;
    try {
      const dataUrl = await compressImage(file, 1200, 0.75);
      setBanner(dataUrl);
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
        banner: banner || null,
      });

      if (isActive !== user?.isActive) {
        await setUserActiveAction(id as string, isActive);
      }

      const initialPlan = user?.isVip
        ? "Premium"
        : user?.isVerified
          ? "Standard"
          : "Free";
      const nextPlan = isVip
        ? "Premium"
        : isVerified
          ? "Standard"
          : "Free";
      if (nextPlan !== initialPlan) {
        await setUserPlanAction(id as string, nextPlan);
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
        if (u) {
          setUser(u);
          setIsVerified(u.isVerified);
          setIsVip(u.isVip ?? false);
          setSelectedPlanId(planIdFor(u, plans));
        }
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
              <label className="cursor-pointer rounded-xl border border-border/70 px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/10">
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

        {/* Banner */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-muted-foreground">
            Seller Page Banner
          </label>
          <p className="mb-3 text-xs text-muted-foreground">
            Displayed at the top of this seller&apos;s public profile. Wide
            images work best.
          </p>
          {banner && (
            <div className="mb-3 overflow-hidden rounded-2xl border border-border/70">
              <img
                src={banner}
                alt="Seller page banner"
                className="h-28 w-full object-cover"
              />
            </div>
          )}
          <div className="flex flex-wrap items-center gap-3">
            <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-border/70 px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/10">
              <ImagePlus className="h-4 w-4" />
              {banner ? "Change banner" : "Upload banner"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) =>
                  handleBannerUpload(e.target.files?.[0] ?? null)
                }
              />
            </label>
            {banner && (
              <button
                type="button"
                onClick={() => setBanner("")}
                className="text-sm font-semibold text-destructive hover:underline"
              >
                Remove banner
              </button>
            )}
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
              checked={isVerified && !isVip}
              onChange={(on) => {
                setIsVerified(on);
                if (on) setIsVip(false);
              }}
              onLabel="✦ Standard Plan"
              offLabel="○ Standard off"
            />
            <Toggle
              checked={isVip}
              onChange={(on) => {
                setIsVip(on);
                if (on) setIsVerified(true);
              }}
              onLabel="★ Premium Plan"
              offLabel="○ Premium off"
            />
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Current plan:{" "}
            <span className="font-semibold text-foreground">{currentPlan}</span>
            {" · "}Standard adds verified status, Premium adds VIP perks.
          </p>
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