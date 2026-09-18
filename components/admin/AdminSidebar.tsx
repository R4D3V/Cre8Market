"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowLeft,
  LayoutDashboard,
  Package,
  PlusCircle,
  FolderTree,
  Users,
  ShieldCheck,
  UserCircle,
  LogOut,
  type LucideIcon,
} from "lucide-react";

type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "All Products", href: "/admin/products", icon: Package },
  { label: "Add Product", href: "/admin/products/new", icon: PlusCircle },
  { label: "Categories", href: "/admin/categories", icon: FolderTree },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Admins", href: "/admin/admins", icon: ShieldCheck },
  { label: "My Profile", href: "/admin/profile", icon: UserCircle },
];

type AdminSidebarProps = {
  backHref?: string;
  userName: string;
  userEmail: string;
  userAvatar?: string;
  onSignOut?: () => void;
  className?: string;
};

export function AdminSidebar({
  backHref = "/",
  userName,
  userEmail,
  userAvatar,
  onSignOut,
  className = "",
}: AdminSidebarProps) {
  const pathname = usePathname();
  const initial = (userName || userEmail || "A")[0]?.toUpperCase() ?? "A";

  return (
    <aside
      className={`flex h-full w-64 shrink-0 flex-col justify-between gap-6 rounded-3xl border border-border bg-card p-4 ${className}`}
    >
      <div className="flex flex-col gap-2">
        {/* Brand */}
        {/* <Link
          href="/admin"
          className="flex items-center gap-2 px-3 py-2 font-heading text-sm font-extrabold tracking-wide text-foreground"
        >
          <span className="flex size-8 items-center justify-center rounded-xl bg-primary text-primary-foreground text-xs font-black">
            C8
          </span>
          CRE8<span className="text-primary">MARKET</span>
        </Link> */}

        {/* Back to website */}
        <Link
          href={backHref}
          className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to website
        </Link>

        {/* Nav items */}
        <nav className="mt-2 flex flex-col gap-2">
          {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={[
                  "flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-semibold transition-colors",
                  isActive
                    ? "border-primary/40 bg-primary/10 text-primary"
                    : "border-transparent text-muted-foreground hover:border-border hover:bg-muted hover:text-foreground",
                ].join(" ")}
              >
                <Icon className="size-4 shrink-0" />
                {label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Account section */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3 rounded-xl border border-border px-3 py-2.5 text-sm">
          <span className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted text-xs font-bold text-muted-foreground">
            {userAvatar ? (
              <img
                src={userAvatar}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              initial
            )}
          </span>
          <span className="min-w-0">
            <span className="block truncate font-semibold text-foreground">
              {userName || "Admin"}
            </span>
            <span className="block truncate text-xs text-muted-foreground">
              {userEmail}
            </span>
          </span>
        </div>

        <button
          type="button"
          onClick={onSignOut}
          className="flex items-center gap-3 rounded-xl border border-border px-4 py-3 text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <LogOut className="size-4 shrink-0" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
