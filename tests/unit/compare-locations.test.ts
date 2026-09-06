import { describe, it, expect } from "vitest";
import {
  buildComparison,
  citiesForState,
  locationId,
  standardStateDeduction,
} from "@/utils/compare-locations";
import { toUnit } from "@/utils/money";
import { SINGLE } from "@/constants/filing-status";
import type { FilingStatus } from "@/constants/filing-status";
import type { TaxData } from "@/types";
import federal2025 from "@/data/2025/federal";
import oregon2025 from "@/data/2025/state/oregon";
import texas2025 from "@/data/2025/state/texas";
import washington2025 from "@/data/2025/state/washington";

const stateTaxesByState: Record<string, TaxData> = {
  oregon: oregon2025 as TaxData,
  texas: texas2025 as TaxData,
  washington: washington2025 as TaxData,
};

const compare = (
  locations: { state: string; city: string }[],
  income = 150_000,
) =>
  buildComparison({
    locations,
    stateTaxesByState,
    federalTaxes: federal2025 as TaxData,
    income,
    filingStatus: SINGLE as FilingStatus,
    totalIRA: 0,
    federalDeductions: undefined,
  });

describe("locationId", () => {
  it("distinguishes a state from a city inside it", () => {
    expect(locationId({ state: "oregon", city: "" })).toBe("oregon");
    expect(locationId({ state: "oregon", city: "portland" })).toBe(
      "oregon/portland",
    );
  });
});

describe("standardStateDeduction", () => {
  it("reads the state's own figure", () => {
    expect(
      standardStateDeduction(oregon2025 as TaxData, SINGLE as FilingStatus),
    ).toBe(2835);
  });

  it("is undefined for a state that has none", () => {
    expect(
      standardStateDeduction(texas2025 as TaxData, SINGLE as FilingStatus),
    ).toBeUndefined();
  });
});

describe("citiesForState", () => {
  it("lists the cities that levy their own taxes", () => {
    expect(citiesForState(oregon2025 as TaxData)).toContain("portland");
    expect(citiesForState(texas2025 as TaxData)).toEqual([]);
  });
});

describe("buildComparison", () => {
  it("ranks by take home, best first", () => {
    const rows = compare([
      { state: "oregon", city: "portland" },
      { state: "texas", city: "" },
      { state: "washington", city: "" },
    ]);
    const takeHomes = rows.map((r) => toUnit(r.takeHome));
    expect(takeHomes).toEqual([...takeHomes].sort((a, b) => b - a));
    // No state income tax in Texas, so it cannot lose to Oregon.
    expect(rows[rows.length - 1].id).toBe("oregon/portland");
  });

  it("reports how far each location is behind the leader", () => {
    const rows = compare([
      { state: "oregon", city: "portland" },
      { state: "texas", city: "" },
    ]);
    expect(rows[0].behindLeaderBy).toBe(0);
    expect(rows[1].behindLeaderBy).toBeGreaterThan(0);
    expect(rows[1].behindLeaderBy).toBeCloseTo(
      toUnit(rows[0].takeHome) - toUnit(rows[1].takeHome),
      2,
    );
  });

  it("uses each state's own standard deduction, not one carried across", () => {
    // Oregon's $2,835 must not be applied to Texas. Texas has no state income
    // tax, so its take home is gross minus federal and FICA only -- if a
    // foreign deduction leaked in, the figure would not match a direct run.
    const [texasRow] = compare([{ state: "texas", city: "" }]);
    const oregonDeductionApplied = buildComparison({
      locations: [{ state: "texas", city: "" }],
      stateTaxesByState,
      federalTaxes: federal2025 as TaxData,
      income: 150_000,
      filingStatus: SINGLE as FilingStatus,
      totalIRA: 0,
      federalDeductions: undefined,
    });
    expect(toUnit(texasRow.takeHome)).toBe(
      toUnit(oregonDeductionApplied[0].takeHome),
    );
  });

  it("separates a city from its state", () => {
    const rows = compare([
      { state: "oregon", city: "" },
      { state: "oregon", city: "portland" },
    ]);
    const bare = rows.find((r) => r.id === "oregon");
    const portland = rows.find((r) => r.id === "oregon/portland");
    // Portland's local taxes are on top of Oregon's, so it must take home less.
    expect(toUnit(portland!.takeHome)).toBeLessThan(toUnit(bare!.takeHome));
  });

  it("skips locations whose data has not loaded yet", () => {
    const rows = compare([
      { state: "texas", city: "" },
      { state: "hawaii", city: "" },
    ]);
    expect(rows.map((r) => r.id)).toEqual(["texas"]);
  });

  it("gives an effective rate of zero at zero income rather than NaN", () => {
    const [row] = compare([{ state: "texas", city: "" }], 0);
    expect(Number.isNaN(row.effectiveRate)).toBe(false);
    expect(row.effectiveRate).toBe(0);
  });
});
