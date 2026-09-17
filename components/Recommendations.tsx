import Link from "next/link";
import Image from "next/image";

export default function Recommendations() {
  return (
    <section className="bg-card py-12">
      <div className="container grid gap-5 md:grid-cols-2">
        <Link
          href="/products"
          className="group relative min-h-56 overflow-hidden rounded-xl bg-background"
        >
          <Image
            src="/images/site/recommendation-1.webp"
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition group-hover:scale-105"
          />
          <div className="relative z-10 flex h-full flex-col items-start justify-center gap-y-2 bg-black/45 p-8 text-white">
            <p className="text-sm font-semibold uppercase text-primary">
              Curated for you
            </p>
            <h2 className="max-w-sm text-h4 sm:text-h3 font-heading">
              Recommendations just for your taste
            </h2>
            <span className="button mt-3 bg-primary px-6 py-2.5 text-sm text-primary-foreground">
              Shop Now
            </span>
          </div>
        </Link>

        <Link
          href="/deals"
          className="group relative min-h-56 overflow-hidden rounded-xl bg-background"
        >
          <Image
            src="/images/site/recommendation-2.webp"
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition group-hover:scale-105"
          />
          <div className="relative z-10 flex h-full flex-col items-start justify-center gap-y-2 bg-black/45 p-8 text-white">
            <p className="text-sm font-semibold uppercase text-primary">
              Limited time
            </p>
            <h2 className="max-w-sm text-h4 sm:text-h3 font-heading">
              Deals that won&apos;t last the week
            </h2>
            <span className="button mt-3 bg-secondary px-6 py-2.5 text-sm text-secondary-foreground">
              Grab a Deal
            </span>
          </div>
        </Link>
      </div>
    </section>
  );
}