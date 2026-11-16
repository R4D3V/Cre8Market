"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  CheckCircle2,
  Circle,
  Copy,
  MessageCircle,
  Package,
  Sparkles,
  Star,
  Store,
  Tag,
  UserCircle,
} from "lucide-react";
import { DashboardPanel } from "@/components/dashboard/DashboardPanel";
import { fetchMyProfileAction } from "@/lib/actions/users";
import { fetchMySubscriptionAction } from "@/lib/actions/subscriptions";
import {
  fetchMyListingLimitAction,
  fetchMyProductsAction,
} from "@/lib/actions/products";
import { formatPrice } from "@/lib/data";
import {
  getCurrentPlanName,
  getPlanByName,
  planTierFromName,
  type PlanName,
} from "@/lib/plans";
import type { AppUser, Product, UserSubscription } from "@/lib/types";
import { sellerPath } from "@/lib/seller-handle";

const HUB_CARDS = [
  {
    href: "/dashboard/profile",
    icon: UserCircle,
    label: "Profile",
    description:
      "View and edit your name, phone, WhatsApp, avatar and banner.",
  },
  {
    href: "/dashboard/products",
    icon: Package,
    label: "Products",
    description:
      "Manage your listings: add, edit, duplicate or delete products.",
  },
];

type ListingLimit = {
  productCount: number;
  limit: number | null;
  isVerified: boolean;
  isVip: boolean;
};

function daysUntil(value: string | null, now: number) {
  if (!value) return null;
  const target = new Date(value).getTime();
  if (Number.isNaN(target)) return null;
  return Math.ceil((target - now) / (24 * 60 * 60 * 1000));
}

