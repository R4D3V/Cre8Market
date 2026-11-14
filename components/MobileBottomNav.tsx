"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CirclePlus, House, ShoppingBag, Tag, User, Users } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { haptic } from "@/lib/haptics";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated";
  const role = session?.user?.role;

  const addProductHref = !isLoggedIn
    ? "/login"
    : role === "admin"
      ? "/admin/products/new"
      : "/dashboard/products/new";

  const navItems = [
    { href: "/", label: "Home", Icon: House },
    { href: "/products", label: "Shop", Icon: ShoppingBag },
    { href: "/deals", label: "Deals", Icon: Tag },
    { href: "/sellers", label: "Sellers", Icon: Users },
    ...(isLoggedIn ? [{ href: addProductHref, label: "Add", Icon: CirclePlus }] : []),
    {
      href: isLoggedIn ? "/dashboard" : "/login",
      label: isLoggedIn ? "Dashboard" : "Login",
      Icon: User,
    },
  ];

  // The most specific matching item wins, so /dashboard/products/new lights up
  // "Add" rather than "Dashboard", and /products/some-phone lights up "Shop".
  const matches = navItems.filter((item) =>
    item.href === "/"
      ? pathname === "/"
      : pathname === item.href || pathname.startsWith(`${item.href}/`),
  );
  const activeHref = matches.sort((a, b) => b.href.length - a.href.length)[0]?.href;

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-2 z-50 sm:hidden"
      style={{ bottom: "calc(env(safe-area-inset-bottom, 0px) + 0.5rem)" }}
    >
      <div className="neu-dark-card flex items-center gap-0.5 p-1 shadow-xl">
        {navItems.map(({ href, label, Icon }) => {
          const active = href === activeHref;
          return (
            <Link
              key={label}
              href={href}
              aria-current={active ? "page" : undefined}
              onClick={() => haptic(8)}
              className={`press flex min-h-[52px] flex-1 flex-col items-center justify-center gap-0.5 rounded-xl py-1.5 transition-colors ${
                active ? "bg-primary/10 text-primary" : "text-muted-foreground"
              }`}
            >
              <Icon className="size-[22px]" strokeWidth={active ? 2.4 : 1.9} aria-hidden="true" />
              <span className="text-[10px] font-semibold leading-none">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
