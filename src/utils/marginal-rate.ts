import { INFINITY } from "@/constants";
import type { RateBracket } from "@/types";

/**
 * How far ahead to look when measuring the marginal rate.
 *
 * Not $1: tax is rounded to the cent, so a one-dollar window quantises the
 * answer to whole percent -- every rate came back as 27.0%, 39.0%, 43.0%. At
 * $100 one cent of tax is 0.01% of the window, which is finer than anything
 * worth displaying, and the window is still narrow enough that it rarely
 * spans a rate change.
 */
export const MARGINAL_WINDOW = 100;

export type MarginalRate = {
  /** Percent of the next dollar taken in tax, 0-100. */
  percent: number;
  /**
   * True when tax does not rise linearly across the sampling window, so
   * `percent` is an average rather than a single rate. Two things cause it: a
   * bracket boundary inside the window, and a flat fee that switches on at a
   * threshold (Portland's $35 art tax, Eugene's rate-on-total schedule),
   * where a single dollar of income can cost far more than any rate.
   */
  spansRateChange: boolean;
};

/**
 * Measure the marginal rate by differentiating the real calculation rather
 * than re-deriving it from bracket schedules.
 *
 * `calculate` already handles employee/employer splits, rate-on-total
 * lookups, flat fees with thresholds, and the gross-versus-taxable income
 * base. Reproducing that here would be a second implementation free to drift
 * from the first, in the part of the app where being wrong matters most.
 *
 * @param taxAt total tax owed, in dollars, at a given income
 */
export function getMarginalRate(
  taxAt: (income: number) => number,
  income: number,
  window: number = MARGINAL_WINDOW,
): MarginalRate {
  const base = taxAt(income);
  const half = taxAt(income + window / 2) - base;
  const full = taxAt(income + window) - base;

  // Cent rounding can put the halfway point a cent off even on a flat rate,
  // so allow a little slack before calling it non-linear.
  const spansRateChange = Math.abs(full - 2 * half) > 0.05;

  return { percent: (full / window) * 100, spansRateChange };
}

export type LadderStep = {
  min: number;
  /** null for the open-ended top bracket. */
  max: number | null;
  rate: number;
  /** Dollars of taxable income falling in this bracket. */
  amountInBracket: number;
  /** Tax owed from this bracket alone. */
  taxFromBracket: number;
  /** The bracket the last dollar of taxable income lands in. */
  isCurrent: boolean;
};

/**
 * Slice taxable income across a bracket schedule.
 *
 * Deliberately takes *taxable* income, not gross: the brackets apply after
 * deductions, and drawing gross against them would overstate which bracket
 * someone is in -- the exact confusion this view exists to clear up.
 */
export function buildBracketLadder(
  brackets: RateBracket[],
  taxableIncome: number,
): LadderStep[] {
  const ordered = [...brackets].sort((a, b) => a.min - b.min);

  return ordered.map((bracket, index) => {
    const max = bracket.max === INFINITY ? null : (bracket.max as number);
    const amountInBracket = Math.max(
      0,
      Math.min(taxableIncome, max ?? taxableIncome) - bracket.min,
    );
    const next = ordered[index + 1];
    const isCurrent =
      taxableIncome > bracket.min &&
      (max === null || taxableIncome <= max || !next);

    return {
      min: bracket.min,
      max,
      rate: bracket.rate,
      amountInBracket,
      taxFromBracket: (amountInBracket * bracket.rate) / 100,
      isCurrent,
    };
  });
}
