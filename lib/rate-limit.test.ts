import { describe, it, expect } from "vitest";
import { rateLimit } from "./rate-limit";

describe("rateLimit", () => {
  it("allows up to limit", () => {
    const key = "test-" + Math.random();
    for (let i = 0; i < 3; i++) {
      const r = rateLimit(key, { limit: 3, windowMs: 10000 });
      expect(r.allowed).toBe(true);
    }
    const r = rateLimit(key, { limit: 3, windowMs: 10000 });
    expect(r.allowed).toBe(false);
  });
});