"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  KeyRound,
  Loader2,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { resetAdminPasswordAction } from "@/lib/actions/auth";
import PasswordInput from "@/components/PasswordInput";

const FIELD_CLASS =
  "w-full rounded-xl border border-border/70 bg-muted/30 py-3 pl-10 pr-4 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/70 focus:border-primary/60 focus:bg-muted/50";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      await resetAdminPasswordAction(email, password, pin);
      setMessage("Password reset successfully! You can now log in.");
      setEmail("");
      setPassword("");
      setPin("");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-[75vh] items-center justify-center overflow-hidden px-4 py-12 pb-28 sm:pb-12">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 right-[-6%] h-[420px] w-[420px] rounded-full bg-primary/12 blur-[120px]" />
        <div className="absolute -left-28 bottom-0 h-[320px] w-[320px] rounded-full bg-secondary/15 blur-[110px]" />
      </div>

      <div className="relative w-full max-w-md">
        <Link
          href="/admin/login"
          className="mb-6 inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground transition hover:text-primary"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to admin login
        </Link>

        <div className="text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-primary/25 bg-primary/10 text-primary">
            <KeyRound className="h-6 w-6" />
          </span>
          <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.22em] text-primary/80">
            Admin · Account recovery
          </p>
          <h1 className="mt-2 font-heading text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            Reset Admin Password
          </h1>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
            Enter your admin email, a new password, and your backup pin.
          </p>
        </div>

        <div className="relative mt-7 overflow-hidden rounded-3xl border border-border/70 bg-card/80 p-6 backdrop-blur-sm sm:p-8">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-primary/10 blur-[80px]"
          />

          <div className="relative">
            <div className="mb-6 flex items-center gap-3 border-b border-border/60 pb-5">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-primary/25 bg-primary/10 text-primary">
                <ShieldCheck className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-sm font-bold text-foreground">
                  Verify your identity
                </h2>
                <p className="text-xs text-muted-foreground">
                  Your backup pin confirms the request.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="admin-reset-email"
                  className="mb-1.5 block text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground"
                >
                  Admin email
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="admin-reset-email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@cre8market.com"
                    className={FIELD_CLASS}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="admin-reset-password"
                  className="mb-1.5 block text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground"
                >
                  New password
                </label>
                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <PasswordInput
                    id="admin-reset-password"
                    required
                    minLength={6}
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className={FIELD_CLASS}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="admin-reset-pin"
                  className="mb-1.5 block text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground"
                >
                  Backup pin
                </label>
                <div className="relative">
                  <ShieldCheck className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <PasswordInput
                    id="admin-reset-pin"
                    required
                    inputMode="numeric"
                    maxLength={4}
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder="Enter backup pin"
                    className={FIELD_CLASS}
                  />
                </div>
              </div>

              {error && (
                <div
                  role="alert"
                  className="flex items-start gap-2.5 rounded-2xl border border-destructive/40 bg-destructive/10 p-3.5 text-sm text-destructive"
                >
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {message && (
                <div className="flex items-start gap-2.5 rounded-2xl border border-primary/40 bg-primary/10 p-3.5 text-sm text-primary">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{message}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3.5 text-sm font-bold text-primary-foreground shadow-[0_18px_40px_-22px_rgba(109,232,124,0.9)] transition hover:bg-primary/90 disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Resetting…
                  </>
                ) : (
                  "Reset Password"
                )}
              </button>
            </form>

            <div className="mt-5 border-t border-border/60 pt-5 text-center text-sm text-muted-foreground">
              <Link
                href="/admin/login"
                className="font-bold text-primary transition hover:text-primary/80"
              >
                Back to admin login
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-start gap-3 rounded-2xl border border-border/60 bg-muted/20 p-3.5">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
            <ShieldCheck className="h-4 w-4" />
          </span>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Admin recovery requires the backup pin issued with the account. If
            you don&apos;t have it, contact the site owner.
          </p>
        </div>
      </div>
    </div>
  );
}
