"use client";

import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Loader2,
  LockKeyhole,
  LogIn,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import PasswordInput from "@/components/PasswordInput";
import { PhoneInput, toFullNumber } from "@/components/PhoneInput";
import ScrollReveal from "@/components/ScrollReveal";
import { getSession, signIn } from "@/lib/auth-client";

const FIELD_CLASS =
  "w-full rounded-xl border border-border/70 bg-muted/30 py-3 pl-10 pr-4 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/70 focus:border-primary/60 focus:bg-muted/50";

const BENEFITS = [
  {
    icon: ShieldCheck,
    title: "Secure access",
    description: "Your account, listings, and messages stay protected.",
  },
  {
    icon: MessageCircle,
    title: "Direct conversations",
    description: "Chat with buyers and sellers on WhatsApp without middlemen.",
  },
  {
    icon: Zap,
    title: "Fresh local deals",
    description: "New listings from around Entebbe land every day.",
  },
];

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn({
      phone: toFullNumber(phone),
      password,
      redirect: false,
    });

    if (result?.error) {
      const message = result.error.message ?? "";
      const status = result.error.status;
      if (status === 403 || /origin|forbidden/i.test(message)) {
        setError(
          "Sign-in is blocked for this domain. Please try again from the site's main address.",
        );
      } else if ((status && status >= 500) || /internal server error|fetch failed/i.test(message)) {
        // The account may be perfectly valid — don't blame the credentials.
        setError("The server could not complete sign-in. Please try again in a moment.");
      } else {
        setError("Invalid phone number or password. Try registering a new account.");
      }
      setLoading(false);
      return;
    }

    const session = await getSession();
    // Honour ?next= (e.g. "Message Seller" sent a logged-out visitor here).
    // Only same-site paths, and every dashboard layout re-checks the role, so
    // a wrong destination just bounces to the right home base.
    const next = new URLSearchParams(window.location.search).get("next");
    if (next && next.startsWith("/") && !next.startsWith("//")) {
      router.push(next);
    } else if (session?.user?.role === "admin") {
      router.push("/admin");
    } else if (session?.user?.role === "buyer") {
      router.push("/buyer");
    } else {
      router.push("/dashboard");
    }
    router.refresh();
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
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground transition hover:text-primary"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to home
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
                    <LogIn className="h-5 w-5" />
                  </span>

                  <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.22em] text-primary/80">
                    Welcome back
                  </p>
                  <h1 className="mt-3 font-heading text-[2rem] font-extrabold leading-[1.08] tracking-[-0.03em] text-foreground sm:text-4xl">
                    Sign in and keep the{" "}
                    <span className="bg-gradient-to-r from-primary via-emerald-300 to-teal-200 bg-clip-text text-transparent">
                      deals moving.
                    </span>
                  </h1>
                  <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
                    Pick up where you left off — manage your listings, reply to buyers, and discover
                    fresh finds across Entebbe.
                  </p>

                  <ul className="mt-7 space-y-3">
                    {BENEFITS.map(({ icon: Icon, title, description }) => (
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

                  <div className="mt-6 flex items-center gap-2 text-[11px] text-muted-foreground">
                    <BadgeCheck className="h-3.5 w-3.5 text-primary" />
                    Trusted by local buyers and sellers
                  </div>
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
                        <ShieldCheck className="h-5 w-5" />
                      </span>
                      <div>
                        <h2 className="text-sm font-bold text-foreground">
                          Sign in to your account
                        </h2>
                        <p className="text-xs text-muted-foreground">
                          Use the phone number linked to your account.
                        </p>
                      </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label
                          htmlFor="login-phone"
                          className="mb-1.5 block text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground"
                        >
                          Phone number
                        </label>
                        <PhoneInput
                          id="login-phone"
                          required
                          autoComplete="tel-national"
                          value={phone}
                          onChange={setPhone}
                          placeholder="700 000 000"
                          outerClassName="h-11"
                        />
                      </div>

                      <div>
                        <div className="mb-1.5 flex items-center justify-between gap-3">
                          <label
                            htmlFor="login-password"
                            className="block text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground"
                          >
                            Password
                          </label>
                          <Link
                            href="/reset-password"
                            className="text-[11px] font-semibold text-primary transition hover:text-primary/80"
                          >
                            Forgot password?
                          </Link>
                        </div>
                        <div className="relative">
                          <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <PasswordInput
                            id="login-password"
                            required
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
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

                      <button
                        type="submit"
                        disabled={loading}
                        className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3.5 text-sm font-bold text-primary-foreground shadow-[0_18px_40px_-22px_rgba(109,232,124,0.9)] transition hover:bg-primary/90 disabled:opacity-60"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Signing in…
                          </>
                        ) : (
                          <>
                            Sign In
                            <ArrowRight className="h-4 w-4" />
                          </>
                        )}
                      </button>
                    </form>

                    <div className="mt-5 border-t border-border/60 pt-5 text-center">
                      <p className="text-sm text-muted-foreground">
                        Don&apos;t have an account?{" "}
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

                {/* WhatsApp hint */}
                <div className="relative mt-4 overflow-hidden rounded-3xl border border-wa/25 bg-wa/5 p-4">
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-10 -top-12 h-32 w-32 rounded-full bg-wa/15 blur-[55px]"
                  />
                  <div className="relative flex flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
                    <div className="flex items-center gap-3">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-wa/30 bg-wa/10 text-wa">
                        <MessageCircle className="h-4 w-4" />
                      </span>
                      <div>
                        <p className="text-xs font-bold text-foreground">
                          Prefer to buy or sell via WhatsApp?
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          Our team can help with your account.
                        </p>
                      </div>
                    </div>
                    <a
                      href="https://wa.me/256767155113"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-wa px-3.5 py-2 text-xs font-bold text-white transition hover:bg-wa-dark"
                    >
                      Chat now
                      <ArrowRight className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>

                <p className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
                  <Sparkles className="h-3 w-3 text-primary/80" />
                  One account for buying, selling, and saving deals.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
