import { describe, expect, it } from "vitest";
import { profileSchema } from "./profile.js";

describe("profileSchema", () => {
  it("accepts supported currency and IANA time zone", () => {
    expect(
      profileSchema.parse({
        currency: "USD",
        timeZone: "America/New_York",
      }),
    ).toEqual({ currency: "USD", timeZone: "America/New_York" });
  });

  it("rejects invalid fields", () => {
    const result = profileSchema.safeParse({
      currency: "usd",
      timeZone: "Costa Rica",
    });

    expect(result.success).toBe(false);
  });
});
