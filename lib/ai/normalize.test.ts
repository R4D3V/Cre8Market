import { describe, expect, it } from "vitest";
import {
  normalizeCategorySlug,
  normalizeCondition,
  normalizeSpecs,
  normalizePrice,
} from "./normalize";

const VALID_SLUGS = [
  "phones-tablets",
  "computers-laptops",
  "electronics",
  "home-appliances",
];

describe("normalizeCategorySlug", () => {
  it("passes through an exact valid slug", () => {
    expect(normalizeCategorySlug("phones-tablets", VALID_SLUGS)).toBe(
      "phones-tablets",
    );
  });

  it("trims, lowercases and accepts spaced variants", () => {
    expect(normalizeCategorySlug("  Phones-Tablets ", VALID_SLUGS)).toBe(
      "phones-tablets",
    );
    expect(normalizeCategorySlug("phones tablets", VALID_SLUGS)).toBe(
      "phones-tablets",
    );
  });

  it("maps product keywords to a category", () => {
    expect(normalizeCategorySlug("iPhone 13 Pro", VALID_SLUGS)).toBe(
      "phones-tablets",
    );
    expect(normalizeCategorySlug("gaming laptop", VALID_SLUGS)).toBe(
      "computers-laptops",
    );
    expect(normalizeCategorySlug("fridge for sale", VALID_SLUGS)).toBe(
      "home-appliances",
    );
  });

  it("falls back to electronics for unknown titles", () => {
    expect(normalizeCategorySlug("random gadget", VALID_SLUGS)).toBe(
      "electronics",
    );
    expect(normalizeCategorySlug(undefined, VALID_SLUGS)).toBe("electronics");
  });

  it("falls back to the first valid slug when electronics is missing", () => {
    expect(
      normalizeCategorySlug("random gadget", ["phones-tablets"]),
    ).toBe("phones-tablets");
    expect(normalizeCategorySlug("random gadget", [])).toBe("electronics");
  });
});

describe("normalizeCondition", () => {
  it.each(["New", "Like New", "Used - Good", "Used - Fair", "Refurbished"])(
    "accepts the valid condition %s",
    (condition) => {
      expect(normalizeCondition(condition)).toBe(condition);
    },
  );

  it("defaults invalid and empty conditions to Used - Good", () => {
    expect(normalizeCondition("Brand New")).toBe("Used - Good");
    expect(normalizeCondition(undefined)).toBe("Used - Good");
    expect(normalizeCondition("  ")).toBe("Used - Good");
  });
});

describe("normalizeSpecs", () => {
  it("returns a non-empty string trimmed", () => {
    expect(normalizeSpecs("  RAM: 8GB\nStorage: 256GB  ")).toBe(
      "RAM: 8GB\nStorage: 256GB",
    );
  });

  it("returns the default when empty or not a string", () => {
    const expected = "Condition: Good\nIncluded: Box and charger";
    expect(normalizeSpecs("")).toBe(expected);
    expect(normalizeSpecs("   ")).toBe(expected);
    expect(normalizeSpecs(undefined)).toBe(expected);
    expect(normalizeSpecs(["RAM: 8GB"])).toBe(expected);
  });
});

describe("normalizePrice", () => {
  it("extracts digits from a string price", () => {
    expect(normalizePrice("UGX 1,200,000")).toBe("1200000");
    expect(normalizePrice("150k")).toBe("150");
  });

  it("accepts finite numbers and clamps negatives to zero", () => {
    expect(normalizePrice(1200000)).toBe("1200000");
    expect(normalizePrice(1500.75)).toBe("1501");
    expect(normalizePrice(-500)).toBe("0");
  });

  it("returns an empty string for unusable values", () => {
    expect(normalizePrice("")).toBe("");
    expect(normalizePrice(undefined)).toBe("");
    expect(normalizePrice(Number.NaN)).toBe("");
    expect(normalizePrice(Number.POSITIVE_INFINITY)).toBe("");
  });
});