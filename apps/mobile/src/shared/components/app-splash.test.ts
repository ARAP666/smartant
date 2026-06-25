import { describe, expect, it } from "vitest";
import { getSplashDuration } from "./splash-motion";

describe("getSplashDuration", () => {
  it("uses a brief duration when motion is enabled", () => {
    expect(getSplashDuration(false)).toBe(900);
  });

  it("removes the animation delay when reduced motion is enabled", () => {
    expect(getSplashDuration(true)).toBe(0);
  });
});
