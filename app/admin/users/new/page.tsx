"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Camera, CheckCircle2, ImagePlus } from "lucide-react";
import { createUserByAdminAction } from "@/lib/actions/users";
import { PhoneInput, toFullNumber } from "@/components/PhoneInput";
import { compressImage } from "@/lib/imageCompress";

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
  const [avatar, setAvatar] = useState("");
  const [banner, setBanner] = useState("");

  async function handleAvatarUpload(file: File | null) {
    if (!file) return;
    try {
      setAvatar(await compressImage(file, 400, 0.7));
      setError("");
    } catch {
      setError("Could not read that image. Please try a different file.");
    }
  }

  async function handleBannerUpload(file: File | null) {
    if (!file) return;
    try {
      setBanner(await compressImage(file, 1200, 0.75));
      setError("");
    } catch {
      setError("Could not read that image. Please try a different file.");
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
        avatar: avatar || null,
        banner: banner || null,
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
          <span className="mx-auto mb-3 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
            <CheckCircle2 className="h-6 w-6" />
          </span>
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

          <div className="rounded-xl border border-border/70 bg-muted/20 p-3">
            <p className="mb-3 text-xs font-bold uppercase tracking-wide text-muted-foreground">
              Profile media (optional)
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <p className="mb-2 text-xs font-semibold text-muted-foreground">
                  Profile photo
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary text-xl font-bold text-primary-foreground">
                    {avatar ? (
                      <img
                        src={avatar}
                        alt="Profile preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      (form.name || "U")[0].toUpperCase()
                    )}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-border/70 px-3 py-1.5 text-xs font-semibold text-primary transition hover:bg-primary/10">
                      <Camera className="h-3.5 w-3.5" />
                      {avatar ? "Change" : "Upload"}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          handleAvatarUpload(e.target.files?.[0] ?? null)
                        }
                      />
                    </label>
                    {avatar && (
                      <button
                        type="button"
                        onClick={() => setAvatar("")}
                        className="text-left text-[11px] font-semibold text-destructive hover:underline"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <p className="mb-2 text-xs font-semibold text-muted-foreground">
                  Seller page banner
                </p>
                {banner && (
                  <div className="mb-2 overflow-hidden rounded-lg border border-border">
                    <img
                      src={banner}
                      alt="Banner preview"
                      className="h-16 w-full object-cover"
                    />
                  </div>
                )}
                <div className="flex flex-wrap items-center gap-2">
                  <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-border/70 px-3 py-1.5 text-xs font-semibold text-primary transition hover:bg-primary/10">
                    <ImagePlus className="h-3.5 w-3.5" />
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
                      className="text-[11px] font-semibold text-destructive hover:underline"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </div>
            <p className="mt-2 text-[11px] text-muted-foreground">
              Shown on this seller&apos;s public profile. Wide images work best
              for banners.
            </p>
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