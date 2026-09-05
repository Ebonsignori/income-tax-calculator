import { describe, it, expect } from "vitest";
import {
  standardDeductionMapToTable,
  tableDataFromTaxData,
} from "@/utils/tax-table-data";
import ohio2026 from "@/data/2026/state/ohio";
import newJersey2026 from "@/data/2026/state/new_jersey";
import oregon2026 from "@/data/2026/state/oregon";
import texas2025 from "@/data/2025/state/texas";
import { STATE_INCOME } from "@/constants/tax_types";
import { CITIES } from "@/constants";
import type { TaxData } from "@/types";

const everyRowMatchesHeaderCount = (table: {
  headers: string[];
  rows: unknown[][];
}) => table.rows.every((row) => row.length === table.headers.length);

describe("tableDataFromTaxData", () => {
  it("renders a 0% bracket rather than dropping the row", () => {
    // Ohio's first bracket is 0% up to $26,050. A truthiness check on `rate`
    // treated it as absent, blanking the row and shifting every later row one
    // column left of its header.
    const table = tableDataFromTaxData("state_income", ohio2026[STATE_INCOME]);

    expect(table.headers[0]).toBe("Rate");
    expect(table.rows[0][0]).toBe("0%");
    expect(table.rows[0][1]).toBe("$0 - $26,050");
    expect(everyRowMatchesHeaderCount(table)).toBe(true);
  });

  it("keeps columns aligned when filing statuses have different bracket counts", () => {
    // 2026 New Jersey: 7 brackets for single and married-separately, 8 for the
    // other two. The extra bracket must sit under the statuses that have it.
    const table = tableDataFromTaxData(
      "state_income",
      newJersey2026[STATE_INCOME],
    );

    expect(table.headers).toEqual([
      "Rate",
      "Single",
      "Married",
      "Married Separately",
      "Head of Household",
    ]);
    expect(everyRowMatchesHeaderCount(table)).toBe(true);

    const lastRow = table.rows[table.rows.length - 1];
    expect(lastRow[1]).toBe(""); // single has no 8th bracket
    expect(lastRow[2]).toBe("$1,000,001+"); // married does
    expect(lastRow[3]).toBe(""); // married separately does not
    expect(lastRow[4]).toBe("$1,000,001+"); // head of household does
  });

  it("shows an ALL schedule under every filing status", () => {
    const table = tableDataFromTaxData("state_income", ohio2026[STATE_INCOME]);
    expect(table.headers).toEqual([
      "Rate",
      "Single",
      "Married",
      "Married Separately",
      "Head of Household",
    ]);
    const [, single, married] = table.rows[1];
    expect(single).toBe(married);
  });

  it("gives a split payroll tax its own employee-portion column", () => {
    const table = tableDataFromTaxData(
      "oregon_paid_family_and_medical_leave",
      oregon2026["oregon_paid_family_and_medical_leave"],
    );

    expect(table.headers[0]).toBe("Employee Portion");
    expect(table.headers[1]).toBe("Rate");
    expect(table.rows[0][0]).toBe("60%");
    expect(table.rows[0][1]).toBe("1%");
    expect(everyRowMatchesHeaderCount(table)).toBe(true);
  });

  it("annualizes a flat fee and states its threshold", () => {
    const artTax = (oregon2026[CITIES] as TaxData[typeof CITIES])?.portland
      ?.art_tax;
    const table = tableDataFromTaxData("art_tax", artTax);

    expect(table.headers).toContain("Single");
    expect(String(table.rows[0][0])).toMatch(/^\$50 at \$20,000\+$/);
    expect(everyRowMatchesHeaderCount(table)).toBe(true);
  });

  it("renders a no-income-tax state as such", () => {
    expect(
      tableDataFromTaxData("state_income", texas2025[STATE_INCOME]),
    ).toEqual({ name: "state_income", headers: ["No Taxes"], rows: [] });
  });

  it("starts each bracket a dollar above the previous boundary", () => {
    const table = tableDataFromTaxData(
      "state_income",
      newJersey2026[STATE_INCOME],
    );
    expect(table.rows[0][1]).toBe("$0 - $20,000");
    expect(table.rows[1][1]).toBe("$20,001 - $35,000");
  });

  it("returns an empty table for data that holds no brackets", () => {
    expect(tableDataFromTaxData("max_401k_contribution", 24500)).toEqual({
      name: "max_401k_contribution",
      headers: [],
      rows: [],
    });
  });
});

describe("standardDeductionMapToTable", () => {
  it("lists one row per filing status", () => {
    const table = standardDeductionMapToTable("Standard Oregon Deductions", {
      single: 2910,
      married: 5820,
      married_separately: 2910,
      head_of_household: 4680,
    });

    expect(table.name).toBe("standard_oregon_deductions");
    expect(table.headers).toEqual(["Filing Status", "Amount"]);
    expect(table.rows).toHaveLength(4);
    expect(table.rows[0]).toEqual(["Single", "$2,910"]);
  });
});
