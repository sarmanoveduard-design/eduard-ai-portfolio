import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { DevelopmentRateLimiter } from "./rate-limit";

describe("development rate limiter", () => {
  afterEach(() => vi.restoreAllMocks());

  it("enforces 3 requests per visitor in 10 minutes", async () => {
    const limiter = new DevelopmentRateLimiter();
    await expect(limiter.consume("visitor-a")).resolves.toMatchObject({ allowed: true });
    await expect(limiter.consume("visitor-a")).resolves.toMatchObject({ allowed: true });
    await expect(limiter.consume("visitor-a")).resolves.toMatchObject({ allowed: true });
    await expect(limiter.consume("visitor-a")).resolves.toMatchObject({ allowed: false });
  });

  it("enforces 8 requests per visitor in a fixed 24 hour window", async () => {
    let now = 1_800_000_000_000;
    vi.spyOn(Date, "now").mockImplementation(() => now);
    const limiter = new DevelopmentRateLimiter();

    for (let index = 0; index < 8; index += 1) {
      if (index > 0 && index % 3 === 0) now += 10 * 60 * 1000 + 1;
      await expect(limiter.consume("visitor-daily")).resolves.toMatchObject({ allowed: true });
    }
    now += 10 * 60 * 1000 + 1;
    await expect(limiter.consume("visitor-daily")).resolves.toMatchObject({ allowed: false });
  });

  it("fails closed after the configured global full-audit budget", async () => {
    const limiter = new DevelopmentRateLimiter();
    for (let index = 0; index < 20; index += 1) {
      await expect(limiter.consumeGlobal("full_audit")).resolves.toMatchObject({ allowed: true });
    }
    await expect(limiter.consumeGlobal("full_audit")).resolves.toMatchObject({ allowed: false });
  });

  it("fails closed after the configured global purpose-gate budget", async () => {
    const limiter = new DevelopmentRateLimiter();
    for (let index = 0; index < 50; index += 1) {
      await expect(limiter.consumeGlobal("purpose_gate")).resolves.toMatchObject({ allowed: true });
    }
    await expect(limiter.consumeGlobal("purpose_gate")).resolves.toMatchObject({ allowed: false });
  });
});
