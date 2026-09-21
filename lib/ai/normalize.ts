const fallbackCategory = "electronics";

export function normalizeCategorySlug(
  value: string | undefined,
  validSlugs: string[],
) {
  if (!value) return fallbackCategory;
  const clean = String(value).trim().toLowerCase();
  if (validSlugs.includes(clean)) return clean;

  const exactMatch = validSlugs.find(
    (slug) =>
      slug === clean || slug.replace(/-/g, " ") === clean.replace(/-/g, " "),
  );
  if (exactMatch) return exactMatch;

  const keywordMap: Record<string, string> = {
    phone: "phones-tablets",
    laptop: "computers-laptops",
    computer: "computers-laptops",
    tv: "electronics",
    fridge: "home-appliances",
    washing: "home-appliances",
    freezer: "home-appliances",
    sofa: "furniture",
    chair: "furniture",
    shirt: "fashion",
    bag: "fashion",
    shoe: "fashion",
    bicycle: "vehicles",
    motorbike: "vehicles",
    drill: "tools",
    hammer: "tools",
    console: "gaming",
    playstation: "gaming",
    xbox: "gaming",
  };

  const lowered = clean.toLowerCase();
  for (const [keyword, slug] of Object.entries(keywordMap)) {
    if (lowered.includes(keyword)) return slug;
  }

  return validSlugs.includes("electronics")
    ? "electronics"
    : validSlugs[0] || fallbackCategory;
}

const ALLOWED_CONDITIONS = [
  "New",
  "Like New",
  "Used - Good",
  "Used - Fair",
  "Refurbished",
] as const;

export function normalizeCondition(value: string | undefined) {
  const cleaned = String(value ?? "").trim();
  return ALLOWED_CONDITIONS.includes(
    cleaned as (typeof ALLOWED_CONDITIONS)[number],
  )
    ? cleaned
    : "Used - Good";
}

export function normalizeSpecs(value: unknown) {
  if (typeof value === "string" && value.trim().length > 0) {
    return value.trim();
  }

  return "Condition: Good\nIncluded: Box and charger";
}

export function normalizePrice(value: unknown) {
  if (typeof value === "string") {
    const digits = value.replace(/[^\d]/g, "");
    if (digits) return digits;
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    return String(Math.max(0, Math.round(value)));
  }

  return "";
}