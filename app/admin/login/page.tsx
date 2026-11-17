"use client";

import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  LayoutDashboard,
  Loader2,
  LockKeyhole,
  Mail,
  Package,
  ShieldCheck,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import PasswordInput from "@/components/PasswordInput";
import { signIn } from "@/lib/auth-client";

const FIELD_CLASS =
  "w-full rounded-xl border border-border/70 bg-muted/30 py-3 pl-10 pr-4 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/70 focus:border-primary/60 focus:bg-muted/50";

const HIGHLIGHTS = [
  {
    icon: LayoutDashboard,
    title: "One control centre",
    description: "Manage products, sellers, categories, and plans from a single dashboard.",
  },
  {
    icon: Package,
    title: "Full listing control",
    description: "Add, edit, feature, duplicate, or remove any product on the market.",
  },
  {
    icon: Users,
    title: "Seller oversight",
    description: "Review accounts, verify sellers, and keep subscriptions in order.",
  },
];

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn({
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      console.error("Admin sign-in failed:", result.error);
      const { message, status } = result.error;
      if (status === 403 || /origin|forbidden/i.test(message)) {
        setError(
          "Sign-in is blocked for this domain. The site's APP_URL does not match this address.",
        );
      } else if (status === 500 || /internal server error|database|connection/i.test(message)) {
        setError(
          "The server could not complete sign-in. Please try again or check the deployment logs.",
        );
      } else {
        setError("Invalid email or password");
      }
      setLoading(false);
      return;
    }

    // Hard navigation on purpose. The login page renders <Footer />, whose
    // /admin Link gets prefetched while logged out — the cached payload is the
    // proxy's redirect back to this page. router.push("/admin") would replay
    // that stale redirect, land here again without remounting, and leave the
    // form stuck on "Signing in…". A full page load always carries the new
    // session cookie.
    window.location.replace("/admin");
  }

  return (
    <div className="relative flex min-h-[75vh] items-center justify-center overflow-hidden px-4 py-12 pb-28 sm:pb-12">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 right-[-6%] h-[420px] w-[420px] rounded-full bg-primary/12 blur-[120px]" />
        <div className="absolute -left-28 bottom-0 h-[320px] w-[320px] rounded-full bg-secondary/15 blur-[110px]" />
      </div>

      <div className="relative w-full max-w-md">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground transition hover:text-primary"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to store
        </Link>

        <div className="text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-primary/25 bg-primary/10 text-primary">
            <ShieldCheck className="h-6 w-6" />
          </span>
          <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.22em] text-primary/80">
            Admin · Secure access
          </p>
          <h1 className="mt-2 font-heading text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            Admin Login
          </h1>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
            Sign in with your admin credentials to manage the marketplace.
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
                <h2 className="text-sm font-bold text-foreground">Sign in to the dashboard</h2>
                <p className="text-xs text-muted-foreground">
                  Use the email linked to your admin account.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="admin-login-email"
                  className="mb-1.5 block text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground"
                >
                  Admin email
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="admin-login-email"
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
                <div className="mb-1.5 flex items-center justify-between gap-3">
                  <label
                    htmlFor="admin-login-password"
                    className="block text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground"
                  >
                    Password
                  </label>
                  <Link
                    href="/admin/reset-password"
                    className="text-[11px] font-semibold text-primary transition hover:text-primary/80"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <PasswordInput
                    id="admin-login-password"
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

            <div className="mt-5 space-y-2 border-t border-border/60 pt-5 text-center text-sm text-muted-foreground">
              <p>
                Forgot your password?{" "}
                <Link
                  href="/admin/reset-password"
                  className="font-bold text-primary transition hover:text-primary/80"
                >
                  Reset it here
                </Link>
              </p>
              <p>
                Not an admin?{" "}
                <Link
                  href="/login"
                  className="font-bold text-primary transition hover:text-primary/80"
                >
                  Sign in as a seller
                </Link>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-border/60 bg-muted/20 p-3.5">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
            What you can do here
          </p>
          <ul className="space-y-2.5">
            {HIGHLIGHTS.map(({ icon: Icon, title, description }) => (
              <li key={title} className="flex items-start gap-2.5">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
                  <Icon className="h-3.5 w-3.5" />
                </span>
                <div>
                  <p className="text-xs font-bold text-foreground">{title}</p>
                  <p className="text-[11px] leading-relaxed text-muted-foreground">{description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
