import { describe, expect, it } from "vitest";
import { validateReceiptPhoto } from "./receipt-photo";

describe("validateReceiptPhoto", () => {
  it("accepts supported receipt photos", () => {
    expect(
      validateReceiptPhoto({
        uri: "file://receipt.jpg",
        mimeType: "image/jpeg",
        fileSize: 1024,
      }),
    ).toBe("");
  });

  it("rejects unsupported type and oversized files", () => {
    expect(
      validateReceiptPhoto({
        uri: "file://receipt.gif",
        mimeType: "image/gif",
      }),
    ).toBe("Usa una imagen JPG o PNG");
    expect(
      validateReceiptPhoto({
        uri: "file://receipt.jpg",
        fileSize: 6 * 1024 * 1024,
      }),
    ).toBe("La imagen debe pesar 5 MB o menos");
  });
});
