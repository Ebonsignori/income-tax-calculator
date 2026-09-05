import { describe, it, expect } from "vitest";
import { formatPercent } from "@/utils/format-percent";

describe("formatPercent", () => {
  it("shows one decimal place", () => {
    expect(formatPercent(68.29)).toBe("68.3%");
    expect(formatPercent(6.2)).toBe("6.2%");
  });

  it("shows a true zero as 0.0%", () => {
    expect(formatPercent(0)).toBe("0.0%");
  });

  it("does not round a real tax away to nothing", () => {
    // Portland's $35 art tax against a six-figure income. "0.0%" next to a
    // real dollar amount reads as a bug.
    expect(formatPercent(0.029)).toBe("<0.1%");
    expect(formatPercent(0.0001)).toBe("<0.1%");
  });

  it("switches to a real figure once it rounds to 0.1%", () => {
    expect(formatPercent(0.05)).toBe("0.1%");
  });
});
