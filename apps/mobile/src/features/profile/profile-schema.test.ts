import { describe, expect, it } from "vitest";
import { profileSchema } from "./profile-schema";

describe("mobile profileSchema", () => {
  it("accepts default profile fields", () => {
    expect(
      profileSchema.parse({
        currency: "CRC",
        timeZone: "America/Costa_Rica",
      }),
    ).toEqual({ currency: "CRC", timeZone: "America/Costa_Rica" });
  });

  it("rejects lowercase currency", () => {
    expect(
      profileSchema.safeParse({
        currency: "crc",
        timeZone: "America/Costa_Rica",
      }).success,
    ).toBe(false);
  });
});
