import {
  ArrowUpRight,
  ClipboardList,
  CreditCard,
  FolderTree,
  MessageCircle,
  Package,
  ShieldCheck,
  Store,
  Tag,
  UserCircle,
  Users,
} from "lucide-react";
import Link from "next/link";
import { AdminPanel } from "@/components/admin/AdminPanel";
import { AdminStatCard } from "@/components/admin/AdminStatCard";
import { FeatureFlagsPanel } from "@/components/admin/FeatureFlagsPanel";
import { NeedsAttention } from "@/components/admin/NeedsAttention";
import { RecentActivity } from "@/components/admin/RecentActivity";
import { RecentListings } from "@/components/admin/RecentListings";
import { StoreIdentityCard } from "@/components/admin/StoreIdentityCard";
import { ChatUnreadBadge } from "@/components/chat/ChatUnreadBadge";
import { SubscriptionHealth } from "@/components/admin/SubscriptionHealth";
import { auth } from "@/lib/auth";
import {
  getAdminOverview,
  getAdminUsers,
  getAuditLog,
  getFeatureFlags,
  getRecentProductsWithOwners,
  getStoreAdminProfile,
} from "@/lib/db/queries";

export const dynamic = "force-dynamic";

const QUICK_ACTIONS = [
  {
    label: "All Products",
    description: "View, edit and feature listings",
    href: "/admin/products",
    icon: Package,
  },
  {
    label: "Chats",
    description: "Store threads and chats you start from a listing",
    href: "/admin/chats",
    icon: MessageCircle,
  },
  {
    label: "Categories",
    description: "Manage marketplace categories",
    href: "/admin/categories",
    icon: FolderTree,
  },
  {
    label: "Subscriptions",
    description: "Manage seller subscription plans",
    href: "/admin/subscriptions",
    icon: CreditCard,
  },
  {
    label: "Sellers",
    description: "Manage seller accounts and plans",
    href: "/admin/sellers",
    icon: Store,
  },
  {
    label: "Buyers",
    description: "Manage buyer accounts",
    href: "/admin/buyers",
    icon: Users,
  },
  {
    label: "Audit Log",
    description: "Review recent admin and user activity",
    href: "/admin/audit",
    icon: ClipboardList,
  },
  {
    label: "Admins",
    description: "Add or remove administrators",
    href: "/admin/admins",
    icon: ShieldCheck,
  },
  {
    label: "My Profile",
    description: "Update your account details",
    href: "/admin/profile",
    icon: UserCircle,
  },
];

export default async function AdminDashboardPage() {
  const session = await auth();
  if (session?.user?.role !== "admin") return null;

  const [overview, admins, auditEntries, recentProducts, storeProfile, flags] = await Promise.all([
    getAdminOverview(),
    getAdminUsers(),
    getAuditLog({ limit: 8 }),
    getRecentProductsWithOwners(5),
    getStoreAdminProfile(),
    getFeatureFlags(),
  ]);

  const isMainAdmin = admins.length > 0 && admins[0].id === session?.user?.id;
  const quickActions = isMainAdmin
    ? QUICK_ACTIONS
    : QUICK_ACTIONS.filter((a) => a.href !== "/admin/admins");

  return (
    <AdminPanel
      title="Admin Dashboard"
      description="What needs your attention across the marketplace."
      action={
        <Link
          href="/"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-card/80 px-4 py-2 text-xs font-bold text-muted-foreground transition hover:border-primary/40 hover:text-foreground"
        >
          View live site
          <ArrowUpRight className="size-3.5" />
        </Link>
      }
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard
          label="Total Listings"
          value={overview.totalListings}
          icon={Package}
          hint={`${overview.featuredListings} featured`}
        />
        <AdminStatCard
          label="Active Deals"
          value={overview.activeDeals}
          icon={Tag}
          hint="Live on the deals page"
        />
        <AdminStatCard
          label="Users"
          value={overview.totalUsers}
          icon={Users}
          hint={`${overview.subscriptions.free} on the free plan`}
        />
        <AdminStatCard
          label="Admins"
          value={overview.totalAdmins}
          icon={ShieldCheck}
          hint="Full dashboard access"
        />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <SubscriptionHealth overview={overview} />
        </div>
        <NeedsAttention needsAttention={overview.needsAttention} />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-2">
        <RecentActivity entries={auditEntries} />
        <RecentListings products={recentProducts} canAdd={isMainAdmin} />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-2">
        <StoreIdentityCard avatar={storeProfile.avatar} banner={storeProfile.banner} />
        {isMainAdmin && <FeatureFlagsPanel initialFlags={flags} />}
      </div>

      <div className="mt-8">
        <h2 className="mb-3 text-[11px] font-bold uppercase tracking-[0.22em] text-primary/80">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {quickActions.map(({ label, description, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="group flex items-start gap-3 rounded-2xl border border-border/70 bg-muted/20 p-4 transition duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/5"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-primary/25 bg-primary/10 text-primary">
                <Icon className="size-4" />
              </span>
              <span className="min-w-0">
                <span className="block font-semibold text-foreground">{label}</span>
                <span className="block text-sm text-muted-foreground">{description}</span>
              </span>
              {href === "/admin/chats" && <ChatUnreadBadge className="ml-auto shrink-0" />}
            </Link>
          ))}
        </div>
      </div>
    </AdminPanel>
  );
}
