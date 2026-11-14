import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-background pb-20 sm:pb-0">
      <div className="container grid gap-x-8 gap-y-10 py-14 md:grid-cols-2 xl:grid-cols-4">
        {/* Brand */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-x-2 text-h5 font-black font-heading"
          >
            <Image
              src="/brand/cre8-market-logo-transparent.svg"
              alt="Cre8 Market"
              width={954}
              height={257}
              loading="eager"
              className="h-10 w-auto shrink-0 object-contain"
            />
          </Link>
          <p className="mt-3 text-sm text-muted-foreground">
            Entebbe&apos;s #1 marketplace for New and secondhand electronics,
            phones, surplus goods and discounted products.
          </p>
        </div>

        {/* Useful links */}
        <nav aria-label="Useful links">
          <h3 className="mb-4 text-lg font-semibold">Useful Links</h3>
          <ul className="space-y-2.5 text-sm text-muted-foreground">
            <li>
              <Link className="hover:text-primary" href="/about">
                About Us
              </Link>
            </li>
            <li>
              <Link className="hover:text-primary" href="/contact">
                Contact
              </Link>
            </li>

            <li>
              <Link className="hover:text-primary" href="/deals">
                Deals
              </Link>
            </li>
            <li>
              <Link className="hover:text-primary" href="/install">
                Install
              </Link>
            </li>
            <li>
              <Link className="hover:text-primary" href="/subscription">
                Subscriptions
              </Link>
            </li>
          </ul>
        </nav>

        {/* Quick links */}
        <nav aria-label="Quick links">
          <h3 className="mb-4 text-lg font-semibold">Quick Links</h3>
          <ul className="space-y-2.5 text-sm text-muted-foreground">
            <li>
              <Link className="hover:text-primary" href="/selltous">
                Sell to Us
              </Link>
            </li>
            <li>
              <Link className="hover:text-primary" href="/products?sort=latest">
                Shop Now
              </Link>
            </li>
            <li>
              <Link className="hover:text-primary" href="/login">
                Login
              </Link>
            </li>
            <li>
              <Link className="hover:text-primary" href="/register">
                Become a Seller
              </Link>
            </li>
            <li>
              <Link className="hover:text-primary" href="/sellers">
                Our Sellers
              </Link>
            </li>
            {/* <li>
              <Link className="hover:text-primary" href="/admin">
                Admin Portal
              </Link>
            </li> */}
          </ul>
        </nav>

        {/* Contact */}
        <div>
          <h3 className="mb-4 text-lg font-semibold">Our Address</h3>
          <p className="text-sm text-muted-foreground">
            Kitoro, Entebbe, Uganda
          </p>
          <h3 className="mb-3 mt-5 text-lg font-semibold">Contact Info</h3>
          <ul className="space-y-2.5 text-sm text-muted-foreground">
            <li>
              <a href="tel:+256767155113" className="hover:text-primary">
                +256 767 155 113
              </a>
            </li>
            <li>
              <a
                href="mailto:raymonjohns@gmail.com"
                className="hover:text-primary"
              >
                raymonjohns@gmail.com
              </a>
            </li>
            <li>
              <a
                href="https://wa.me/256767155113"
                target="_blank"
                rel="noreferrer"
                className="hover:text-primary"
              >
                WhatsApp Us
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container flex flex-col items-center justify-between gap-2 py-5 text-center text-xs text-muted-foreground sm:flex-row">
          <p>© 2026 CRE8MARKET ENTEBBE. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-primary">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-primary">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
