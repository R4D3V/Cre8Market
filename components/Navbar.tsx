"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  ChevronRight,
  Flame,
  LayoutDashboard,
  LogIn,
  LogOut,
  MapPin,
  Menu,
  MessageCircle,
  Search,
  ShoppingBag,
  Sparkles,
  UserRound,
  Users,
  X,
} from "lucide-react";
import { useSession, signOut } from "@/lib/auth-client";
import { fetchMyProfileAction } from "@/lib/actions/users";
import { fetchMyAdminProfileAction } from "@/lib/actions/admin";

const DESKTOP_LINKS = [
  { href: "/products", label: "All Products", Icon: ShoppingBag },
  { href: "/deals", label: "Deals", Icon: Flame },
  { href: "/sellers", label: "Sellers", Icon: Users },
];

const MOBILE_LINKS = [
  {
    href: "/products",
    label: "All Products",
    description: "Browse every listing",
    Icon: ShoppingBag,
  },
  {
    href: "/deals",
    label: "Deals",
    description: "Limited-time offers",
    Icon: Flame,
  },
  {
    href: "/sellers",
    label: "Sellers",
    description: "Meet verified sellers",
    Icon: Users,
  },
  {
    href: "/products?sort=latest",
    label: "New Arrivals",
    description: "Fresh on the market",
    Icon: Sparkles,
  },
  {
    href: "/contact",
    label: "Contact",
    description: "Talk to our team",
    Icon: MessageCircle,
  },
];

