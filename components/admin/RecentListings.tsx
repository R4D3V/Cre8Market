import { ArrowRight, Package, Star, Tag } from "lucide-react";
import Link from "next/link";
import { formatPrice } from "@/lib/data";
import type { ProductWithOwner } from "@/lib/types";
import { AdminSection } from "./AdminSection";

export function RecentListings({ products }: { products: ProductWithOwner[] }) {
  return (
    <AdminSection
      title="Recent listings"
      description="The newest products added to the marketplace."
      action={
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
        >
          + Add product
          <ArrowRight className="size-3.5" />
        </Link>
      }
      className="h-full"
    >
      {products.length === 0 ? (
        <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-muted/15 p-3">
          <span className="flex size-8 items-center justify-center rounded-lg border border-primary/25 bg-primary/10 text-primary">
            <Package className="size-4" />
          </span>
          <p className="text-sm text-muted-foreground">No listings have been added yet.</p>
        </div>
      ) : (
        <ul className="divide-y divide-border/60">
          {products.map((product) => (
            <li key={product.id}>
              <Link
                href={`/admin/products/${product.id}/edit`}
                className="group flex items-center gap-3 py-2.5 first:pt-0 last:pb-0"
              >
                <span className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border/60 bg-muted">
                  {product.images?.[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={product.images[0]} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <Package className="size-4 text-muted-foreground" />
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-1.5">
                    <span className="truncate text-sm font-semibold text-foreground">
                      {product.title}
                    </span>
                    {product.featured && (
                      <Star
                        className="size-3 shrink-0 fill-current text-amber-500"
                        aria-label="Featured"
                      />
                    )}
                    {product.isDeal && (
                      <Tag className="size-3 shrink-0 text-primary" aria-label="Deal" />
                    )}
                  </span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {product.ownerType === "admin"
                      ? "CRE8MARKET store"
                      : (product.ownerName ?? "Unassigned")}{" "}
                    · {product.category}
                  </span>
                </span>
                <span className="shrink-0 text-right">
                  <span className="block text-sm font-bold text-foreground">
                    {formatPrice(product.price)}
                  </span>
                  <span className="block text-[11px] text-muted-foreground">Edit</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </AdminSection>
  );
}
