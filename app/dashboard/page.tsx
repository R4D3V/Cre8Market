"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { DashboardPanel } from "@/components/dashboard/DashboardPanel";
import { fetchMyProfileAction } from "@/lib/actions/users";
import { fetchMySubscriptionAction } from "@/lib/actions/subscriptions";
import { getCurrentPlanName, getPlanByName } from "@/lib/plans";

export default function DashboardHubPage() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<{ isVerified?: boolean; isVip?: boolean } | null>(null);
  const [subscription, setSubscription] = useState<{ planName?: string; expiresAt: string | null; status: string } | null>(null);

  useEffect(() => {
    fetchMyProfileAction().then((data) => setProfile(data)).catch(() => {});
    fetchMySubscriptionAction().then((data) => setSubscription(data)).catch(() => {});
  }, []);

  const subscriptionActive =
    !!subscription &&
    subscription.status === "active" &&
    (!subscription.expiresAt || new Date(subscription.expiresAt).getTime() > Date.now());
  const subscriptionExpired = !!subscription && !subscriptionActive;
  const planName = (subscriptionActive
    ? subscription?.planName
    : subscriptionExpired
      ? "Free"
      : getCurrentPlanName(profile ?? {})) as string;

  return (
    <DashboardPanel title="Dashboard" description="Manage your account and listings">
      {/* Current plan */}
      <div className="mb-6 bg-background/40 border border-border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-1">
            Your plan
          </p>
          <p className="font-bold text-foreground text-sm">{planName} plan</p>
          <p className="text-muted-foreground text-xs mt-0.5">
            {subscription?.expiresAt
              ? subscriptionActive
                ? `Expires ${new Date(subscription.expiresAt).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`
                : `Expired ${new Date(subscription.expiresAt).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} — subscribe to restore perks`
              : getPlanByName(planName as any)?.features[0]}
          </p>
        </div>
        <Link
          href="/subscription"
          className="neu-pill bg-primary text-primary-foreground text-sm font-semibold px-4 py-2 transition-all"
        >
          Upgrade / View Plans
        </Link>
      </div>

      {/* Hub cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/dashboard/profile"
          className="neu-card p-6 flex flex-col gap-2 hover:opacity-90 transition-opacity"
        >
          <span className="text-3xl">👤</span>
          <h3 className="font-heading text-lg font-extrabold text-foreground">
            Profile
          </h3>
          <p className="text-sm text-muted-foreground">
            View and edit your name, phone, WhatsApp, avatar and banner.
          </p>
          <span className="text-sm text-primary font-semibold mt-2">
            Open Profile →
          </span>
        </Link>

        <Link
          href="/dashboard/products"
          className="neu-card p-6 flex flex-col gap-2 hover:opacity-90 transition-opacity"
        >
          <span className="text-3xl">📦</span>
          <h3 className="font-heading text-lg font-extrabold text-foreground">
            Products
          </h3>
          <p className="text-sm text-muted-foreground">
            Manage your listings: add, edit, duplicate or delete products.
          </p>
          <span className="text-sm text-primary font-semibold mt-2">
            Open Products →
          </span>
        </Link>
      </div>
    </DashboardPanel>
  );
}