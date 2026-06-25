import { describe, expect, it } from "vitest";
import { SESSION_TOKEN_KEY } from "./session-key";

describe("SESSION_TOKEN_KEY", () => {
  it("uses a stable namespaced key", () => {
    expect(SESSION_TOKEN_KEY).toBe("smart-ant.session-token");
  });
});
