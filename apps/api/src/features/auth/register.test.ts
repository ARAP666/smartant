import { createHash } from "node:crypto";
import argon2 from "argon2";
import { describe, expect, it } from "vitest";
import { createRegistrationSecrets, registerSchema } from "./register.js";

describe("registerSchema", () => {
  it("normalizes a valid email", () => {
    expect(
      registerSchema.parse({
        email: "  ANA@EXAMPLE.COM ",
        password: "correct horse battery staple",
      }).email,
    ).toBe("ana@example.com");
  });

  it("rejects invalid fields", () => {
    const result = registerSchema.safeParse({
      email: "invalid",
      password: "short",
    });
    expect(result.success).toBe(false);
  });
});

describe("createRegistrationSecrets", () => {
  it("creates an Argon2id password hash and stores only the session token hash", async () => {
    const result = await createRegistrationSecrets(
      "correct horse battery staple",
    );

    expect(
      await argon2.verify(result.passwordHash, "correct horse battery staple"),
    ).toBe(true);
    expect(result.passwordHash).toContain("$argon2id$");
    expect(result.sessionToken).not.toBe(result.tokenHash);
    expect(createHash("sha256").update(result.sessionToken).digest("hex")).toBe(
      result.tokenHash,
    );
    expect(result.expiresAt.getTime()).toBeGreaterThan(Date.now());
  });
});
