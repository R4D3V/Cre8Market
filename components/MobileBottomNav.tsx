"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { status } = useSession();
  const isLoggedIn = status === "authenticated";

  const navItems = [
    { href: "/", label: "Home", icon: "🏠" },
    { href: "/products", label: "Shop", icon: "🛒" },
    {
      href: isLoggedIn ? "/dashboard/products/new" : "/login",
      label: "Add Product",
      icon: "➕",
    },
    {
      href: isLoggedIn ? "/dashboard" : "/login",
      label: isLoggedIn ? "Dashboard" : "Login",
      icon: "👤",
    },
  ];

  return (
    <nav className="fixed bottom-2 left-2 right-2 z-50 sm:hidden">
      <div className="neu-dark-card flex items-center px-1 py-1">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`flex-1 flex flex-col items-center justify-center py-2 gap-0.5 transition-colors ${
              pathname === item.href
                ? "text-accent"
                : "text-white/45 hover:text-white"
            }`}
          >
            <span className="text-xl leading-none">{item.icon}</span>
            <span className="text-[10px] font-medium">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
