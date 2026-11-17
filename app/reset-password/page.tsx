"use client";

import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  KeyRound,
  Loader2,
  LockKeyhole,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import PasswordInput from "@/components/PasswordInput";
import { PhoneInput, toFullNumber } from "@/components/PhoneInput";
import ScrollReveal from "@/components/ScrollReveal";
import { resetUserPasswordAction } from "@/lib/actions/auth";
import { getSession, signIn } from "@/lib/auth-client";

const FIELD_CLASS =
  "w-full rounded-xl border border-border/70 bg-muted/30 py-3 pl-10 pr-4 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/70 focus:border-primary/60 focus:bg-muted/50";

const STEPS = [
  {
    icon: Smartphone,
    title: "Confirm your number",
    description: "Use the phone number linked to your Cre8Market account.",
  },
  {
    icon: LockKeyhole,
    title: "Choose a new password",
    description: "At least 6 characters — avoid one you use elsewhere.",
  },
  {
    icon: ShieldCheck,
    title: "Verify with your pin",
    description: "Enter the 4-digit backup pin you set when registering.",
  },
];

export default function ResetPasswordPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
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
      await resetUserPasswordAction(toFullNumber(phone), password, pin);
      setMessage("Password reset successfully! You can now log in.");
      const result = await signIn({ phone, password, redirect: false });
      if (!result?.error) {
        const session = await getSession();
        if (session?.user?.role === "admin") {
          router.push("/admin");
        } else {
          router.push("/dashboard");
        }
        router.refresh();
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <Navbar />

      <main className="page-ambient relative overflow-hidden">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute -top-44 right-[-8%] h-[480px] w-[480px] rounded-full bg-primary/15 blur-[130px]" />
          <div className="absolute -left-36 top-16 h-[380px] w-[380px] rounded-full bg-secondary/20 blur-[120px]" />
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
              backgroundSize: "56px 56px",
              maskImage: "radial-gradient(ellipse 85% 65% at 50% 0%, black 25%, transparent 100%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 85% 65% at 50% 0%, black 25%, transparent 100%)",
            }}
          />
        </div>

        <div className="container relative py-10 pb-28 sm:py-14 sm:pb-14">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground transition hover:text-primary"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to sign in
          </Link>

          <div className="mt-7 grid gap-6 lg:grid-cols-12 lg:items-start">
            {/* Intro panel */}
            <ScrollReveal className="lg:col-span-5">
              <div className="relative overflow-hidden rounded-3xl border border-border/70 bg-card/70 p-6 backdrop-blur-sm sm:p-8">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-20 -top-24 h-56 w-56 rounded-full bg-primary/12 blur-[90px]"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -bottom-24 -left-16 h-48 w-48 rounded-full bg-secondary/15 blur-[90px]"
                />

                <div className="relative">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl border border-primary/25 bg-primary/10 text-primary">
                    <KeyRound className="h-5 w-5" />
                  </span>

                  <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.22em] text-primary/80">
                    Account recovery
                  </p>
                  <h1 className="mt-3 font-heading text-[2rem] font-extrabold leading-[1.08] tracking-[-0.03em] text-foreground sm:text-4xl">
                    Reset your password and{" "}
                    <span className="bg-gradient-to-r from-primary via-emerald-300 to-teal-200 bg-clip-text text-transparent">
                      get back to business.
                    </span>
                  </h1>
                  <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
                    Verify the phone number on your account, then set a new password. You&apos;ll be
                    signed in automatically once it&apos;s done.
                  </p>

                  <ul className="mt-7 space-y-3">
                    {STEPS.map(({ icon: Icon, title, description }) => (
                      <li
                        key={title}
                        className="flex items-start gap-3 rounded-2xl border border-border/50 bg-muted/20 p-3.5"
                      >
                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
                          <Icon className="h-4 w-4" />
                        </span>
                        <div>
                          <p className="text-sm font-bold text-foreground">{title}</p>
                          <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                            {description}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </ScrollReveal>

            {/* Form */}
            <ScrollReveal delay={100} className="lg:col-span-7">
              <div className="mx-auto w-full max-w-md lg:mr-0">
                <div className="relative overflow-hidden rounded-3xl border border-border/70 bg-card/80 p-6 backdrop-blur-sm sm:p-8">
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-primary/10 blur-[80px]"
                  />

                  <div className="relative">
                    <div className="mb-6 flex items-center gap-3 border-b border-border/60 pb-5">
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-primary/25 bg-primary/10 text-primary">
                        <KeyRound className="h-5 w-5" />
                      </span>
                      <div>
                        <h2 className="text-sm font-bold text-foreground">Reset your password</h2>
                        <p className="text-xs text-muted-foreground">
                          Enter your phone number, a new password, and your pin.
                        </p>
                      </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label
                          htmlFor="reset-phone"
                          className="mb-1.5 block text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground"
                        >
                          Phone number
                        </label>
                        <PhoneInput
                          id="reset-phone"
                          required
                          autoComplete="tel-national"
                          value={phone}
                          onChange={setPhone}
                          placeholder="700 000 000"
                          outerClassName="h-11"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="reset-password"
                          className="mb-1.5 block text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground"
                        >
                          New password
                        </label>
                        <div className="relative">
                          <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <PasswordInput
                            id="reset-password"
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
                          htmlFor="reset-pin"
                          className="mb-1.5 block text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground"
                        >
                          4-digit reset pin
                        </label>
                        <div className="relative">
                          <ShieldCheck className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <PasswordInput
                            id="reset-pin"
                            required
                            inputMode="numeric"
                            pattern="\d{4}"
                            maxLength={4}
                            value={pin}
                            onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                            placeholder="Pin from registration"
                            className={FIELD_CLASS}
                          />
                        </div>
                        <p className="mt-1.5 text-xs text-muted-foreground">
                          The verification pin you set when creating your account.
                        </p>
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
                          <>
                            Reset Password
                            <ArrowRight className="h-4 w-4" />
                          </>
                        )}
                      </button>
                    </form>

                    <div className="mt-5 space-y-2 border-t border-border/60 pt-5 text-center text-sm text-muted-foreground">
                      <p>
                        Remembered it?{" "}
                        <Link
                          href="/login"
                          className="font-bold text-primary transition hover:text-primary/80"
                        >
                          Sign in
                        </Link>
                      </p>
                      <p>
                        New to Cre8Market?{" "}
                        <Link
                          href="/register"
                          className="font-bold text-primary transition hover:text-primary/80"
                        >
                          Register free
                        </Link>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="relative mt-4 overflow-hidden rounded-3xl border border-primary/20 bg-primary/5 p-4">
                  <div className="relative flex items-start gap-3">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-primary/25 bg-primary/10 text-primary">
                      <ShieldCheck className="h-4 w-4" />
                    </span>
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      Never share your password or pin with anyone. Cre8Market staff will never ask
                      for them.
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