export default function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const isUser = session?.user != null;
  const isAdmin = session?.user?.role === "admin";
  const [mobileOpen, setMobileOpen] = useState(false);

  // Session records don't always carry the latest avatar or name (legacy
  // accounts keep them on the user profile), so load the profile directly.
  const sessionAvatar = session?.user?.image ?? null;
  const userId = session?.user?.id ?? null;
  const [loadedProfile, setLoadedProfile] = useState<{
    id: string;
    avatar: string | null;
    name: string | null;
  } | null>(null);
  const liveProfile = loadedProfile?.id === userId ? loadedProfile : null;
  const displayName =
    liveProfile?.name?.trim() ||
    session?.user?.name?.trim() ||
    (isAdmin ? "Admin" : "Account");
  const initial = displayName.charAt(0).toUpperCase();
  const avatar = liveProfile?.avatar ?? sessionAvatar;

  useEffect(() => {
    if (!isUser || !userId) return;
    let active = true;
    const load = isAdmin
      ? fetchMyAdminProfileAction()
      : fetchMyProfileAction();
    load
      .then((profile) => {
        if (active) {
          setLoadedProfile({
            id: userId,
            avatar: profile?.avatar ?? null,
            name: profile?.name ?? null,
          });
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [isUser, isAdmin, userId, pathname]);

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  function handleSignOut() {
    setMobileOpen(false);
    signOut().then(() => {
      router.push("/");
      router.refresh();
    });
  }

  return (
    <header
      className="sticky top-0 z-50 border-b border-border/50 bg-background/85 backdrop-blur-2xl"
      style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
    >
      {/* Ambient top edge */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-primary/[0.035] via-transparent to-secondary/[0.05]"
      />

      <div className="container relative">
        <div className="flex items-center gap-3 py-3 lg:gap-6">
          {/* Logo */}
          <Link
            href="/"
            aria-label="CRE8MARKET home"
            className="group flex shrink-0 items-center"
          >
            <Image
              src="/brand/cre8-market-logo-transparent.svg"
              alt="Cre8 Market"
              width={954}
              height={257}
              loading="eager"
              className="h-8 w-auto shrink-0 object-contain transition-transform duration-300 group-hover:scale-[1.02] sm:h-9"
            />
          </Link>

          {/* Desktop search */}
          <form
            action="/products"
            method="get"
            className="relative hidden w-full max-w-2xl flex-1 lg:block"
          >
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              name="q"
              aria-label="Search products"
              placeholder="Search phones, laptops, deals…"
              autoComplete="off"
              className="h-11 w-full rounded-full border border-border/60 bg-muted/25 pl-11 pr-14 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary/50 focus:bg-muted/40 focus:ring-2 focus:ring-primary/10"
            />
            <button
              type="submit"
              aria-label="Search"
              className="absolute right-1.5 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-full bg-primary/10 text-primary transition hover:bg-primary hover:text-primary-foreground"
            >
              <ArrowRight className="size-4" />
            </button>
          </form>

          {/* Account + actions */}
          <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
            {isUser ? (
              <>
                <Link
                  href={isAdmin ? "/admin" : "/dashboard"}
                  className="group inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/20 py-1.5 pl-1.5 pr-2.5 text-xs font-semibold text-foreground transition hover:border-primary/40 hover:bg-muted/40"
                >
                  {avatar ? (
                    <Image
                      src={avatar}
                      alt={`${displayName} profile photo`}
                      width={28}
                      height={28}
                      unoptimized
                      className="size-7 shrink-0 rounded-full object-cover ring-1 ring-primary/20"
                    />
                  ) : (
                    <span className="grid size-7 shrink-0 place-items-center rounded-full bg-gradient-to-br from-primary/25 to-primary/10 text-[10px] font-bold text-primary">
                      {initial}
                    </span>
                  )}
                  <span className="max-w-20 truncate max-[400px]:hidden sm:max-w-24 lg:max-w-28">
                    {displayName}
                  </span>
                  <LayoutDashboard className="hidden size-3.5 text-muted-foreground transition group-hover:text-primary sm:block" />
                </Link>
                <button
                  type="button"
                  onClick={handleSignOut}
                  aria-label="Sign out"
                  className="grid size-9 place-items-center rounded-full text-muted-foreground transition hover:bg-muted/30 hover:text-foreground"
                >
                  <LogOut className="size-4" />
                </button>
              </>
            ) : (
              <Link
                href="/login"
                aria-label="Login"
                className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/20 px-3 py-2 text-xs font-semibold text-foreground transition hover:border-primary/40 hover:bg-muted/40"
              >
                <UserRound className="size-4 text-muted-foreground" />
                <span className="hidden sm:inline">Login</span>
              </Link>
            )}

            <Link
              href="/selltous"
              className="group hidden items-center gap-1.5 rounded-full bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground shadow-[0_14px_34px_-18px_rgba(109,232,124,0.9)] transition hover:bg-primary/90 md:inline-flex"
            >
              Sell to Us
              <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>

            <button
              type="button"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-navigation"
              onClick={() => setMobileOpen((v) => !v)}
              className="grid size-10 place-items-center rounded-full border border-border/60 bg-muted/20 text-foreground transition hover:border-primary/40 hover:bg-muted/40 lg:hidden"
            >
              {mobileOpen ? (
                <X className="size-5" />
              ) : (
                <Menu className="size-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Desktop secondary navigation */}
      <div className="relative hidden border-t border-border/40 lg:block">
        <div className="container flex items-center justify-between py-2">
          <nav aria-label="Shop navigation" className="flex items-center gap-1">
            {DESKTOP_LINKS.map(({ href, label, Icon }) => {
              const active = isActive(href);
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`group inline-flex items-center gap-2 rounded-full px-3 py-2 text-[13px] font-semibold transition ${
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted/30 hover:text-foreground"
                  }`}
                >
                  <Icon className="size-3.5" />
                  {label}
                  {label === "Deals" && (
                    <span className="ml-0.5 rounded-full bg-primary/10 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-[0.08em] text-primary">
                      Hot
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3 text-[11px] font-medium text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-3.5 text-primary/80" />
              Kitoro, Entebbe
            </span>
            <span aria-hidden="true" className="h-3 w-px bg-border/70" />
            <span className="inline-flex items-center gap-1.5">
              <BadgeCheck className="size-3.5 text-primary/80" />
              Verified sellers
            </span>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          id="mobile-navigation"
          className="relative border-t border-border/50 bg-background/95 backdrop-blur-2xl lg:hidden"
        >
          <div className="container max-h-[calc(100dvh-4.5rem)] overflow-y-auto py-4">
            <form action="/products" method="get" className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                name="q"
                aria-label="Search products"
                placeholder="Search phones, laptops, deals…"
                autoComplete="off"
                className="h-11 w-full rounded-full border border-border/60 bg-muted/25 pl-11 pr-14 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary/50 focus:bg-muted/40"
              />
              <button
                type="submit"
                aria-label="Search"
                className="absolute right-1.5 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-full bg-primary/10 text-primary transition hover:bg-primary hover:text-primary-foreground"
              >
                <ArrowRight className="size-4" />
              </button>
            </form>

            <nav aria-label="Mobile navigation" className="mt-4 grid gap-1">
              {MOBILE_LINKS.map(({ href, label, description, Icon }) => {
                const active = isActive(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={`group flex items-center gap-3 rounded-2xl border p-2.5 transition ${
                      active
                        ? "border-primary/25 bg-primary/10"
                        : "border-transparent hover:border-border/60 hover:bg-muted/30"
                    }`}
                  >
                    <span
                      className={`grid size-9 shrink-0 place-items-center rounded-xl border ${
                        active
                          ? "border-primary/25 bg-primary/15 text-primary"
                          : "border-border/60 bg-card/60 text-muted-foreground group-hover:text-primary"
                      }`}
                    >
                      <Icon className="size-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span
                        className={`block text-sm font-bold ${
                          active ? "text-primary" : "text-foreground"
                        }`}
                      >
                        {label}
                      </span>
                      <span className="block text-[11px] text-muted-foreground">
                        {description}
                      </span>
                    </span>
                    <ChevronRight className="size-4 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-primary" />
                  </Link>
                );
              })}
            </nav>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <Link
                href="/selltous"
                onClick={() => setMobileOpen(false)}
                className="inline-flex items-center justify-center gap-1.5 rounded-full bg-primary px-4 py-3 text-sm font-bold text-primary-foreground transition hover:bg-primary/90"
              >
                Sell to Us
                <ArrowUpRight className="size-4" />
              </Link>
              <Link
                href={isUser ? (isAdmin ? "/admin" : "/dashboard") : "/login"}
                onClick={() => setMobileOpen(false)}
                className="inline-flex items-center justify-center gap-1.5 rounded-full border border-border/70 bg-muted/30 px-4 py-3 text-sm font-semibold text-foreground transition hover:border-primary/40 hover:text-primary"
              >
                {isUser ? (
                  avatar ? (
                    <Image
                      src={avatar}
                      alt={`${displayName} profile photo`}
                      width={20}
                      height={20}
                      unoptimized
                      className="size-5 shrink-0 rounded-full object-cover ring-1 ring-primary/20"
                    />
                  ) : (
                    <span className="grid size-5 shrink-0 place-items-center rounded-full bg-gradient-to-br from-primary/25 to-primary/10 text-[9px] font-bold text-primary">
                      {initial}
                    </span>
                  )
                ) : (
                  <LogIn className="size-4" />
                )}
                {isUser ? displayName : "Login / Register"}
              </Link>
            </div>

            {isUser && (
              <button
                type="button"
                onClick={handleSignOut}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-full py-2.5 text-xs font-semibold text-muted-foreground transition hover:text-foreground"
              >
                <LogOut className="size-3.5" />
                Sign out
              </button>
            )}

            <p className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
              <MapPin className="size-3 text-primary/80" />
              Kitoro, Entebbe · Fast local deals
            </p>
          </div>
        </div>
      )}
    </header>
  );
}
