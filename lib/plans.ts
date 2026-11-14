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
    features: ["Up to 3 active product listings", "Direct WhatsApp and phone contact"],
    cta: "Start Free",
  },
  {
    name: "Standard",
    price: "UGX 10,000",
    period: "2 Months",
    highlight: true,
    icon: "star",
    features: [
      "Up to 20 active product listings",
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