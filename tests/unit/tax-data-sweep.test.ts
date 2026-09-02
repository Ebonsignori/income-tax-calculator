/**
 * Every state-year, run through the calculator.
 *
 * calculator.test.ts asserts exact dollar figures, but only against the four
 * states whose data exercises an unusual code path (Alabama's occupational
 * tax, Colorado's OPT, Oregon's Arts Tax and transit tax, West Virginia).
 * That leaves 47 states whose brackets have never had a number checked, and
 * line coverage cannot see the gap: the untested states run the same lines as
 * the tested ones, just with different numbers in them.
 *
 * This sweep closes that. It deliberately does not assert correctness -- doing
 * that for 204 state-years would mean restating the tax code in the test, and
 * the restatement would be as likely to be wrong as the data. It asserts
 * plausibility instead, which is enough to catch what a bad data edit actually
 * produces: a bracket that throws, a NaN percentage, a negative bill, money
 * that appears or vanishes between the tax total and take-home, or a rate
 * nowhere near reality.
 *
 * Correctness of individual figures is a sourcing question, tracked per state
 * in src/data/<year>/SOURCING-STATUS.md.
 */
import { describe, it, expect } from "vitest";
import { calculate } from "@/utils/calculator";
import { readTaxDataFromDisk } from "@/utils/read-tax-data";
import type { TaxDataByYear } from "@/utils/read-tax-data";
import { FILING_STATUSES } from "@/constants/filing-status";
import type { FilingStatus } from "@/constants/filing-status";
import { CITIES } from "@/constants";
import { NONE, STATE_INCOME } from "@/constants/tax_types";
import type { TaxData } from "@/types";

// Spanning the standard deduction, the low brackets, the FICA wage base and
// the top bracket of every state that has one.
const INCOMES = [0, 15_000, 50_000, 100_000, 400_000, 1_000_000];

// No jurisdiction in the data set comes close: the worst case is roughly 45%
// (top federal bracket plus California or NYC). A sweep result above this is
// a misplaced decimal point in a rate, which is the single most likely way for
// hand-entered bracket data to go wrong.
const MAX_PLAUSIBLE_EFFECTIVE_RATE = 0.6;

// Loaded at collection time rather than in beforeAll so the year list can
// drive `describe.each`. Adding src/data/2027 then sweeps it automatically; a
// hardcoded list would leave the newest year -- the one most likely to have a
// data-entry mistake -- as the only one not covered.
const {
  taxDataByYear,
  years,
}: { taxDataByYear: TaxDataByYear; years: string[] } =
  await readTaxDataFromDisk(process.cwd() + "/src/data");

function dollars(amount: { getAmount: () => number }): number {
  return amount.getAmount() / 100;
}

function run(
  federal: TaxData,
  state: TaxData,
  income: number,
  filingStatus: FilingStatus,
  stateName: string,
  city = "",
) {
  return calculate(
    federal,
    state,
    income,
    filingStatus,
    0,
    undefined,
    undefined,
    [],
    stateName,
    city,
  );
}

