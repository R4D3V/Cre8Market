"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DashboardPanel } from "@/components/dashboard/DashboardPanel";
import PasswordInput from "@/components/PasswordInput";
import {
  changeMyPasswordAction,
  deleteMyAccountAction,
  fetchMyProfileAction,
  updateMyProfileAction,
} from "@/lib/actions/users";
import { compressImage } from "@/lib/imageCompress";
import { signOut } from "@/lib/auth-client";
import type { AppUser } from "@/lib/types";

// Shared profile editor for both parties: sellers use it from /dashboard/profile
// and buyers from /buyer/profile. Same fields, different panel chrome.
export function ProfilePanel({
  eyebrow,
  backHref,
  backLabel,
  showBanner = true,
  showWhatsapp = true,
}: {
  eyebrow?: string;
  backHref: string;
  backLabel: string;
  showBanner?: boolean;
  showWhatsapp?: boolean;
}) {
  const [profile, setProfile] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [avatar, setAvatar] = useState("");
  const [banner, setBanner] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [infoMsg, setInfoMsg] = useState("");
  const [infoError, setInfoError] = useState("");
  const [passMsg, setPassMsg] = useState("");
  const [passError, setPassError] = useState("");

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const router = useRouter();

  useEffect(() => {
    fetchMyProfileAction().then((data) => {
      setProfile(data);
      setName(data.name);
      setWhatsapp(data.whatsapp ?? "");
      setAvatar(data.avatar ?? "");
      setBanner(data.banner ?? "");
      setLoading(false);
    });
  }, []);

  async function handleAvatarUpload(file: File | null) {
    if (!file) return;
    try {
      const dataUrl = await compressImage(file, 400, 0.7);
      setAvatar(dataUrl);
    } catch {
      setInfoError("Could not read that image. Please try a different file.");
    }
  }

  async function handleBannerUpload(file: File | null) {
    if (!file) return;
    try {
      const dataUrl = await compressImage(file, 1200, 0.75);
      setBanner(dataUrl);
    } catch {
      setInfoError("Could not read that image. Please try a different file.");
    }
  }

  async function handleInfoSubmit(e: React.FormEvent) {
    e.preventDefault();
    setInfoMsg("");
    setInfoError("");
    try {
      const updated = await updateMyProfileAction({
        name,
        // Buyers don't use WhatsApp at all, so leave it out (the action clears
        // any value an older account still carries).
        whatsapp: showWhatsapp ? whatsapp : undefined,
        avatar: avatar || null,
        banner: showBanner ? banner || null : null,
      });
      setProfile(updated);
      setInfoMsg("Profile updated successfully!");
    } catch (err: unknown) {
      setInfoError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPassMsg("");
    setPassError("");
    try {
      await changeMyPasswordAction(currentPassword, newPassword);
      setPassMsg("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err: unknown) {
      setPassError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  async function handleDeleteAccount() {
    setDeleting(true);
    setDeleteError("");
    try {
      await deleteMyAccountAction();
      // The account (and its session) is gone, so signing out is best-effort.
      await signOut().catch(() => {});
      router.push("/");
      router.refresh();
    } catch (err: unknown) {
      setDeleteError(err instanceof Error ? err.message : "Something went wrong");
      setDeleting(false);
    }
  }

  if (loading) {
    return <div className="py-12 text-center text-sm text-muted-foreground">Loading…</div>;
  }

  return (
    <DashboardPanel
      eyebrow={eyebrow}
      title="My Profile"
      description={
        profile?.createdAt
          ? `Member since ${new Date(profile.createdAt).toLocaleDateString("en-UG", { year: "numeric", month: "long" })}`
          : undefined
      }
      action={
        <Link
          href={backHref}
          className="inline-flex items-center gap-2 rounded-xl bg-background px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/10"
        >
          ← {backLabel}
        </Link>
      }
    >
      {/* Info card */}
      <div className="mb-6 rounded-xl border border-border/70 bg-card/80 p-6">
        <h2 className="mb-4 font-bold text-foreground">Account Information</h2>
        <form onSubmit={handleInfoSubmit} className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary text-2xl font-bold text-primary-foreground">
              {avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatar} alt="Profile avatar" className="h-full w-full object-cover" />
              ) : (
                (name || profile?.name || "U")[0].toUpperCase()
              )}
            </div>
            <div className="flex flex-col gap-2">
              <label className="neu-pill cursor-pointer bg-background px-3 py-1.5 text-center text-xs font-semibold text-primary">
                📷 Upload Photo
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
                  className="text-xs font-semibold text-destructive"
                >
                  Remove Photo
                </button>
              )}
            </div>
          </div>

          {showBanner && (
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-muted-foreground">
                Banner Image (shown on your seller page)
              </label>
              {banner && (
                <div className="mb-2 overflow-hidden rounded-xl border border-border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={banner} alt="Profile banner" className="h-32 w-full object-cover" />
                </div>
              )}
              <div className="flex items-center gap-2">
                <label className="neu-pill cursor-pointer bg-background px-3 py-1.5 text-center text-xs font-semibold text-primary">
                  📷 Upload Banner
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleBannerUpload(e.target.files?.[0] ?? null)}
                  />
                </label>
                {banner && (
                  <button
                    type="button"
                    onClick={() => setBanner("")}
                    className="text-xs font-semibold text-destructive"
                  >
                    Remove Banner
                  </button>
                )}
              </div>
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-muted-foreground">
              Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="neu-inset w-full px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-muted-foreground">
              Phone Number
            </label>
            <input
              type="tel"
              disabled
              value={profile?.phone ?? ""}
              className="neu-inset w-full px-4 py-2.5 text-sm text-foreground opacity-60 placeholder:text-muted-foreground focus:outline-none"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Phone number is your login ID and cannot be changed.
            </p>
          </div>
          {showWhatsapp && (
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-muted-foreground">
                WhatsApp Number
              </label>
              <input
                type="tel"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="+256 700 000 000"
                className="neu-inset w-full px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                {showBanner
                  ? "Buyers will contact you on this number. Leave blank to use your phone number."
                  : "Sellers will contact you on this number. Leave blank to use your phone number."}
              </p>
            </div>
          )}

          {infoError && (
            <div className="rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {infoError}
            </div>
          )}
          {infoMsg && (
            <div className="rounded-xl border border-primary/40 bg-primary/10 px-4 py-3 text-sm text-primary">
              {infoMsg}
            </div>
          )}

          <button
            type="submit"
            className="neu-pill w-full bg-primary py-3 text-sm font-bold text-primary-foreground transition-all hover:bg-primary/90"
          >
            Save Changes
          </button>
        </form>
      </div>

      {/* Password card */}
      <div className="rounded-xl border border-border/70 bg-card/80 p-6">
        <h2 className="mb-4 font-bold text-foreground">Change Password</h2>
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-muted-foreground">
              Current Password
            </label>
            <PasswordInput
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="neu-inset w-full px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-muted-foreground">
              New Password
            </label>
            <PasswordInput
              required
              minLength={6}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Min 6 characters"
              className="neu-inset w-full px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
          </div>

          {passError && (
            <div className="rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {passError}
            </div>
          )}
          {passMsg && (
            <div className="rounded-xl border border-primary/40 bg-primary/10 px-4 py-3 text-sm text-primary">
              {passMsg}
            </div>
          )}

          <button
            type="submit"
            className="neu-pill w-full bg-primary py-3 text-sm font-bold text-primary-foreground transition-all hover:bg-primary/90"
          >
            Change Password
          </button>
        </form>
      </div>

      {/* Danger zone */}
      <div className="mt-6 rounded-xl border border-destructive/40 bg-destructive/5 p-6">
        <h2 className="mb-1 font-bold text-destructive">Delete Account</h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Permanently delete your account, profile and all your product listings. This cannot be
          undone.
        </p>

        {deleteError && (
          <div className="mb-4 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {deleteError}
          </div>
        )}

        {confirmDelete ? (
          <div className="space-y-3">
            <p className="text-sm font-semibold text-destructive">
              Are you sure? Your listings will be deleted too. This action cannot be undone.
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={deleting}
                className="neu-pill bg-destructive px-4 py-2 text-sm font-bold text-white transition-all hover:bg-destructive/90 disabled:opacity-60"
              >
                {deleting ? "Deleting…" : "Yes, delete my account"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setConfirmDelete(false);
                  setDeleteError("");
                }}
                disabled={deleting}
                className="neu-pill bg-background px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/10 disabled:opacity-60"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmDelete(true)}
            className="neu-pill bg-destructive px-4 py-2 text-sm font-bold text-white transition-all hover:bg-destructive/90"
          >
            Delete My Account
          </button>
        )}
      </div>
    </DashboardPanel>
  );
}
