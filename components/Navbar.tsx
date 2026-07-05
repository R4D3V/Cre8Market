"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const router = useRouter();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/products?q=${encodeURIComponent(search.trim())}`);
    }
  }

  return (
    <header className="bg-surface sticky top-0 z-50 pt-3 pb-2 px-3 sm:px-4">
      <div className="max-w-7xl mx-auto">
        <div className="neu-dark-card px-4 sm:px-6">
          {/* Top bar */}
          <div className="flex items-center justify-between py-2.5 gap-4">
            {/* Logo */}
            <Link href="/" className="shrink-0 flex items-center">
              <Image
                src="/brand/logo.webp"
                alt="Cre8 Market"
                width={1080}
                height={720}
                priority
                className="h-9 sm:h-11 w-auto object-contain"
              />
            </Link>

            {/* Search bar */}
            <form
              onSubmit={handleSearch}
              className="flex-1 max-w-2xl hidden sm:flex"
            >
              <div className="neu-dark-inset flex w-full rounded-full overflow-hidden">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="bg-transparent text-white/80 text-sm pl-4 pr-2 py-2.5 focus:outline-none cursor-pointer"
                >
                  <option value="All" className="text-gray-900">
                    All
                  </option>
                  <option value="electronics" className="text-gray-900">
                    Electronics
                  </option>
                  <option value="phones-tablets" className="text-gray-900">
                    Phones & Tablets
                  </option>
                  <option value="computers-laptops" className="text-gray-900">
                    Computers
                  </option>
                  <option value="home-appliances" className="text-gray-900">
                    Home Appliances
                  </option>
                  <option value="vehicles" className="text-gray-900">
                    Vehicles
                  </option>
                  <option value="property" className="text-gray-900">
                    Property
                  </option>
                </select>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search listings…"
                  className="flex-1 bg-transparent text-white px-3 py-2.5 text-sm focus:outline-none placeholder:text-white/40"
                />
                <button
                  type="submit"
                  className="neu-dark-pill bg-accent text-navy px-5 py-2 m-1 font-bold text-sm transition-all"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Mobile actions (visible on small screens) */}
            <div className="flex items-center gap-2 shrink-0 sm:hidden">
              <Link
                href="/login"
                className="text-white/70 hover:text-white text-sm font-medium transition-colors px-2 py-1.5"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="text-white/70 hover:text-white text-sm font-medium transition-colors px-2 py-1.5"
              >
                Register
              </Link>
              <Link
                href="/selltous"
                className="neu-dark-pill bg-accent hover:bg-accent-dark text-navy font-bold text-xs px-3 py-1.5 transition-all flex items-center gap-1"
              >
                Sell to Us
              </Link>
            </div>

            {/* Desktop actions (hidden on small screens) */}
            <div className="hidden sm:flex items-center gap-2 shrink-0">
              <Link
                href="/login"
                className="text-white/70 hover:text-white text-sm font-medium transition-colors px-3 py-2"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="text-white/70 hover:text-white text-sm font-medium transition-colors px-3 py-2"
              >
                Register Free
              </Link>
              <Link
                href="/selltous"
                className="neu-dark-pill bg-accent hover:bg-accent-dark text-navy font-bold text-sm px-4 py-2 transition-all flex items-center gap-1"
              >
                Sell to Us
              </Link>
            </div>
          </div>

          {/* Mobile search */}
          <form onSubmit={handleSearch} className="sm:hidden pb-3">
            <div className="neu-dark-inset flex rounded-full overflow-hidden">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search listings…"
                className="flex-1 bg-transparent text-white px-4 py-2.5 text-sm focus:outline-none placeholder:text-white/40"
              />
              <button
                type="submit"
                className="neu-dark-pill bg-accent text-navy px-4 py-2 m-1 font-bold text-sm"
              >
                Search
              </button>
            </div>
          </form>

          {/* Nav links */}
          <nav className="flex items-center justify-center gap-2 sm:gap-3 overflow-x-auto scrollbar-none py-2.5 px-1">
            {[
              { href: "/products", label: "Browse" },
              { href: "/deals", label: "Hot 🔥" },

              { href: "/selltous", label: "Sell to Us" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-white/70 hover:text-white text-sm font-medium px-3.5 py-1.5 rounded-full hover:bg-white/5 whitespace-nowrap transition-colors min-w-fit"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
