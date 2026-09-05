import { describe, it, expect } from "vitest";
import {
  asCurrency,
  divideMoney,
  formatMoney,
  formatMoneyNoCents,
  multiplyMoney,
  percentage,
  toCents,
  toUnit,
} from "@/utils/money";

/**
 * These pin dinero v1's behaviour, which the published tax figures were
 * computed under. The two rounding modes below are the thing to watch: v1
 * rounded arithmetic HALF_EVEN and formatting HALF_AWAY_FROM_ZERO, and using
 * one where the other belongs moves cents.
 */
describe("money", () => {
  describe("construction", () => {
    it("takes whole dollars and stores cents", () => {
      expect(toCents(asCurrency(100))).toBe(10000);
      expect(toUnit(asCurrency(1234.56))).toBe(1234.56);
    });

    it("absorbs float error rather than rejecting the amount", () => {
      // 1000.1 * 100 is 100009.99999999999 in binary floating point.
      expect(toCents(asCurrency(1000.1))).toBe(100010);
    });
  });

  describe("arithmetic rounds half to even", () => {
    it("rounds a tie to the even neighbour", () => {
      // 5 cents * 0.5 = 2.5 -> 2, not 3.
      expect(toCents(multiplyMoney(asCurrency(0.05), 0.5))).toBe(2);
      // 7 cents * 0.5 = 3.5 -> 4.
      expect(toCents(multiplyMoney(asCurrency(0.07), 0.5))).toBe(4);
    });

    it("applies a percentage the way v1 did", () => {
      expect(toCents(percentage(asCurrency(100000), 6.2))).toBe(620000);
      expect(toCents(percentage(asCurrency(1), 1.45))).toBe(1);
    });

    it("divides with the same tie rule", () => {
      expect(toCents(divideMoney(asCurrency(0.05), 2))).toBe(2);
      expect(toCents(divideMoney(asCurrency(0.07), 2))).toBe(4);
      expect(toCents(divideMoney(asCurrency(120000), 12))).toBe(1000000);
    });

    it("does not drift on a product that is not exact in binary", () => {
      expect(toCents(multiplyMoney(asCurrency(1000.1), 3))).toBe(300030);
    });
  });

  describe("formatting rounds half away from zero", () => {
    it("formats dollars and cents", () => {
      expect(formatMoney(asCurrency(81947.06))).toBe("$81,947.06");
      expect(formatMoney(asCurrency(0))).toBe("$0.00");
    });

    it("drops cents, rounding ties away from zero rather than to even", () => {
      // Half-even would give $0, $2, $2, $4 here.
      expect(formatMoneyNoCents(asCurrency(0.5))).toBe("$1");
      expect(formatMoneyNoCents(asCurrency(1.5))).toBe("$2");
      expect(formatMoneyNoCents(asCurrency(2.5))).toBe("$3");
      expect(formatMoneyNoCents(asCurrency(3.5))).toBe("$4");
    });

    it("groups thousands", () => {
      expect(formatMoneyNoCents(asCurrency(999.5))).toBe("$1,000");
      expect(formatMoney(asCurrency(1234567.89))).toBe("$1,234,567.89");
    });

    it("handles negatives", () => {
      expect(formatMoney(asCurrency(-1.05))).toBe("-$1.05");
      expect(formatMoneyNoCents(asCurrency(-0.5))).toBe("-$1");
    });
  });
});
