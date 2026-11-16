import Link from "next/link";
import { ArrowRight, ImagePlus, Store } from "lucide-react";
import { AdminSection } from "./AdminSection";

export function StoreIdentityCard({
  avatar,
  banner,
}: {
  avatar: string | null;
  banner: string | null;
}) {
  return (
    <AdminSection
      title="Store identity"
      description="The CRE8MARKET storefront on the public sellers directory."
      action={
        <Link
          href="/admin/profile"
          className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
        >
          Edit branding
          <ArrowRight className="size-3.5" />
        </Link>
      }
      className="h-full"
    >
      <div className="overflow-hidden rounded-xl border border-border/60 bg-muted/20">
        <div className="relative h-24 w-full overflow-hidden bg-gradient-to-r from-primary/25 via-primary/10 to-secondary/20">
          {banner ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={banner}
              alt="Store banner"
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="absolute inset-0 grid place-items-center text-muted-foreground">
              <ImagePlus className="size-5" />
            </span>
          )}
        </div>
        <div className="relative px-4 pb-4">
          <div className="-mt-7 flex items-end gap-3">
            <span className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-2 border-card bg-primary text-xl font-bold text-primary-foreground">
              {avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatar}
                  alt="Store avatar"
                  className="h-full w-full object-cover"
                />
              ) : (
                "C"
              )}
            </span>
            <div className="min-w-0 flex-1 pb-1">
              <p className="truncate font-heading text-base font-extrabold text-foreground">
                CRE8MARKET
              </p>
              <p className="text-xs text-muted-foreground">
                {avatar ? "Store profile photo set" : "No profile photo yet"}
              </p>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <Link
              href="/sellers/store"
              className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-card px-3 py-1.5 text-xs font-bold text-foreground transition hover:border-primary/40 hover:text-primary"
            >
              <Store className="size-3.5" />
              View storefront
            </Link>
            <p className="text-[11px] text-muted-foreground">
              Shown on /sellers and /sellers/store.
            </p>
          </div>
        </div>
      </div>
    </AdminSection>
  );
}
