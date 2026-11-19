// Shared subscription plan definitions used across the subscription page,
// registration summary and the user dashboard.

export interface Plan {
  name: string;
  price: string;
  period: string;
  highlight: boolean;
  icon: "user" | "star" | "rocket";
  features: string[];
  cta: string;
}

export const PLANS: Plan[] = [
  {
    name: "Free",
    price: "UGX 0",
    period: "Free Forever",
    highlight: false,
    icon: "user",
    features: [
      "Up to 5 active product listings",
      "Up to 3 photos per listing",
      "Direct WhatsApp and phone contact",
    ],
    cta: "Start Free",
  },
  {
    name: "Standard",
    price: "UGX 10,000",
    period: "2 Months",
    highlight: true,
    icon: "star",
    features: [
      "Up to 30 active product listings",
      "Up to 5 photos per listing",
      "Verified seller badge (after verification)",
      "Direct WhatsApp and phone contact",
    ],
    cta: "Get Standard",
  },
  {
    name: "Premium",
    price: "UGX 35,000",
    period: "2 Months",
    highlight: false,
    icon: "rocket",
    features: [
      "Unlimited active product listings",
      "Up to 7 photos per listing",
      "Verified seller badge (after verification)",
      "Featured product opportunities",
    ],
    cta: "Get Premium",
  },
];

export const PLAN_BENEFITS = [
  "No commission on sales.",
  "Deal directly with buyers.",
  "Manage your own products and prices.",
  "Reach more potential customers.",
  "Choose a subscription that suits your business.",
];

export const PLAN_SLOGAN = "CRE8 MARKET – Your Marketplace, Your Business, Your Rules!";

export type PlanName = "Free" | "Standard" | "Premium";

// ── Listing limits ──────────────────────────────────────────────────────────
// Single source of truth for both the new-listing UI and the Server Actions.
// `listings: null` means unlimited.
export interface PlanLimits {
  listings: number | null;
  images: number;
}

export const PLAN_LIMITS: Record<PlanName, PlanLimits> = {
  Free: { listings: 5, images: 3 },
  Standard: { listings: 30, images: 5 },
  Premium: { listings: null, images: 7 },
};

// Admin store listings aren't tied to a subscription, so they get the highest
// tier's photo allowance.
export const ADMIN_IMAGE_LIMIT = PLAN_LIMITS.Premium.images;

export function planForPerks(perks: {
  isVerified?: boolean | null;
  isVip?: boolean | null;
}): PlanName {
  if (perks.isVip) return "Premium";
  if (perks.isVerified) return "Standard";
  return "Free";
}

export function limitsForPerks(perks: {
  isVerified?: boolean | null;
  isVip?: boolean | null;
}): PlanLimits {
  return PLAN_LIMITS[planForPerks(perks)];
}

export function planTierFromName(name?: string | null): PlanName | null {
  if (!name) return null;
  const lower = name.toLowerCase();
  if (lower.includes("premium") || lower.includes("vip")) return "Premium";
  if (lower.includes("standard") || lower.includes("verified")) return "Standard";
  if (lower.includes("free")) return "Free";
  return null;
}

export function getCurrentPlanName(user: {
  isVerified?: boolean | null;
  isVip?: boolean | null;
}): PlanName {
  if (user?.isVip) return "Premium";
  if (user?.isVerified) return "Standard";
  return "Free";
}

export function getPlanByName(name: PlanName): Plan | undefined {
  return PLANS.find((p) => p.name === name);
}
