"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  fetchMyProfileAction,
  updateMyProfileAction,
  changeMyPasswordAction,
} from "@/lib/actions/users";
import { compressImage } from "@/lib/imageCompress";
import type { AppUser } from "@/lib/types";

export default function ProfilePage() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [avatar, setAvatar] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [infoMsg, setInfoMsg] = useState("");
  const [infoError, setInfoError] = useState("");
  const [passMsg, setPassMsg] = useState("");
  const [passError, setPassError] = useState("");

  useEffect(() => {
    fetchMyProfileAction().then((data) => {
      setProfile(data);
      setName(data.name);
      setWhatsapp(data.whatsapp ?? "");
      setAvatar(data.avatar ?? "");
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

  async function handleInfoSubmit(e: React.FormEvent) {
    e.preventDefault();
    setInfoMsg("");
    setInfoError("");
    try {
      const updated = await updateMyProfileAction({ name, whatsapp, avatar: avatar || null });
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

  if (loading) {
    return <div className="text-center py-12 text-muted-foreground text-sm">Loading…</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-2xl font-extrabold text-foreground">My Profile</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Member since {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString("en-UG", { year: "numeric", month: "long" }) : "—"}
          </p>
        </div>
        <Link
          href="/dashboard"
          className="neu-pill bg-background text-primary text-sm font-semibold px-4 py-2 transition-all"
        >
          ← Back to Dashboard
        </Link>
      </div>

      {/* Info card */}
      <div className="bg-card border border-border rounded-xl p-6 mb-6">
        <h2 className="font-bold text-foreground mb-4">Account Information</h2>
        <form onSubmit={handleInfoSubmit} className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-2xl shrink-0 overflow-hidden">
              {avatar ? (
                <img src={avatar} alt="Profile avatar" className="w-full h-full object-cover" />
              ) : (
                (name || profile?.name || "U")[0].toUpperCase()
              )}
            </div>
            <div className="flex flex-col gap-2">
              <label className="neu-pill bg-background text-primary text-xs font-semibold px-3 py-1.5 cursor-pointer text-center">
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
                  className="text-xs text-destructive font-semibold"
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
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="neu-inset w-full px-4 py-2.5 text-sm focus:outline-none text-foreground placeholder:text-muted-foreground"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-muted-foreground mb-1.5">
              Phone Number
            </label>
            <input
              type="tel"
              disabled
              value={profile?.phone ?? ""}
              className="neu-inset w-full px-4 py-2.5 text-sm focus:outline-none text-foreground opacity-60"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Phone number is your login ID and cannot be changed.
            </p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-muted-foreground mb-1.5">
              WhatsApp Number
            </label>
            <input
              type="tel"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="+256 700 000 000"
              className="neu-inset w-full px-4 py-2.5 text-sm focus:outline-none text-foreground placeholder:text-muted-foreground"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Buyers will contact you on this number. Leave blank to use your phone number.
            </p>
          </div>

          {infoError && (
            <div className="bg-destructive/10 border border-destructive/40 text-destructive text-sm rounded-xl px-4 py-3">
              {infoError}
            </div>
          )}
          {infoMsg && (
            <div className="bg-primary/10 border border-primary/40 text-primary text-sm rounded-xl px-4 py-3">
              {infoMsg}
            </div>
          )}

          <button
            type="submit"
            className="neu-pill w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 text-sm transition-all"
          >
            Save Changes
          </button>
        </form>
      </div>

      {/* Password card */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="font-bold text-foreground mb-4">Change Password</h2>
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-muted-foreground mb-1.5">
              Current Password
            </label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="neu-inset w-full px-4 py-2.5 text-sm focus:outline-none text-foreground placeholder:text-muted-foreground"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-muted-foreground mb-1.5">
              New Password
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Min 6 characters"
              className="neu-inset w-full px-4 py-2.5 text-sm focus:outline-none text-foreground placeholder:text-muted-foreground"
            />
          </div>

          {passError && (
            <div className="bg-destructive/10 border border-destructive/40 text-destructive text-sm rounded-xl px-4 py-3">
              {passError}
            </div>
          )}
          {passMsg && (
            <div className="bg-primary/10 border border-primary/40 text-primary text-sm rounded-xl px-4 py-3">
              {passMsg}
            </div>
          )}

          <button
            type="submit"
            className="neu-pill w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 text-sm transition-all"
          >
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
}
