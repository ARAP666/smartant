import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import {
  createSessionSecrets,
  getBearerToken,
  hashSessionToken,
} from "./session.js";

describe("session helpers", () => {
  it("creates an opaque token and its SHA-256 hash", () => {
    const session = createSessionSecrets();
    expect(session.sessionToken).not.toBe(session.tokenHash);
    expect(
      createHash("sha256").update(session.sessionToken).digest("hex"),
    ).toBe(session.tokenHash);
    expect(session.expiresAt.getTime()).toBeGreaterThan(Date.now());
  });

  it("parses only Bearer tokens", () => {
    expect(getBearerToken("Bearer opaque-token")).toBe("opaque-token");
    expect(getBearerToken("Basic nope")).toBeNull();
    expect(getBearerToken(undefined)).toBeNull();
    expect(hashSessionToken("opaque-token")).toHaveLength(64);
  });
});
