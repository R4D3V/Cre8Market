import Link from "next/link";
import {
  Package,
  FolderTree,
  Users,
  ShieldCheck,
  Tag,
  UserCircle,
  ClipboardList,
} from "lucide-react";
import { AdminPanel } from "@/components/admin/AdminPanel";
import { AdminStatCard } from "@/components/admin/AdminStatCard";
import { auth } from "@/lib/auth";
import {
  getProducts,
  getDeals,
  getUsers,
  getAdminUsers,
} from "@/lib/db/queries";

export const dynamic = "force-dynamic";

async function getDashboardStats() {
  const [products, deals, users, admins] = await Promise.all([
    getProducts(),
    getDeals(),
    getUsers(),
    getAdminUsers(),
  ]);

  return {
    totalListings: products.length,
    activeDeals: deals.length,
    totalUsers: users.length,
    totalAdmins: admins.length,
  };
}

const QUICK_ACTIONS = [
  {
    label: "All Products",
    description: "View, edit and feature listings",
    href: "/admin/products",
    icon: Package,
  },
  {
    label: "Categories",
    description: "Manage marketplace categories",
    href: "/admin/categories",
    icon: FolderTree,
  },
  {
    label: "Users",
    description: "Manage registered sellers",
    href: "/admin/users",
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

  const stats = await getDashboardStats();

  return (
    <AdminPanel
      title="Admin Dashboard"
      description="Overview of your marketplace listings and users"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard label="Total Listings" value={stats.totalListings} icon={Package} />
        <AdminStatCard label="Active Deals" value={stats.activeDeals} icon={Tag} />
        <AdminStatCard label="Users" value={stats.totalUsers} icon={Users} />
        <AdminStatCard label="Admins" value={stats.totalAdmins} icon={ShieldCheck} />
      </div>

      <div className="mt-8">
        <h2 className="mb-3 text-xs font-bold tracking-widest text-muted-foreground uppercase">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {QUICK_ACTIONS.map(({ label, description, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-start gap-3 rounded-2xl border border-border bg-background/40 p-4 transition-colors hover:border-primary/40 hover:bg-primary/5"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Icon className="size-4" />
              </span>
              <span className="min-w-0">
                <span className="block font-semibold text-foreground">{label}</span>
                <span className="block text-sm text-muted-foreground">{description}</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </AdminPanel>
  );
}