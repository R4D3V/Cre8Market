import { ArrowRight, BadgeCheck, ImageOff, type LucideIcon, UserX } from "lucide-react";
import Link from "next/link";
import type { AdminOverview } from "@/lib/db/queries";
import { AdminSection } from "./AdminSection";

type AttentionRow = {
  label: string;
  hint: string;
  count: number;
  href: string;
  icon: LucideIcon;
};

export function NeedsAttention({
  needsAttention,
}: {
  needsAttention: AdminOverview["needsAttention"];
}) {
  const rows: AttentionRow[] = [
    {
      label: "Sellers with listings, unverified",
      hint: "Verified sellers get a badge and more listings.",
      count: needsAttention.unverifiedSellers,
      href: "/admin/sellers?verified=unverified",
      icon: BadgeCheck,
    },
    {
      label: "Inactive sellers",
      hint: "Disabled sellers cannot sign in or get found.",
      count: needsAttention.inactiveSellers,
      href: "/admin/sellers?status=inactive",
      icon: UserX,
    },
    {
      label: "Inactive buyers",
      hint: "Disabled buyers cannot sign in or start a chat.",
      count: needsAttention.inactiveBuyers,
      href: "/admin/buyers?status=inactive",
      icon: UserX,
    },
    {
      label: "Listings without images",
      hint: "Buyers skip listings with no photo.",
      count: needsAttention.missingImages,
      href: "/admin/products?missingImages=1",
      icon: ImageOff,
    },
  ];

  return (
    <AdminSection
      title="Needs attention"
      description="A short work queue for the marketplace."
      className="h-full"
    >
      <ul className="space-y-2">
        {rows.map(({ label, hint, count, href, icon: Icon }) => (
          <li key={label}>
            <Link
              href={href}
              className="group flex items-center gap-3 rounded-xl border border-border/60 bg-muted/15 p-3 transition hover:border-primary/40 hover:bg-primary/5"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-primary/25 bg-primary/10 text-primary">
                <Icon className="size-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-foreground">{label}</span>
                <span className="block text-xs text-muted-foreground">{hint}</span>
              </span>
              <span
                className={`shrink-0 rounded-full border px-2 py-0.5 text-xs font-bold ${
                  count > 0
                    ? "border-amber-500/30 bg-amber-500/10 text-amber-700"
                    : "border-emerald-500/25 bg-emerald-500/10 text-emerald-700"
                }`}
              >
                {count > 0 ? count : "Clear"}
              </span>
              <ArrowRight className="size-4 shrink-0 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-primary" />
            </Link>
          </li>
        ))}
      </ul>
    </AdminSection>
  );
}
