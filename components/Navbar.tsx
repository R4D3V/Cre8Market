"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();
  const isUser = session?.user != null;
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background shadow-lg lg:shadow-none">
      <div className="container flex items-center justify-between gap-x-4 py-3">
        <Link
          href="/"
          className="flex items-center gap-x-2 text-h5 font-black font-heading"
        >
          <Image
            src="/brand/logo.webp"
            alt="Cre8 Market"
            width={1080}
            height={1080}
            className="size-8 shrink-0 rounded-lg object-contain"
          />
          Cre8<span className="text-primary">Market</span>
        </Link>

        <form
          action="/products"
          method="get"
          className="relative hidden flex-1 max-w-xl lg:block"
        >
          <input
            type="search"
            name="q"
            placeholder="Search products…"
            autoComplete="off"
            className="w-full rounded-md border border-border bg-card px-4 py-2.5 pr-11 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
          />
          <button
            type="submit"
            aria-label="Search"
            className="absolute right-0 top-0 grid h-full w-10 place-items-center rounded-r-md text-muted-foreground transition hover:bg-primary hover:text-background"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-4"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </svg>
          </button>
        </form>

        <div className="flex items-center gap-x-3">
          {isUser ? (
            <>
              <Link
                href="/dashboard"
                className="hidden items-center gap-x-1.5 text-sm font-semibold text-foreground sm:flex"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="size-5"
                >
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-sm font-semibold text-muted-foreground transition hover:text-foreground"
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link
              href="/login"
              aria-label="Sign in"
              className="flex items-center gap-x-1.5 text-sm font-semibold text-foreground"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-5"
              >
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <span className="hidden sm:inline">Account</span>
            </Link>
          )}

          <Link
            href="/selltous"
            className="hidden button bg-primary px-4 py-2 text-sm text-primary-foreground md:inline-flex"
          >
            Sell to Us
          </Link>

          <button
            className="lg:hidden"
            aria-label="Open menu"
            onClick={() => setMobileOpen((v) => !v)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-6 text-foreground"
            >
              <line x1="4" x2="20" y1="12" y2="12"></line>
              <line x1="4" x2="20" y1="6" y2="6"></line>
              <line x1="4" x2="20" y1="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>

      <nav className="hidden bg-primary text-primary-foreground lg:block">
        <div className="container flex items-center justify-between py-2.5 text-sm font-semibold">
          <div className="flex items-center gap-x-6">
            <span className="flex cursor-pointer items-center gap-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-4"
              >
                <line x1="4" x2="20" y1="12" y2="12"></line>
                <line x1="4" x2="20" y1="6" y2="6"></line>
                <line x1="4" x2="20" y1="18" y2="18"></line>
              </svg>
              <Link href="/products">All Categories</Link>
            </span>
            <Link className="hover:underline" href="/products">
              Products
            </Link>
            <Link className="hover:underline" href="/deals">
              Deals
            </Link>
            <Link className="hover:underline" href="/contact">
              Contact
            </Link>
          </div>
          <div className="flex items-center gap-x-6">
            <Link className="hover:underline" href="/products">
              Limited Sale 🔥
            </Link>
            <Link className="hover:underline" href="/products?sort=latest">
              New Arrivals
            </Link>
            <Link className="hover:underline" href="/selltous">
              Sell to Us
            </Link>
          </div>
        </div>
      </nav>

      {mobileOpen && (
        <div className="border-t border-border bg-background lg:hidden">
          <div className="container flex flex-col py-2">
            <form
              action="/products"
              method="get"
              className="relative mb-2 flex"
            >
              <input
                type="search"
                name="q"
                placeholder="Search products…"
                autoComplete="off"
                className="w-full rounded-md border border-border bg-card px-4 py-2.5 pr-11 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
              />
              <button
                type="submit"
                aria-label="Search"
                className="absolute right-0 top-0 grid h-full w-10 place-items-center rounded-r-md text-muted-foreground"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="size-4"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.3-4.3"></path>
                </svg>
              </button>
            </form>
            <div className="flex flex-col divide-y divide-border">
              <Link
                href="/products"
                className="py-2.5 text-sm font-semibold text-foreground"
              >
                All Categories
              </Link>
              <Link
                href="/products"
                className="py-2.5 text-sm font-semibold text-foreground"
              >
                Products
              </Link>
              <Link
                href="/deals"
                className="py-2.5 text-sm font-semibold text-foreground"
              >
                Limited Sale 🔥
              </Link>
              <Link
                href="/products?sort=latest"
                className="py-2.5 text-sm font-semibold text-foreground"
              >
                New Arrivals
              </Link>
              <Link
                href="/contact"
                className="py-2.5 text-sm font-semibold text-foreground"
              >
                Contact
              </Link>
              <Link
                href="/selltous"
                className="py-2.5 text-sm font-semibold text-foreground"
              >
                Sell to Us
              </Link>
              {isUser ? (
                <Link
                  href="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="py-2.5 text-sm font-semibold text-foreground"
                >
                  My Dashboard
                </Link>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="py-2.5 text-sm font-semibold text-foreground"
                >
                  Login / Register
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}