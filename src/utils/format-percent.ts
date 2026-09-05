/**
 * Format a 0-100 share for display.
 *
 * A tax that rounds to 0.0% is not the same as one that is not charged --
 * Portland's $35 Art Tax is real money, and printing "0.0%" next to it reads
 * as an error. Anything non-zero that rounds away is shown as "<0.1%".
 */
export function formatPercent(share: number): string {
  if (share > 0 && share < 0.05) {
    return "<0.1%";
  }
  return `${share.toFixed(1)}%`;
}
