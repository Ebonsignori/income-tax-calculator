import { describe, it, expect } from "vitest";
import { calculate } from "@/utils/calculator";
import { collectBracketSchedules } from "@/utils/bracket-schedules";
import { tableDataFromTaxData } from "@/utils/tax-table-data";
import { toUnit } from "@/utils/money";
import { SINGLE } from "@/constants/filing-status";
import type { FilingStatus } from "@/constants/filing-status";
import { CAPITAL_GAINS, INTEREST_AND_DIVIDENDS } from "@/constants/tax_types";
import type { TaxData } from "@/types";
import fed2023 from "@/data/2023/federal";
import fed2026 from "@/data/2026/federal";
import newHampshire2023 from "@/data/2023/state/new_hampshire";
import washington2026 from "@/data/2026/state/washington";

/**
 * Washington taxes long-term capital gains and New Hampshire taxed interest
 * and dividends. Neither taxes wages, and this calculator only knows about
 * wages. Charging them made a $60,000 New Hampshire salary owe $2,304 of tax
 * in a state with no wage tax at all.
 */
const stateTaxOn = (
  income: number,
  federal: TaxData,
  state: TaxData,
  stateName: string,
) =>
  toUnit(
    calculate(
      federal,
      state,
      income,
      SINGLE as FilingStatus,
      0,
      undefined,
      undefined,
      [],
      stateName,
      "",
    ).totalState.amount,
  );

describe("taxes that are not levied on wages", () => {
  it("charges New Hampshire no wage tax at all", () => {
    for (const income of [5_000, 60_000, 456_533]) {
      expect(
        stateTaxOn(
          income,
          fed2023 as TaxData,
          newHampshire2023 as TaxData,
          "new_hampshire",
        ),
      ).toBe(0);
    }
  });

  it("charges Washington only its long-term care premium", () => {
    // 0.58% of gross, and nothing else -- not the capital gains tax, whose
    // threshold a large salary would otherwise cross.
    expect(
      stateTaxOn(
        60_000,
        fed2026 as TaxData,
        washington2026 as TaxData,
        "washington",
      ),
    ).toBeCloseTo(348, 2);
    expect(
      stateTaxOn(
        456_533,
        fed2026 as TaxData,
        washington2026 as TaxData,
        "washington",
      ),
    ).toBeCloseTo(2_647.89, 2);
  });

  it("leaves them out of the results entirely", () => {
    const results = calculate(
      fed2026 as TaxData,
      washington2026 as TaxData,
      456_533,
      SINGLE as FilingStatus,
      0,
      undefined,
      undefined,
      [],
      "washington",
      "",
    );
    expect(Object.keys(results.stateResults)).not.toContain(CAPITAL_GAINS);
  });

  it("does not offer them as bracket ladders", () => {
    const keys = collectBracketSchedules({
      federalTaxes: fed2026 as TaxData,
      stateTaxes: washington2026 as TaxData,
      USAState: "washington",
      USACity: "",
      filingStatus: SINGLE as FilingStatus,
      grossIncome: 456_533,
      federalTaxableIncome: 440_433,
      stateTaxableIncome: 456_533,
    }).map((schedule) => schedule.key);
    expect(keys).not.toContain(`state:${CAPITAL_GAINS}`);
    expect(keys).toContain("state:washington_cares_fund");
  });

  it("still documents them in the tax tables", () => {
    // They are real taxes; the reference pages should keep showing them.
    const table = tableDataFromTaxData(
      CAPITAL_GAINS,
      (washington2026 as TaxData)[CAPITAL_GAINS],
    );
    expect(table.rows.length).toBeGreaterThan(0);

    const nhTable = tableDataFromTaxData(
      INTEREST_AND_DIVIDENDS,
      (newHampshire2023 as TaxData)[INTEREST_AND_DIVIDENDS],
    );
    expect(nhTable.rows.length).toBeGreaterThan(0);
  });
});
