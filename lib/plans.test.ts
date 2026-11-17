import { describe, it, expect } from "vitest";
import {
  ADMIN_IMAGE_LIMIT,
  PLAN_LIMITS,
  limitsForPerks,
  planForPerks,
} from "./plans";

describe("plan limits", () => {
  it("Free allows 3 listings and 3 images per product", () => {
    expect(PLAN_LIMITS.Free).toEqual({ listings: 3, images: 3 });
  });

  it("Standard allows 20 listings and 5 images per product", () => {
    expect(PLAN_LIMITS.Standard).toEqual({ listings: 20, images: 5 });
  });

  it("Premium allows unlimited listings and 7 images per product", () => {
    expect(PLAN_LIMITS.Premium).toEqual({ listings: null, images: 7 });
  });

  it("admins get the highest image allowance", () => {
    expect(ADMIN_IMAGE_LIMIT).toBe(7);
  });

  it("maps account flags to the right plan", () => {
    expect(planForPerks({})).toBe("Free");
    expect(planForPerks({ isVerified: true })).toBe("Standard");
    expect(planForPerks({ isVip: true })).toBe("Premium");
    // VIP wins when both flags are set.
    expect(planForPerks({ isVerified: true, isVip: true })).toBe("Premium");
  });

  it("derives listing and image limits from account flags", () => {
    expect(limitsForPerks({})).toEqual({ listings: 3, images: 3 });
    expect(limitsForPerks({ isVerified: true })).toEqual({
      listings: 20,
      images: 5,
    });
    expect(limitsForPerks({ isVip: true })).toEqual({
      listings: null,
      images: 7,
    });
  });
});
