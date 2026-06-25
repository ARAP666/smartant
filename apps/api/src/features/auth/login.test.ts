import { describe, expect, it } from "vitest";
import { loginSchema } from "./login.js";

describe("loginSchema", () => {
  it("normalizes email", () => {
    expect(
      loginSchema.parse({ email: " ANA@EXAMPLE.COM ", password: "secret" })
        .email,
    ).toBe("ana@example.com");
  });

  it("rejects malformed input", () => {
    expect(
      loginSchema.safeParse({ email: "invalid", password: "" }).success,
    ).toBe(false);
  });
});
