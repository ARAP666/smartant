import { describe, expect, it } from "vitest";
import { resolveApiUrl } from "./api-url";

describe("resolveApiUrl", () => {
  it("requires an HTTPS URL outside development", () => {
    expect(resolveApiUrl(undefined, true)).toBe("http://localhost:3000");
    expect(resolveApiUrl("https://api.example.com/", false)).toBe(
      "https://api.example.com",
    );
    expect(() => resolveApiUrl(undefined, false)).toThrow(/required/);
    expect(() => resolveApiUrl("http://api.example.com", false)).toThrow(
      /HTTPS/,
    );
  });
});
