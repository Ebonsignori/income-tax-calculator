/**
 * The money layer.
 *
 * dinero.js v2 is a deliberately small core: it has no `divide`, no
 * `percentage`, no `toUnit` and no formatter. Those four are exactly the
 * operations this calculator's correctness rests on, so they are implemented
 * here rather than spread through the call sites.
 *
 * Every function reproduces dinero v1's behaviour bit for bit, because the
 * tax figures this app publishes were computed under v1 and must not move:
 *
 *   - arithmetic rounds HALF_EVEN (banker's), v1's `globalRoundingMode`
 *   - formatting rounds HALF_AWAY_FROM_ZERO, v1's `globalFormatRoundingMode`
 *
 * Those two differ, which is easy to get wrong in either direction. The
 * equivalence is checked in tests/unit/money.test.ts.
 */
import type { Dinero } from "dinero.js";
import {
  USD,
  add,
  dinero,
  equal,
  greaterThanOrEqual,
  lessThanOrEqual,
  minimum,
  subtract,
  toSnapshot,
} from "dinero.js";

export type Money = Dinero<number>;

/** Digits after the decimal point, as v1 counted them. */
function countFractionDigits(value: number): number {
  const fraction = String(value).split(".")[1];
  return fraction ? fraction.length : 0;
}

/**
 * v1 scaled both operands to integers before multiplying, so that products
 * like 1000.1 * 100 do not drift off a whole cent through float error.
 */
function floatMultiply(a: number, b: number): number {
  const factor = Math.max(
    10 ** countFractionDigits(a),
    10 ** countFractionDigits(b),
  );
  return (Math.round(a * factor) * Math.round(b * factor)) / (factor * factor);
}

const isHalf = (value: number) => Math.abs(value) % 1 === 0.5;

/** Ties go to the even neighbour. Used for all arithmetic. */
function halfEven(value: number): number {
  const rounded = Math.round(value);
  if (!isHalf(value)) return rounded;
  return rounded % 2 === 0 ? rounded : rounded - 1;
}

/** Ties go away from zero. Used only when formatting. */
function halfAwayFromZero(value: number): number {
  return value < 0 ? -Math.round(-value) : Math.round(value);
}

function fromCents(cents: number): Money {
  return dinero({ amount: cents, currency: USD });
}

/** Integer cents. */
export function toCents(money: Money): number {
  return toSnapshot(money).amount;
}

/** Dollars as a plain number. v2 has no `toUnit`. */
export function toUnit(money: Money): number {
  return toCents(money) / 100;
}

/**
 * Amounts are always passed as whole dollars, so scale to cents. Rounded
 * because `amount * 100` can land off a whole cent through either sub-cent
 * source data or float error, and dinero rejects a non-integer amount.
 */
export function asCurrency(amount: number): Money {
  return fromCents(Math.round(amount * 100));
}

export function multiplyMoney(money: Money, factor: number): Money {
  return fromCents(halfEven(floatMultiply(toCents(money), factor)));
}

/** v1's `percentage(p)`, which was `multiply(p / 100)`. */
export function percentage(money: Money, percent: number): Money {
  return multiplyMoney(money, percent / 100);
}

/** v2 has no `divide`. */
export function divideMoney(money: Money, divisor: number): Money {
  return fromCents(halfEven(toCents(money) / divisor));
}

function toRoundedUnit(money: Money, digits: number): number {
  const factor = 10 ** digits;
  return halfAwayFromZero(floatMultiply(toUnit(money), factor)) / factor;
}

function format(money: Money, digits: number): string {
  return toRoundedUnit(money, digits).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    currencyDisplay: "symbol",
    useGrouping: true,
    minimumFractionDigits: digits,
  });
}

/** "$81,947.06" -- v1's default format. */
export function formatMoney(money: Money): string {
  return format(money, 2);
}

/** "$81,947" -- v1's "$0,0" format, for figures where cents are noise. */
export function formatMoneyNoCents(money: Money): string {
  return format(money, 0);
}

export const ZERO = fromCents(0);

// Re-exported so call sites have one import for the money layer.
export { add, subtract, equal, lessThanOrEqual, greaterThanOrEqual, minimum };
