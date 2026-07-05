import Link from "next/link";
import type { Product } from "@/lib/types";
import {
  formatPrice,
  getCategoryIcon,
  getCategoryColor,
  getCategoryBg,
} from "@/lib/data";

interface Props {
  product: Product;
  size?: "default" | "small";
}

export default function ProductCard({ product, size = "default" }: Props) {
  const icon = getCategoryIcon(product.categorySlug);
  const color = getCategoryColor(product.categorySlug);
  const bg = getCategoryBg(product.categorySlug);

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group neu-card neu-card-hover overflow-hidden flex flex-col"
    >
      {/* Image / Placeholder */}
      <div
        className="relative aspect-[4/3] flex items-center justify-center overflow-hidden rounded-t-3xl"
        style={{ backgroundColor: bg }}
      >
        <span className="text-5xl opacity-60 group-hover:scale-110 transition-transform duration-300">
          {icon}
        </span>
        {product.featured && (
          <span className="absolute top-2 left-2 bg-featured text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
            Featured
          </span>
        )}
        {product.condition && (
          <span
            className="absolute bottom-2 right-2 text-[10px] font-semibold px-2 py-0.5 rounded-full text-white"
            style={{ backgroundColor: color }}
          >
            {product.condition}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-3.5 flex flex-col gap-1 flex-1">
        <span
          className="text-[10px] font-semibold uppercase tracking-wide"
          style={{ color }}
        >
          {product.category}
        </span>
        <p className="text-sm font-semibold text-gray-900 line-clamp-2 leading-snug">
          {product.title}
        </p>
        <div className="flex items-center justify-between mt-auto pt-2">
          <span className="text-navy font-bold text-sm">
            {formatPrice(product.price)}
          </span>
          <span className="text-gray-400 text-[10px]">{product.timeAgo}</span>
        </div>
      </div>

      {/* CTA strip */}
      <div className="px-3.5 pb-3.5">
        <span className="text-xs text-navy font-medium group-hover:underline">
          View Product →
        </span>
      </div>
    </Link>
  );
}
