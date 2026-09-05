/**
 * Categorical palette for the tax breakdown.
 *
 * MUI x-charts' default palette is six colors, four of them blue/purple. Any
 * location with seven or more tax types wrapped around and rendered two
 * segments in the same hue -- Portland, which has seven, drew Art Tax in the
 * same teal as Federal Income.
 *
 * Twelve entries covers the worst real case (New Jersey's five state-level
 * taxes plus federal income, the two FICA taxes, and city types). Ordered so
 * that adjacent entries stay distinguishable under the common forms of color
 * blindness, and chosen to hold contrast against both the light (#fff) and
 * dark (#121212) page backgrounds.
 */
// Segments are drawn in descending size order, so the earliest entries are the
// ones most often on screen. Green sits at the end: take-home is green, and a
// green tax segment next to it reads as part of the same quantity.
//
// Every entry clears 3:1 against white, WCAG's non-text minimum. Only index 7
// cannot also clear it against the dark surface, which is what the override
// below is for.
export const CHART_COLORS = [
  "#3d7ea6", // blue
  "#df765b", // terracotta
  "#7a63a8", // violet
  "#b28f22", // ochre
  "#b5546f", // rose
  "#2f9c95", // teal
  "#a8623a", // burnt orange
  "#20486b", // navy -- darker and far less cyan than the blue above
  "#b5449b", // magenta
  "#6b8f3a", // olive
  "#d17e70", // salmon
  "#5c9e6e", // green
] as const;

/** Take-home is not a tax; it reads as the neutral remainder of the bar. */
export const TAKE_HOME_COLOR_LIGHT = "#386641";
export const TAKE_HOME_COLOR_DARK = "#81c784";

/** Retirement contributions are the user's money, not a tax. */
export const RETIREMENT_COLOR_LIGHT = "#6d788a";
export const RETIREMENT_COLOR_DARK = "#9fa8b8";

/**
 * Entries that do not hold up on the dark surface, replaced for that mode.
 *
 * Twelve mutually distinct hues cannot all clear the 3:1 non-text contrast
 * minimum against both white and #121212 -- the band of luminances that
 * satisfies both is too narrow. So the palette above is tuned for light
 * surfaces (it is also what the Open Graph images are rendered with) and only
 * the entries that actually fail on dark are overridden here.
 *
 * Index 7 read at 1.96:1 on #121212. The replacement is 3.06:1 while staying
 * in the same family, so it is still told apart from the blue at index 0.
 */
const DARK_SURFACE_OVERRIDES: Record<number, string> = {
  7: "#3a6494",
};

export function getSegmentColor(index: number, isDark = false): string {
  const slot = index % CHART_COLORS.length;
  if (isDark && DARK_SURFACE_OVERRIDES[slot]) {
    return DARK_SURFACE_OVERRIDES[slot];
  }
  return CHART_COLORS[slot];
}
