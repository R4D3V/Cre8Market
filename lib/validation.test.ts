import { describe, it, expect } from "vitest";
import { productInputSchema, pushSubscribeSchema, pushNotifySchema } from "./validation";

describe("productInputSchema", () => {
  it("accepts a valid product", () => {
    const res = productInputSchema.safeParse({
      title: "Phone",
      slug: "phone",
      price: 1000,
      category: "Phones",
      categorySlug: "phones",
    });
    expect(res.success).toBe(true);
  });

  it("rejects missing title", () => {
    const res = productInputSchema.safeParse({
      slug: "phone",
      price: 1000,
      category: "Phones",
      categorySlug: "phones",
    });
    expect(res.success).toBe(false);
  });

  it("rejects negative price", () => {
    const res = productInputSchema.safeParse({
      title: "Phone",
      slug: "phone",
      price: -5,
      category: "Phones",
      categorySlug: "phones",
    });
    expect(res.success).toBe(false);
  });
});

describe("pushSubscribeSchema", () => {
  it("accepts valid subscription", () => {
    const res = pushSubscribeSchema.safeParse({
      endpoint: "https://example.com/push",
      keys: { p256dh: "abc", auth: "def" },
    });
    expect(res.success).toBe(true);
  });

  it("rejects missing keys", () => {
    const res = pushSubscribeSchema.safeParse({ endpoint: "https://example.com/push" });
    expect(res.success).toBe(false);
  });
});

describe("pushNotifySchema", () => {
  it("requires title", () => {
    const res = pushNotifySchema.safeParse({});
    expect(res.success).toBe(false);
  });
});