export default function DashboardHubPage() {
  const [now] = useState(() => Date.now());
  const [profile, setProfile] = useState<AppUser | null>(null);
  const [subscription, setSubscription] = useState<UserSubscription | null>(
    null,
  );
  const [limitInfo, setLimitInfo] = useState<ListingLimit | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let active = true;
    fetchMyProfileAction()
      .then((data) => {
        if (active) setProfile(data);
      })
      .catch(() => {});
    fetchMySubscriptionAction()
      .then((data) => {
        if (active) setSubscription(data);
      })
      .catch(() => {});
    fetchMyListingLimitAction()
      .then((data) => {
        if (active) setLimitInfo(data);
      })
      .catch(() => {});
    fetchMyProductsAction()
      .then((data) => {
        if (active) setProducts(data ?? []);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const subscriptionActive =
    !!subscription &&
    subscription.status === "active" &&
    (!subscription.expiresAt ||
      new Date(subscription.expiresAt).getTime() > now);
  const subscriptionExpired = !!subscription && !subscriptionActive;
  const flagPlan = getCurrentPlanName(profile ?? {});
  const planName = (subscriptionExpired
    ? "Free"
    : flagPlan !== "Free"
      ? flagPlan
      : subscriptionActive && subscription?.planName
        ? (planTierFromName(subscription.planName) ?? "Free")
        : "Free") as PlanName;
  const plan = getPlanByName(planName);
  const expiresInDays = daysUntil(subscription?.expiresAt ?? null, now);

  const productCount = limitInfo?.productCount ?? products.length;
  const listingLimit = limitInfo?.limit ?? null;
  const quotaFull = listingLimit !== null && productCount >= listingLimit;
  const quotaPercent =
    listingLimit !== null
      ? Math.min(100, Math.round((productCount / listingLimit) * 100))
      : 100;
  const remaining =
    listingLimit !== null ? Math.max(listingLimit - productCount, 0) : null;

  const dealCount = products.filter((product) => product.isDeal).length;
  const featuredCount = products.filter((product) => product.featured).length;
  const recentProducts = products.slice(0, 3);

  const verified = !!(profile?.isVerified || limitInfo?.isVerified);

  const checklist = [
    {
      label: "Profile photo",
      done: !!profile?.avatar,
      hint: "Buyers recognise you and your listings.",
    },
    {
      label: "Storefront banner",
      done: !!profile?.banner,
      hint: "Makes your public seller page stand out.",
    },
    {
      label: "WhatsApp number",
      done: !!profile?.whatsapp,
      hint: "The fastest way for buyers to reach you.",
    },
    {
      label: "Password reset PIN",
      done: !!profile?.hasPin,
      hint: "Adds 2-step verification when resetting a password.",
    },
    {
      label: "Verified seller badge",
      done: verified,
      hint:
        planName === "Free"
          ? "Upgrade to Standard or Premium to unlock it."
          : "Included with your plan.",
    },
  ];
  const completed = checklist.filter((item) => item.done).length;
  const completionPercent = Math.round(
    (completed / checklist.length) * 100,
  );
  const storefrontPath = profile ? sellerPath(profile) : null;

  async function handleCopy() {
    if (!profile || !storefrontPath) return;
    const url = `${window.location.origin}${storefrontPath}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can be blocked; the public page link still works.
    }
  }

  function handleShare() {
    if (!profile || !storefrontPath) return;
    const url = `${window.location.origin}${storefrontPath}`;
    const text = `Check out my store on CRE8MARKET: ${profile.name} — ${url}`;
    window.open(
      `https://wa.me/?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener,noreferrer",
    );
  }

  return (
    <DashboardPanel
      title="Dashboard"
      description="Manage your account, listings and storefront."
    >
      {/* Plan + status */}
      <div className="mb-6 rounded-2xl border border-border/70 bg-muted/30 p-4 sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="mb-1 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-primary/80">
              <Sparkles className="size-3.5" />
              Your plan
            </p>
            <p className="flex flex-wrap items-center gap-2 text-sm font-bold text-foreground">
              {planName} plan
              <span
                className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                  verified
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700"
                    : "border-border bg-muted text-muted-foreground"
                }`}
              >
                <BadgeCheck className="size-3" />
                {planName === "Free"
                  ? "Free plan"
                  : `${planName} · ${verified ? "Verified" : "Pending"}`}
              </span>
            </p>
            <p
              className={`mt-1 text-xs ${
                subscriptionExpired
                  ? "text-rose-600"
                  : "text-muted-foreground"
              }`}
            >
              {subscription?.expiresAt
                ? subscriptionActive
                  ? `Expires ${
                      expiresInDays === 0
                        ? "today"
                        : `in ${expiresInDays} day${expiresInDays === 1 ? "" : "s"}`
                    } · ${new Date(
                      subscription.expiresAt,
                    ).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}`
                  : `Expired ${new Date(
                      subscription.expiresAt,
                    ).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })} — subscribe to restore perks`
                : plan?.features[0]}
            </p>
          </div>
          <Link
            href="/subscription"
            className="inline-flex shrink-0 items-center justify-center gap-1 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
          >
            Upgrade / View Plans
            <ArrowUpRight className="size-4" />
          </Link>
        </div>

        {plan && (
          <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 border-t border-border/60 pt-3">
            {plan.features.map((feature) => (
              <li
                key={feature}
                className="flex items-center gap-1.5 text-xs text-muted-foreground"
              >
                <CheckCircle2 className="size-3.5 shrink-0 text-primary" />
                {feature}
              </li>
            ))}
          </ul>
        )}

        {!verified && (
          <p className="mt-2 text-xs text-muted-foreground">
            Want the verified badge?{" "}
            <Link href="/contact" className="font-semibold text-primary hover:underline">
              Contact the team
            </Link>
            .
          </p>
        )}
      </div>

      {/* Quota + snapshot */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {planName !== "Premium" && (
                  <section className="rounded-2xl border border-border/70 bg-card/70 p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h2 className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary/80">
                          Listing quota
                        </h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {listingLimit === null
                            ? "Unlimited listings on your plan."
                            : `${productCount} of ${listingLimit} listings used`}
                        </p>
                      </div>
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-primary/25 bg-primary/10 text-primary">
                        <Tag className="size-4" />
                      </span>
                    </div>
          
                    {listingLimit !== null && (
                      <div className="mt-4">
                        <div
                          className="h-2 w-full overflow-hidden rounded-full bg-muted"
                          role="progressbar"
                          aria-valuemin={0}
                          aria-valuemax={listingLimit}
                          aria-valuenow={productCount}
                          aria-label="Listing quota used"
                        >
                          <div
                            className={`h-full rounded-full transition-all ${
                              quotaFull ? "bg-rose-500" : "bg-primary"
                            }`}
                            style={{ width: `${quotaPercent}%` }}
                          />
                        </div>
                        <p className="mt-2 text-xs text-muted-foreground">
                          {remaining !== null && remaining > 0
                            ? `${remaining} listing${remaining === 1 ? "" : "s"} left on your current plan.`
                            : "You have used every listing on your current plan."}
                        </p>
                      </div>
                    )}
          
                    {quotaFull && (
                      <div className="mt-3 flex items-start gap-2 rounded-xl border border-rose-500/30 bg-rose-500/5 p-3">
                        <AlertTriangle className="mt-0.5 size-4 shrink-0 text-rose-600" />
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-foreground">
                            Your listing limit is full
                          </p>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            Delete a listing or upgrade to add more.
                          </p>
                          <Link
                            href="/subscription"
                            className="mt-1.5 inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                          >
                            View plans
                            <ArrowRight className="size-3.5" />
                          </Link>
                        </div>
                      </div>
                    )}
                  </section>
        )}

        <section className="rounded-2xl border border-border/70 bg-card/70 p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary/80">
                Listing snapshot
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                How your shop looks right now.
              </p>
            </div>
            <Link
              href="/dashboard/products"
              className="inline-flex shrink-0 items-center gap-1 text-xs font-bold text-primary hover:underline"
            >
              Manage
              <ArrowRight className="size-3.5" />
            </Link>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2">
            {[
              { label: "Listings", value: productCount, icon: Package },
              { label: "Deals", value: dealCount, icon: Tag },
              { label: "Featured", value: featuredCount, icon: Star },
            ].map(({ label, value, icon: Icon }) => (
              <div
                key={label}
                className="rounded-xl border border-border/60 bg-muted/20 p-3"
              >
                <Icon className="size-4 text-primary" />
                <p className="mt-1.5 font-heading text-xl font-extrabold text-foreground">
                  {value}
                </p>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                  {label}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-3">
            {products.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                You have not added a listing yet.{" "}
                <Link
                  href="/dashboard/products/new"
                  className="font-semibold text-primary hover:underline"
                >
                  Add your first product
                </Link>
                .
              </p>
            ) : (
              <ul className="divide-y divide-border/60">
                {recentProducts.map((product) => (
                  <li key={product.id}>
                    <Link
                      href={`/dashboard/products/${product.id}/edit`}
                      className="group flex items-center gap-2.5 py-2 first:pt-0 last:pb-0"
                    >
                      <span className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border/60 bg-muted">
                        {product.images?.[0] ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={product.images[0]}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <Package className="size-3.5 text-muted-foreground" />
                        )}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-xs font-semibold text-foreground">
                          {product.title}
                        </span>
                        <span className="block text-[11px] text-muted-foreground">
                          {formatPrice(product.price)}
                        </span>
                      </span>
                      <ArrowRight className="size-3.5 shrink-0 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-primary" />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>

      {/* Checklist + storefront */}
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <section className="rounded-2xl border border-border/70 bg-card/70 p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary/80">
                Profile checklist
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {completed === checklist.length
                  ? "Everything is set up. Your public page is complete."
                  : `${completed} of ${checklist.length} steps complete`}
              </p>
            </div>
            <span className="rounded-full border border-border/70 bg-muted/30 px-2 py-0.5 text-[11px] font-bold text-muted-foreground">
              {completionPercent}%
            </span>
          </div>

          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${completionPercent}%` }}
            />
          </div>

          <ul className="mt-3 space-y-1">
            {checklist.map(({ label, done, hint }) => (
              <li
                key={label}
                className="flex items-start gap-2.5 rounded-lg px-1 py-1.5"
              >
                {done ? (
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                ) : (
                  <Circle className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                )}
                <span className="min-w-0">
                  <span
                    className={`block text-xs font-semibold ${
                      done ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {label}
                  </span>
                  <span className="block text-[11px] text-muted-foreground">
                    {hint}
                  </span>
                </span>
              </li>
            ))}
          </ul>

          {completed < checklist.length && (
            <Link
              href="/dashboard/profile"
              className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
            >
              Complete your profile
              <ArrowRight className="size-3.5" />
            </Link>
          )}
        </section>

        <section className="overflow-hidden rounded-2xl border border-border/70 bg-card/70">
          <div className="relative h-24 w-full overflow-hidden bg-gradient-to-r from-primary/25 via-primary/10 to-secondary/20">
            {profile?.banner ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.banner}
                alt="Your storefront banner"
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="absolute inset-0 grid place-items-center text-[11px] font-semibold text-muted-foreground">
                No storefront banner yet
              </span>
            )}
          </div>

          <div className="px-5 pb-5">
            <div className="-mt-7 flex items-end gap-3">
              <span className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-2 border-card bg-primary text-xl font-bold text-primary-foreground">
                {profile?.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={profile.avatar}
                    alt="Your profile photo"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  (profile?.name?.[0] ?? "U").toUpperCase()
                )}
              </span>
              <div className="min-w-0 flex-1 pb-1">
                <p className="truncate font-heading text-base font-extrabold text-foreground">
                  {profile?.name ?? "Your public page"}
                </p>
                <p className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Store className="size-3" />
                  {storefrontPath ?? "/sellers/…"}
                </p>
              </div>
            </div>

            <p className="mt-3 text-xs text-muted-foreground">
              This is the page buyers see when they open your shop. Share it to
              get more views.
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Link
                href={storefrontPath ?? "/sellers"}
                className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3.5 py-2 text-xs font-bold text-primary-foreground transition hover:bg-primary/90"
              >
                <Store className="size-3.5" />
                View public page
              </Link>
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-card px-3.5 py-2 text-xs font-bold text-foreground transition hover:border-primary/40 hover:text-primary"
              >
                {copied ? (
                  <CheckCircle2 className="size-3.5 text-primary" />
                ) : (
                  <Copy className="size-3.5" />
                )}
                {copied ? "Copied" : "Copy link"}
              </button>
              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-card px-3.5 py-2 text-xs font-bold text-foreground transition hover:border-primary/40 hover:text-primary"
              >
                <MessageCircle className="size-3.5" />
                WhatsApp
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Hub cards */}
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {HUB_CARDS.map(({ href, icon: Icon, label, description }) => (
          <Link
            key={href}
            href={href}
            className="group relative flex flex-col gap-2 overflow-hidden rounded-2xl border border-border/70 bg-card/70 p-6 transition duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_28px_60px_-30px_rgba(0,0,0,0.9)]"
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-primary/10 blur-2xl transition group-hover:bg-primary/20"
            />
            <span className="relative flex size-11 items-center justify-center rounded-xl border border-primary/25 bg-primary/10 text-primary">
              <Icon className="size-5" />
            </span>
            <h3 className="relative mt-1 font-heading text-lg font-extrabold tracking-tight text-foreground">
              {label}
            </h3>
            <p className="relative text-sm text-muted-foreground">
              {description}
            </p>
            <span className="relative mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary">
              Open {label}
              <ArrowUpRight className="size-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </Link>
        ))}
      </div>
    </DashboardPanel>
  );
}
