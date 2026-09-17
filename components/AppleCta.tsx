import Link from "next/link";
import Image from "next/image";

export default function AppleCta() {
  return (
    <section className="category-tint-2 border-y border-border">
      <div className="container grid items-center gap-x-10 py-14 lg:grid-cols-2">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            Inside the Apple brand
          </p>
          <h2 className="mt-3 text-h2-sm sm:text-h2 font-heading">
            Think Different. Shop Apple.
          </h2>
          <Link
            href="/products?q=apple"
            className="button mt-6 bg-primary px-8 py-3 text-primary-foreground hover:bg-background hover:text-primary"
          >
            Shop Now
          </Link>
        </div>
        <div className="relative mx-auto hidden aspect-[616/409] w-full max-w-[616px] lg:block">
          <Image
            src="/images/site/cta-img.webp"
            alt="Apple devices"
            fill
            sizes="100vw"
            className="rounded-xl object-cover"
          />
        </div>
      </div>
    </section>
  );
}