describe("tax data sweep", () => {
  it("covers every year and state on disk", () => {
    expect(years.length).toBeGreaterThanOrEqual(4);
    // Compared as sets: `years` is sorted newest-first, while Object.keys
    // reorders year-like keys ascending because JS treats integer-like string
    // keys as array indices.
    expect([...years].sort()).toEqual(Object.keys(taxDataByYear).sort());
    for (const year of years) {
      // 50 states + DC, plus the federal entry.
      expect(
        Object.keys(taxDataByYear[year]).length,
        `${year} is missing state files`,
      ).toBe(52);
    }
  });

  // One test per year so a failure names the year up front, with every
  // offending state collected into the message rather than failing on the
  // first one -- a bad data import usually breaks a batch, and seeing the
  // whole batch is what tells you which import it was.
  describe.each(years)("%s", (year) => {
    it("produces a plausible bill for every state, status and income", () => {
      const problems: string[] = [];
      const federal = taxDataByYear[year].federal;

      for (const [stateName, stateData] of Object.entries(
        taxDataByYear[year],
      )) {
        if (stateName === "federal") continue;

        for (const filingStatus of FILING_STATUSES) {
          let previousTotal = -1;

          for (const income of INCOMES) {
            const where = `${stateName}/${filingStatus}/$${income}`;
            let result: ReturnType<typeof calculate>;
            try {
              result = run(
                federal,
                stateData,
                income,
                filingStatus as FilingStatus,
                stateName,
              );
            } catch (error) {
              problems.push(`${where}: threw ${(error as Error)?.message}`);
              continue;
            }

            const total = dollars(result.totalTaxes);
            const takeHome = dollars(result.takeHome.amount);

            if (!Number.isFinite(total)) {
              problems.push(`${where}: total is ${total}`);
              continue;
            }
            if (total < 0) {
              problems.push(`${where}: negative total ${total}`);
            }
            if (total > income) {
              problems.push(`${where}: tax ${total} exceeds income ${income}`);
            }
            // Nothing may appear or vanish between the two figures the UI
            // shows side by side.
            if (Math.abs(takeHome + total - income) > 0.005) {
              problems.push(
                `${where}: take-home ${takeHome} + tax ${total} != income ${income}`,
              );
            }
            if (
              income >= 50_000 &&
              total / income > MAX_PLAUSIBLE_EFFECTIVE_RATE
            ) {
              problems.push(
                `${where}: effective rate ${((100 * total) / income).toFixed(1)}%`,
              );
            }
            for (const [label, figure] of Object.entries({
              takeHome: result.takeHome,
              totalFederal: result.totalFederal,
              totalState: result.totalState,
              totalCity: result.totalCity,
              totalFica: result.totalFica,
            })) {
              if (!Number.isFinite(figure.percent)) {
                problems.push(
                  `${where}: ${label} percent is ${figure.percent}`,
                );
              }
            }
            // Raising gross income must never lower the bill. Wage-capped
            // taxes stop growing, but nothing in the data set may reverse.
            if (total < previousTotal) {
              problems.push(
                `${where}: total ${total} is less than at the income below it (${previousTotal})`,
              );
            }
            previousTotal = total;
          }
        }
      }

      expect(problems, problems.slice(0, 20).join("\n")).toEqual([]);
    });

    it("charges income tax in every state that declares brackets for it", () => {
      const problems: string[] = [];
      const federal = taxDataByYear[year].federal;

      for (const [stateName, stateData] of Object.entries(
        taxDataByYear[year],
      )) {
        if (stateName === "federal") continue;
        const schedule = stateData[STATE_INCOME];
        // A no-tax state says so with the NONE sentinel; anything else is a
        // real bracket map and must produce a real charge at $150k.
        if (!schedule || schedule === NONE || typeof schedule !== "object") {
          continue;
        }

        const { stateResults } = run(
          federal,
          stateData,
          150_000,
          "single" as FilingStatus,
          stateName,
        );
        const charged = stateResults[STATE_INCOME];
        if (!charged || dollars(charged as { getAmount: () => number }) <= 0) {
          problems.push(
            `${stateName}: declares ${STATE_INCOME} brackets but charges $0 at $150k`,
          );
        }
      }

      expect(problems, problems.join("\n")).toEqual([]);
    });

    it("computes every city tax without throwing", () => {
      const problems: string[] = [];
      const federal = taxDataByYear[year].federal;
      let cityCases = 0;

      for (const [stateName, stateData] of Object.entries(
        taxDataByYear[year],
      )) {
        if (stateName === "federal") continue;
        for (const city of Object.keys(stateData[CITIES] ?? {})) {
          for (const filingStatus of FILING_STATUSES) {
            cityCases++;
            const where = `${stateName}/${city}/${filingStatus}`;
            try {
              const result = run(
                federal,
                stateData,
                150_000,
                filingStatus as FilingStatus,
                stateName,
                city,
              );
              const cityTax = dollars(result.totalCity.amount);
              if (!Number.isFinite(cityTax) || cityTax < 0) {
                problems.push(`${where}: city tax is ${cityTax}`);
              }
            } catch (error) {
              problems.push(`${where}: threw ${(error as Error)?.message}`);
            }
          }
        }
      }

      expect(cityCases).toBeGreaterThan(0);
      expect(problems, problems.slice(0, 20).join("\n")).toEqual([]);
    });
  });
});
