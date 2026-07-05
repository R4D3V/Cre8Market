import Link from "next/link";
import Image from "next/image";

const pills = [
  "📱 Phones",
  "💻 Laptops",
  "📺 TVs & Audio",
  "🧊 Appliances",
  "🚗 Vehicles",
  "🏠 Property",
  "👗 Fashion",
];

export default function HeroBanner() {
  return (
    <div className="bg-surface px-3 sm:px-4 pt-2 pb-8">
      <div className="max-w-7xl mx-auto">
        <div className="neu-dark-card text-white px-6 sm:px-10 py-12 sm:py-16 relative overflow-hidden">
          <Image
            src="/brand/hero.jpeg"
            alt=""
            fill
            priority
            className="absolute inset-0 object-cover object-center md:object-right"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/80 to-navy/60" />
          <div className="flex flex-col md:flex-row items-center justify-between gap-10 relative z-10">
            {/* Text */}
            <div className="flex-1 text-center md:text-left">
              <Image
                src="/brand/banner.webp"
                alt="Cre8 Market — Inspire. Innovate. Shop."
                width={1080}
                height={720}
                priority
                className="h-12 sm:h-14 w-auto object-contain mx-auto md:mx-0 mb-6"
              />
              <p className="eyebrow text-accent">
                Buy · Sell · Discover · Entebbe, Uganda
              </p>
              <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-4">
                Business made simple.
                <br />
                <span className="text-accent">No thirdparty.</span>
              </h1>
              <p className="text-white/60 text-base mb-8 max-w-md mx-auto md:mx-0">
                Direct to seller, no middleman. As a local marketplace, we
                connect buyers and sellers in Entebbe, Uganda. Listed items
                reach thousands of potential buyers instantly.
              </p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-9">
                <Link
                  href="/about"
                  className="neu-dark-pill bg-accent hover:bg-accent-dark text-navy font-bold px-6 py-3 text-sm transition-all"
                >
                  About Us
                </Link>
                <Link
                  href="/products"
                  className="neu-dark-pill text-white font-bold px-6 py-3 text-sm transition-all"
                >
                  Browse Listings
                </Link>
              </div>

              {/* Category pill row */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                {pills.map((p) => (
                  <span
                    key={p}
                    className="neu-dark-pill text-white/70 text-xs font-medium px-3.5 py-1.5"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>

            {/* Steps */}
            <div className="flex flex-col gap-3 shrink-0 w-full md:w-auto">
              {[
                { step: "1", text: "Contact the seller directly" },
                { step: "2", text: "Sell to us your item if its worth it" },
                { step: "3", text: "Strictly business" },
              ].map((s) => (
                <div
                  key={s.step}
                  className="neu-dark-card flex items-center gap-3 px-4 py-3.5 min-w-[260px]"
                >
                  <span className="neu-dark-pill w-8 h-8 bg-accent text-navy font-bold text-sm flex items-center justify-center shrink-0">
                    {s.step}
                  </span>
                  <span className="text-white/85 text-sm font-medium">
                    {s.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
