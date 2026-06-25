import { describe, expect, it } from "vitest";
import { loginSchema } from "./login-schema";

describe("mobile loginSchema", () => {
  it("normalizes valid input", () => {
    expect(
      loginSchema.parse({ email: " ANA@EXAMPLE.COM ", password: "secret" })
        .email,
    ).toBe("ana@example.com");
  });

  it("rejects empty credentials", () => {
    expect(loginSchema.safeParse({ email: "", password: "" }).success).toBe(
      false,
    );
  });
});
