import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SectionHeading from "./SectionHeading";

const collections = [
  {
    index: "01",
    badge: "Work & create",
    title: "Laptops built for big ideas.",
    description:
      "From everyday essentials to creative powerhouses — find the machine that keeps up with you.",
    cta: "Shop laptops",
    href: "/products?q=laptops",
    image:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1400&q=80",
    alt: "Laptop open on a desk",
    accent: "group-hover:bg-sky-300",
  },
  {
    index: "02",
    badge: "Play more",
    title: "Level up your setup.",
    description:
      "Consoles, controllers and accessories for the nights you never want to end.",
    cta: "Shop gaming",
    href: "/products?q=gaming",
    image:
      "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&w=1400&q=80",
    alt: "Gaming controller",
    accent: "group-hover:bg-violet-300",
  },
];

export default function CollectionShowcase() {
  return (
    <section className="container pt-16 sm:pt-24">
      <SectionHeading
        eyebrow="Curated collections"
        title="Find your next upgrade."
        description="Two collections, endlessly useful. Built from what locals are buying most."
      />

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {collections.map((collection) => (
          <Link
            key={collection.title}
            href={collection.href}
            className="group relative flex min-h-[380px] flex-col justify-end overflow-hidden rounded-[2rem] border border-border/70 p-6 sm:min-h-[460px] sm:p-8"
          >
            <Image
              src={collection.image}
              alt={collection.alt}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition duration-[900ms] ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#021321] via-[#021321]/55 to-[#021321]/10" />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />

            <span className="absolute right-6 top-5 font-heading text-5xl font-black tracking-tighter text-white/10 sm:text-6xl">
              {collection.index}
            </span>

            <span className="relative z-10 inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.18em] text-white backdrop-blur sm:text-[10px]">
              {collection.badge}
            </span>

            <h3 className="relative z-10 mt-4 max-w-sm font-heading text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              {collection.title}
            </h3>
            <p className="relative z-10 mt-3 max-w-md text-sm leading-relaxed text-white/65">
              {collection.description}
            </p>

            <span
              className={`relative z-10 mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-background transition duration-300 ${collection.accent}`}
            >
              {collection.cta}
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
