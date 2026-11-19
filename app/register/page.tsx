"use client";

import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  KeyRound,
  Loader2,
  LockKeyhole,
  MessageCircle,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Store,
  UserRound,
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
import { registerUserAction } from "@/lib/actions/auth";
import { signIn } from "@/lib/auth-client";
import { PLANS } from "@/lib/plans";

type AccountType = "seller" | "buyer";

const FIELD_CLASS =
  "w-full rounded-xl border border-border/70 bg-muted/30 py-3 pl-10 pr-4 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/70 focus:border-primary/60 focus:bg-muted/50";

// Two registration modes on one page: the original seller form (unchanged) and
// the new buyer form. Switching tabs never clears what was already typed.
const ACCOUNT_TABS: {
  id: AccountType;
  label: string;
  hint: string;
  icon: typeof Store;
}[] = [
  { id: "seller", label: "Seller", hint: "Post listings", icon: Store },
  { id: "buyer", label: "Buyer", hint: "Browse & chat", icon: ShoppingBag },
];

const BENEFITS = [
  {
    icon: Sparkles,
    title: "Free to join",
    description: "Create your account with no upfront cost.",
  },
  {
    icon: Zap,
    title: "Post in minutes",
    description: "List your first item and reach local buyers fast.",
  },
  {
    icon: MessageCircle,
    title: "Direct WhatsApp contact",
    description: "Deal with buyers and sellers without middlemen.",
  },
];

