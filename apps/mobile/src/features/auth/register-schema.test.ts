import { describe, expect, it } from "vitest";
import { registerSchema } from "./register-schema";

describe("mobile registerSchema", () => {
  it("normalizes valid input", () => {
    expect(
      registerSchema.parse({
        email: " ANA@EXAMPLE.COM ",
        password: "correct horse battery staple",
      }).email,
    ).toBe("ana@example.com");
  });

  it("returns field errors for invalid input", () => {
    const result = registerSchema.safeParse({
      email: "invalid",
      password: "short",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.email).toBeDefined();
      expect(result.error.flatten().fieldErrors.password).toBeDefined();
    }
  });
});
