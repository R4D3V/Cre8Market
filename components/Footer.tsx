import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-surface mt-12 px-3 sm:px-4 pb-3">
      {/* Sell CTA card */}
      <div className="max-w-7xl mx-auto mb-3">
        <div className="neu-dark-card text-white py-12 px-6 text-center">
          <p className="eyebrow text-accent">We Buy &amp; Sell</p>
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-2">
            Got Something to Sell?
          </h2>
          <p className="text-white/55 text-sm max-w-md mx-auto mb-6">
            Send us your item — phone, TV, laptop, appliance, anything. We
            review it and send you a cash offer on WhatsApp, usually within a
            day.
          </p>
          <div className="flex justify-center gap-4 flex-wrap mb-7">
            {[
              "Offer within 24hrs",
              "Instant cash payment",
              "No obligation",
            ].map((f) => (
              <span
                key={f}
                className="flex items-center gap-1.5 text-sm text-white/60"
              >
                <span className="text-wa">✓</span> {f}
              </span>
            ))}
          </div>
          <Link
            href="/selltous"
            className="neu-dark-pill inline-flex items-center gap-2 bg-accent hover:bg-accent-dark text-navy font-bold px-6 py-3 text-sm transition-all"
          >
            Sell to CRE8MARKET ENTEBBE →
          </Link>
        </div>
      </div>

      {/* Links */}
      <div className="max-w-7xl mx-auto">
        <div className="neu-dark-card text-white">
          <div className="px-6 sm:px-10 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <Image
                src="/brand/logo.webp"
                alt="Cre8 Market"
                width={1080}
                height={1080}
                className="w-28 h-28 object-contain -ml-2 mb-1"
              />
              <p className="text-white/45 text-sm leading-relaxed">
                Entebbe's #1 marketplace for deals, surplus goods, and
                discounted products.
              </p>
              ?
            </div>

            {/* Browse */}
            <div>
              <p className="font-bold text-sm uppercase tracking-widest text-white/35 mb-3">
                Browse
              </p>
              <ul className="space-y-2 text-sm text-white/65">
                {[
                  { href: "/products", label: "All Listings" },
                  { href: "/deals", label: "Deals" },
                  { href: "/products?sort=latest", label: "Latest" },
                ].map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="hover:text-white transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Links */}
            <div>
              <p className="font-bold text-sm uppercase tracking-widest text-white/35 mb-3">
                Links
              </p>
              <ul className="space-y-2 text-sm text-white/65">
                {[
                  { href: "/register", label: "Become a Seller" },
                  { href: "/selltous", label: "Sell to Us" },
                  { href: "/sellers", label: "Sellers" },
                  { href: "/about", label: "About" },
                  { href: "/contact", label: "Contact" },
                ].map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="hover:text-white transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <p className="font-bold text-sm uppercase tracking-widest text-white/35 mb-3">
                Contact
              </p>
              <ul className="space-y-2 text-sm text-white/65">
                <li>Kitoro Entebbe Uganda</li>
                <li>
                  <a
                    href="mailto:raymonjohns@gmail.com"
                    className="hover:text-white transition-colors"
                  >
                    raymonjohns@gmail.com
                  </a>
                </li>
                <li>
                  <a
                    href="https://wa.me/256751621506"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-wa transition-colors flex items-center gap-1.5"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    WhatsApp Us
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-white/10 py-4 px-6 sm:px-10">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-white/35">
              <span>© 2026 CRE8MARKET ENTEBBE</span>
              <div className="flex gap-4">
                <Link
                  href="/about"
                  className="hover:text-white transition-colors"
                >
                  About
                </Link>
                <Link
                  href="/contact"
                  className="hover:text-white transition-colors"
                >
                  Contact
                </Link>
                <Link
                  href="/privacy"
                  className="hover:text-white transition-colors"
                >
                  Privacy
                </Link>
                <Link
                  href="/terms"
                  className="hover:text-white transition-colors"
                >
                  Terms
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