export default function RegisterPage() {
  const router = useRouter();
  const [surname, setSurname] = useState("");
  const [givenName, setGivenName] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [accountExists, setAccountExists] = useState(false);
  const [accountType, setAccountType] = useState<AccountType>("seller");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const name = `${surname} ${givenName}`.trim();
    if (!name) {
      setError("Please enter your name");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    if (!/^\d{4}$/.test(pin)) {
      setError("Reset pin must be a 4-digit code");
      return;
    }
    setLoading(true);
    setError("");
    setAccountExists(false);

    try {
      await registerUserAction({
        name,
        phone: toFullNumber(phone),
        // Buyers don't collect a separate WhatsApp number; it falls back to
        // their phone number on the server.
        whatsapp:
          accountType === "seller" && whatsapp
            ? toFullNumber(whatsapp)
            : undefined,
        password,
        pin,
        accountType,
      });

      // Registration succeeded — sign the new account in right away.
      const result = await signIn({
        phone: toFullNumber(phone),
        password,
        redirect: false,
      });
      if (result?.error) {
        // Account was created but auto sign-in failed for some reason; send them to log in manually.
        router.push("/login");
        return;
      }

      setSuccess(true);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.";
      setError(message);
      if (message.includes("already exists")) setAccountExists(true);
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-dvh bg-background text-foreground">
        <Navbar />

        <main className="page-ambient relative overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
          >
            <div className="absolute -top-44 right-[-8%] h-[480px] w-[480px] rounded-full bg-primary/15 blur-[130px]" />
            <div className="absolute -left-36 top-16 h-[380px] w-[380px] rounded-full bg-secondary/20 blur-[120px]" />
          </div>

          <div className="container relative flex min-h-[70vh] items-center justify-center py-14 pb-28 sm:pb-14">
            <ScrollReveal className="w-full max-w-lg">
              <div className="relative overflow-hidden rounded-3xl border border-primary/25 bg-card/80 p-8 text-center backdrop-blur-sm sm:p-12">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-20 -top-24 h-56 w-56 rounded-full bg-primary/15 blur-[90px]"
                />
                <div className="relative">
                  <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl border border-primary/30 bg-primary/15 text-primary">
                    <CheckCircle2 className="h-8 w-8" />
                  </span>
                  <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.22em] text-primary/80">
                    Account created
                  </p>
                  <h1 className="mt-2 font-heading text-3xl font-extrabold tracking-tight text-foreground">
                    Welcome, {surname} {givenName}!
                  </h1>
                  <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
                    {accountType === "buyer"
                      ? "Your buyer account is ready. Browse listings and message sellers directly."
                      : "Your account has been created. You can now post listings and contact sellers."}
                  </p>

                  <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                    <Link
                      href={
                        accountType === "buyer"
                          ? "/buyer"
                          : "/dashboard/products/new"
                      }
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition hover:bg-primary/90"
                    >
                      {accountType === "buyer"
                        ? "Open my dashboard"
                        : "Add a Listing"}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                    <Link
                      href="/products"
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-border/70 bg-card/60 px-5 py-3 text-sm font-semibold text-foreground transition hover:border-primary/40 hover:text-primary"
                    >
                      Browse Listings
                    </Link>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <Navbar />

      <main className="page-ambient relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
        >
          <div className="absolute -top-44 right-[-8%] h-[480px] w-[480px] rounded-full bg-primary/15 blur-[130px]" />
          <div className="absolute -left-36 top-16 h-[380px] w-[380px] rounded-full bg-secondary/20 blur-[120px]" />
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
              backgroundSize: "56px 56px",
              maskImage:
                "radial-gradient(ellipse 85% 65% at 50% 0%, black 25%, transparent 100%)",
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
            <ScrollReveal className="lg:sticky lg:top-28 lg:col-span-4 lg:self-start">
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
                    <Sparkles className="h-5 w-5" />
                  </span>

                  <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.22em] text-primary/80">
                    Join the marketplace
                  </p>
                  <h1 className="mt-3 font-heading text-[2rem] font-extrabold leading-[1.08] tracking-[-0.03em] text-foreground sm:text-4xl">
                    Your next deal starts with a{" "}
                    <span className="bg-gradient-to-r from-primary via-emerald-300 to-teal-200 bg-clip-text text-transparent">
                      free account.
                    </span>
                  </h1>
                  <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
                    Create a free account to buy, sell, and get the best deals
                    in Entebbe — directly with local people.
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
                          <p className="text-sm font-bold text-foreground">
                            {title}
                          </p>
                          <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                            {description}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 flex items-start gap-2 rounded-2xl border border-secondary/25 bg-secondary/10 p-3.5">
                    <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                    <p className="text-[11px] leading-relaxed text-muted-foreground">
                      Your details are only used to manage your account and
                      connect you with buyers.
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Form */}
            <ScrollReveal delay={100} className="lg:col-span-8">
              <div className="mx-auto w-full max-w-2xl lg:mr-0">
                <div className="relative overflow-hidden rounded-3xl border border-border/70 bg-card/80 p-6 backdrop-blur-sm sm:p-8">
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-primary/10 blur-[80px]"
                  />

                  <div className="relative">
                    <div className="mb-6 flex items-center gap-3 border-b border-border/60 pb-5">
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-primary/25 bg-primary/10 text-primary">
                        <UserRound className="h-5 w-5" />
                      </span>
                      <div>
                        <h2 className="text-sm font-bold text-foreground">
                          Create your account
                        </h2>
                        <p className="text-xs text-muted-foreground">
                          It only takes a minute.
                        </p>
                      </div>
                    </div>

                    {/* Account type: sellers post listings, buyers browse & chat */}
                    <div
                      role="tablist"
                      aria-label="Account type"
                      className="mb-6 grid grid-cols-2 gap-2 rounded-2xl border border-border/70 bg-muted/30 p-1.5"
                    >
                      {ACCOUNT_TABS.map((tab) => {
                        const activeTab = accountType === tab.id;
                        return (
                          <button
                            key={tab.id}
                            type="button"
                            role="tab"
                            aria-selected={activeTab}
                            onClick={() => setAccountType(tab.id)}
                            className={`flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-bold transition ${
                              activeTab
                                ? "bg-primary text-primary-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            <tab.icon className="h-4 w-4" />
                            <span className="flex flex-col items-center leading-tight">
                              <span>{tab.label}</span>
                              <span
                                className={`text-[10px] font-semibold ${
                                  activeTab
                                    ? "text-primary-foreground/80"
                                    : "text-muted-foreground"
                                }`}
                              >
                                {tab.hint}
                              </span>
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="space-y-4">
                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary/80">
                          Your details
                        </p>

                        <div>
                          <label
                            htmlFor="register-surname"
                            className="mb-1.5 block text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground"
                          >
                            Sir name
                          </label>
                          <div className="relative">
                            <UserRound className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <input
                              id="register-surname"
                              type="text"
                              required
                              autoComplete="family-name"
                              value={surname}
                              onChange={(e) => setSurname(e.target.value)}
                              placeholder="Your sir name"
                              className={FIELD_CLASS}
                            />
                          </div>
                        </div>

                        <div>
                          <label
                            htmlFor="register-given-name"
                            className="mb-1.5 block text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground"
                          >
                            Given name
                          </label>
                          <div className="relative">
                            <UserRound className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <input
                              id="register-given-name"
                              type="text"
                              required
                              autoComplete="given-name"
                              value={givenName}
                              onChange={(e) => setGivenName(e.target.value)}
                              placeholder="Your given name"
                              className={FIELD_CLASS}
                            />
                          </div>
                        </div>

                        <div>
                          <label
                            htmlFor="register-phone"
                            className="mb-1.5 block text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground"
                          >
                            {accountType === "buyer"
                              ? "Phone number"
                              : "Phone / WhatsApp number"}
                          </label>
                          <PhoneInput
                            id="register-phone"
                            required
                            autoComplete="tel-national"
                            value={phone}
                            onChange={setPhone}
                            placeholder="700 000 000"
                            outerClassName="h-11"
                          />
                        </div>

                        {accountType === "seller" && (
                          <div>
                            <label
                              htmlFor="register-whatsapp"
                              className="mb-1.5 block text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground"
                            >
                              WhatsApp number{" "}
                              <span className="font-medium normal-case tracking-normal text-muted-foreground/70">
                                (if different)
                              </span>
                            </label>
                            <PhoneInput
                              id="register-whatsapp"
                              autoComplete="tel-national"
                              value={whatsapp}
                              onChange={setWhatsapp}
                              placeholder="Leave blank to use the number above"
                              outerClassName="h-11"
                            />
                          </div>
                        )}
                      </div>

                      <div className="space-y-4 border-t border-border/60 pt-5">
                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary/80">
                          Secure your account
                        </p>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <div>
                            <label
                              htmlFor="register-password"
                              className="mb-1.5 block text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground"
                            >
                              Password
                            </label>
                            <div className="relative">
                              <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                              <PasswordInput
                                id="register-password"
                                required
                                minLength={6}
                                autoComplete="new-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Create a password"
                                className={FIELD_CLASS}
                              />
                            </div>
                          </div>

                          <div>
                            <label
                              htmlFor="register-confirm"
                              className="mb-1.5 block text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground"
                            >
                              Confirm password
                            </label>
                            <div className="relative">
                              <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                              <PasswordInput
                                id="register-confirm"
                                required
                                autoComplete="new-password"
                                value={confirm}
                                onChange={(e) => setConfirm(e.target.value)}
                                placeholder="Repeat password"
                                className={FIELD_CLASS}
                              />
                            </div>
                          </div>
                        </div>

                        <div>
                          <label
                            htmlFor="register-pin"
                            className="mb-1.5 block text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground"
                          >
                            4-digit reset pin
                          </label>
                          <div className="relative">
                            <KeyRound className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <PasswordInput
                              id="register-pin"
                              required
                              inputMode="numeric"
                              pattern="\d{4}"
                              maxLength={4}
                              autoComplete="off"
                              value={pin}
                              onChange={(e) =>
                                setPin(e.target.value.replace(/\D/g, ""))
                              }
                              placeholder="e.g. 1234"
                              className={FIELD_CLASS}
                            />
                          </div>
                          <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                            You&apos;ll use this pin to verify your identity
                            when resetting your password.
                          </p>
                        </div>
                      </div>

                      {error && (
                        <div
                          role="alert"
                          className="rounded-2xl border border-destructive/40 bg-destructive/10 p-3.5 text-sm text-destructive"
                        >
                          <div className="flex items-start gap-2.5">
                            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                            <p>{error}</p>
                          </div>
                          {accountExists && (
                            <Link
                              href="/reset-password"
                              className="mt-2 inline-flex items-center gap-1.5 font-bold text-primary transition hover:text-primary/80"
                            >
                              Forgot your password? Reset it here
                              <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
                          )}
                        </div>
                      )}

                      {accountType === "seller" ? (
                        <div className="rounded-2xl border border-secondary/25 bg-secondary/10 p-4">
                          <div className="flex items-center justify-between gap-3">
                            <p className="flex items-center gap-2 text-xs font-bold text-foreground">
                              <Sparkles className="h-3.5 w-3.5 text-secondary" />
                              Seller plans
                            </p>
                            <Link
                              href="/subscription"
                              className="group inline-flex items-center gap-1 text-[11px] font-bold text-secondary transition hover:text-secondary/80"
                            >
                              View plans
                              <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5" />
                            </Link>
                          </div>
                          <ul className="mt-3 space-y-1.5">
                            {PLANS.map((p) => (
                              <li
                                key={p.name}
                                className="flex items-start gap-2 text-xs text-muted-foreground"
                              >
                                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-secondary" />
                                <span>
                                  <span className="font-semibold text-foreground">
                                    {p.name}
                                  </span>{" "}
                                  — {p.price} / {p.period.toLowerCase()},{" "}
                                  {p.features[0].toLowerCase()}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : (
                        <div className="rounded-2xl border border-secondary/25 bg-secondary/10 p-4">
                          <p className="flex items-center gap-2 text-xs font-bold text-foreground">
                            <Sparkles className="h-3.5 w-3.5 text-secondary" />
                            Buyer accounts are free
                          </p>
                          <ul className="mt-3 space-y-1.5">
                            {[
                              "Message any seller directly from a listing",
                              "No plans, no fees — just browse and chat",
                              "Your messages clear themselves after 3 days",
                            ].map((perk) => (
                              <li
                                key={perk}
                                className="flex items-start gap-2 text-xs text-muted-foreground"
                              >
                                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-secondary" />
                                <span>{perk}</span>
                              </li>
                            ))}
                          </ul>
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
                            Creating account…
                          </>
                        ) : (
                          <>
                            Register Free
                            <ArrowRight className="h-4 w-4" />
                          </>
                        )}
                      </button>

                      <p className="text-center text-xs leading-relaxed text-muted-foreground">
                        By registering you agree to our{" "}
                        <Link
                          href="/terms"
                          className="font-semibold text-primary transition hover:text-primary/80"
                        >
                          Terms
                        </Link>{" "}
                        &amp;{" "}
                        <Link
                          href="/privacy"
                          className="font-semibold text-primary transition hover:text-primary/80"
                        >
                          Privacy Policy
                        </Link>
                      </p>
                    </form>

                    <div className="mt-5 border-t border-border/60 pt-5 text-center">
                      <p className="text-sm text-muted-foreground">
                        Already have an account?{" "}
                        <Link
                          href="/login"
                          className="font-bold text-primary transition hover:text-primary/80"
                        >
                          Sign In
                        </Link>
                      </p>
                    </div>
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
