import { ArrowUpRight, Clock, Flame, Package, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";

function formatPrice(price: number) {
  return `UGX ${price.toLocaleString("en-UG")}`;
}

interface Props {
  product: Product;
  size?: "default" | "small";
  variant?: "light" | "dark";
  source?: "default" | "deals";
}

export default function ProductCard({
  product,
  size = "default",
  variant = "light",
  source = "default",
}: Props) {
  const dark = variant === "dark";
  const productHref =
    source === "deals" ? `/products/${product.slug}?from=deals` : `/products/${product.slug}`;
  const aspect = size === "small" ? "aspect-[4/3]" : "aspect-[4/5]";

  return (
    <Link
      href={productHref}
      data-testid="product-card"
      className={`group relative flex flex-col overflow-hidden rounded-2xl border transition duration-300 hover:-translate-y-1.5 hover:border-primary/50 hover:shadow-[0_28px_60px_-30px_rgba(0,0,0,0.9)] ${
        dark ? "border-border/70 bg-card" : "border-border/60 bg-card/80"
      }`}
    >
      {/* Image */}
      <div
        className={`relative ${aspect} overflow-hidden`}
        style={{ backgroundColor: product.categoryBg ?? "#0a2238" }}
      >
        {product.images?.[0] ? (
          <Image
            src={product.images[0]}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition duration-700 ease-out group-hover:scale-[1.06]"
          />
        ) : product.categoryIcon ? (
          <span className="grid h-full w-full place-items-center text-5xl opacity-70 transition duration-500 group-hover:scale-110">
            {product.categoryIcon}
          </span>
        ) : (
          <span className="grid h-full w-full place-items-center text-primary/50 transition duration-500 group-hover:scale-110">
            <Package className="h-12 w-12" aria-hidden="true" />
          </span>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-[#021321]/80 via-transparent to-transparent opacity-80" />

        {/* Badges */}
        <div className="absolute inset-x-3 top-3 flex items-start justify-between gap-2">
          <div className="flex flex-col gap-1.5">
            {product.featured && (
              <span className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/15 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-primary backdrop-blur">
                <Sparkles className="h-2.5 w-2.5" />
                Featured
              </span>
            )}
            {product.isDeal && (
              <span className="inline-flex items-center gap-1 rounded-full border border-amber-300/30 bg-amber-400/20 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-amber-200 backdrop-blur">
                <Flame className="h-2.5 w-2.5" />
                Deal
              </span>
            )}
          </div>
        </div>

        {product.condition && (
          <span className="absolute bottom-3 left-3 rounded-full border border-white/15 bg-black/40 px-2.5 py-1 text-[9px] font-semibold text-white/90 backdrop-blur">
            {product.condition}
          </span>
        )}

        <span className="absolute bottom-3 right-3 grid h-9 w-9 translate-y-2 place-items-center rounded-full bg-white text-background opacity-0 shadow-lg transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col p-3.5 sm:p-4">
        <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-primary/80 sm:text-[10px]">
          {product.category}
        </span>
        <p className="mt-1.5 line-clamp-2 text-sm font-semibold leading-snug text-foreground">
          {product.title}
        </p>

        <div className="mt-auto flex items-end justify-between gap-2 pt-3.5">
          <span className="whitespace-nowrap font-heading text-[13px] font-extrabold tracking-tight text-primary sm:text-base">
            {formatPrice(product.price)}
          </span>
          <span className="hidden shrink-0 items-center gap-1 text-[10px] text-muted-foreground sm:flex">
            <Clock className="h-3 w-3" />
            {product.timeAgo}
          </span>
        </div>
      </div>
    </Link>
  );
}
