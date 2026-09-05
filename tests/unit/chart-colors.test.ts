import { describe, it, expect } from "vitest";
import { CHART_COLORS, getSegmentColor } from "@/constants/chart-colors";

/** WCAG relative luminance. */
function luminance(hex: string): number {
  const channels = [1, 3, 5].map(
    (i) => parseInt(hex.slice(i, i + 2), 16) / 255,
  );
  const linear = channels.map((c) =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4),
  );
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

const LIGHT_SURFACE = "#ffffff";
const DARK_SURFACE = "#121212";

describe("chart colors", () => {
  it("has no duplicates", () => {
    expect(new Set(CHART_COLORS).size).toBe(CHART_COLORS.length);
  });

  it("covers the worst real case without repeating a color", () => {
    // Portland reaches ten tax types; the old six-color palette wrapped and
    // drew two segments identically.
    const used = Array.from({ length: 10 }, (_, i) => getSegmentColor(i));
    expect(new Set(used).size).toBe(10);
  });

  it("stays legible on the dark surface in dark mode", () => {
    for (let i = 0; i < CHART_COLORS.length; i++) {
      const color = getSegmentColor(i, true);
      expect(
        contrast(color, DARK_SURFACE),
        `${color} at slot ${i} on the dark surface`,
      ).toBeGreaterThanOrEqual(3);
    }
  });

  it("keeps the light palette for light mode, which the OG images use", () => {
    for (let i = 0; i < CHART_COLORS.length; i++) {
      expect(getSegmentColor(i, false)).toBe(CHART_COLORS[i]);
    }
  });

  it("wraps rather than returning undefined past the end", () => {
    expect(getSegmentColor(CHART_COLORS.length)).toBe(CHART_COLORS[0]);
    expect(getSegmentColor(CHART_COLORS.length + 3)).toBe(CHART_COLORS[3]);
  });

  it("keeps most of the palette usable on the light surface", () => {
    // Not all twelve can clear 3:1 on both surfaces at once, so this guards
    // the light surface loosely -- every segment is labelled with its name and
    // amount, so color is reinforcement rather than the only channel.
    for (const color of CHART_COLORS) {
      expect(
        contrast(color, LIGHT_SURFACE),
        `${color} on the light surface`,
      ).toBeGreaterThanOrEqual(2.3);
    }
  });
});
