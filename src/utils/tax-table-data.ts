import { ALL, FILING_STATUSES } from "@/constants/filing-status";
import type { StandardDeductionMap } from "@/constants/filing-status";
import { INFINITY, TAX_FREQUENCY_PERIODS_PER_YEAR } from "@/constants";
import { NONE } from "@/constants/tax_types";
import type {
  BracketSchedule,
  FlatFeeBracket,
  RateBracket,
  TaxData,
  TaxFrequency,
} from "@/types";
import { isFlatFeeSchedule, isRateLookupSchedule } from "./calculator";
import { snakeToTitleCase, toSnakeCase } from "./string-utils";
import {
  asCurrency,
  formatMoney,
  formatMoneyNoCents,
  multiplyMoney,
} from "@/utils/money";

export type Table = {
  name: string;
  headers: string[];
  rows: (string | number)[][];
};

type BracketColumn = {
  header: string;
  brackets: BracketSchedule;
};

/**
 * One column per filing status.
 *
 * An ALL schedule applies to everyone, so it is shown under every filing status
 * rather than in a single unlabelled column.
 */
function bracketColumns(taxData: TaxData[string]): BracketColumn[] {
  if (!taxData || typeof taxData !== "object") {
    return [];
  }
  const byStatus = taxData as Record<string, BracketSchedule | undefined>;

  const all = byStatus[ALL];
  if (Array.isArray(all)) {
    return FILING_STATUSES.map((status) => ({
      header: snakeToTitleCase(status),
      brackets: all,
    }));
  }

  return FILING_STATUSES.filter((status) =>
    Array.isArray(byStatus[status]),
  ).map((status) => ({
    header: snakeToTitleCase(status),
    brackets: byStatus[status] as BracketSchedule,
  }));
}

export function tableDataFromTaxData(
  name: string,
  taxData: TaxData[string],
): Table {
  if (taxData === NONE) {
    return {
      name,
      headers: ["No Taxes"],
      rows: [],
    };
  }

  const columns = bracketColumns(taxData);
  if (columns.length === 0) {
    return { name, headers: [], rows: [] };
  }

  // Filing statuses do not always have the same number of brackets -- 2026 New
  // Jersey runs 7 for single and married-separately against 8 for the other
  // two -- so the table is as tall as the longest column and short columns get
  // a blank cell. Indexing off the first column instead put the extra bracket's
  // values under the wrong headers.
  const rowCount = Math.max(...columns.map((column) => column.brackets.length));
  const rowIndexes = Array.from({ length: rowCount }, (_, index) => index);

  // A schedule is uniformly fees or uniformly rates, so the first column decides.
  if (isFlatFeeSchedule(columns[0].brackets)) {
    return {
      name,
      headers: columns.map((column) => column.header),
      rows: rowIndexes.map((index) =>
        columns.map((column) => {
          const bracket = column.brackets[index] as FlatFeeBracket | undefined;
          return bracket ? formatFlatFee(bracket) : "";
        }),
      ),
    };
  }

  // Rates are shared across filing statuses; only the income ranges differ. So
  // the rate (and the employee share, where the tax is split with the employer)
  // leads the row, and each status column carries that status's range.
  const rateColumns = columns as { header: string; brackets: RateBracket[] }[];
  const rateAt = (index: number) =>
    rateColumns.find((column) => column.brackets[index])?.brackets[index];

  const headers: string[] = [];
  const isSplitTax = rateAt(0)?.percent_of_total !== undefined;
  if (isSplitTax) {
    headers.push("Employee Portion");
  }
  // A rate-lookup schedule's ranges pick the rate rather than bound what it is
  // charged on, so the plain "Rate" header would read as marginal. See
  // isRateLookupSchedule.
  headers.push(
    isRateLookupSchedule(columns[0].brackets) ? "Rate (on all wages)" : "Rate",
    ...rateColumns.map((column) => column.header),
  );

  const rows = rowIndexes.map((index) => {
    const reference = rateAt(index);
    const row: (string | number)[] = [];
    if (isSplitTax) {
      row.push(
        reference?.percent_of_total === undefined
          ? ""
          : `${reference.percent_of_total}%`,
      );
    }
    // `rate` is compared against undefined rather than checked for truthiness:
    // a 0% first bracket is real (Ohio, Oklahoma, North Dakota and 100-odd
    // others) and a falsiness check dropped the entire row.
    row.push(reference?.rate === undefined ? "" : `${reference.rate}%`);
    for (const column of rateColumns) {
      const bracket = column.brackets[index];
      row.push(bracket ? formatBracketRange(bracket, index) : "");
    }
    return row;
  });

  return { name, headers, rows };
}

/**
 * The income range a bracket covers.
 *
 * Every bracket after the first starts a dollar above the previous one's max,
 * which is where the +1 comes from: consecutive brackets share a boundary in
 * the data ({ max: 20000 } then { min: 20000 }) but must not appear to overlap.
 */
function formatBracketRange(bracket: RateBracket, index: number): string {
  const min = formatMoneyNoCents(
    asCurrency(bracket.min + (index === 0 ? 0 : 1)),
  );
  if (bracket.max === INFINITY) {
    return `${min}+`;
  }
  return `${min} - ${formatMoneyNoCents(asCurrency(bracket.max as number))}`;
}

/**
 * Render a fixed-dollar tax the way the calculator actually charges it.
 *
 * Data declares these per period ($3 weekly, $5.75 monthly), so showing the raw
 * amount made the table disagree with the calculator by a factor of 52 or 12.
 * The qualifying threshold is included for the same reason — it decides whether
 * the fee applies at all.
 */
function formatFlatFee(bracket: FlatFeeBracket): string {
  const amount = asCurrency(bracket.amount);

  let label: string;
  if (bracket.frequency) {
    const periodsPerYear =
      TAX_FREQUENCY_PERIODS_PER_YEAR[bracket.frequency as TaxFrequency];
    label = `${formatMoneyNoCents(
      multiplyMoney(amount, periodsPerYear),
    )}/yr (${formatMoney(amount)} ${snakeToTitleCase(
      bracket.frequency,
    ).toLowerCase()})`;
  } else {
    label = formatMoneyNoCents(amount);
  }

  if (bracket.min) {
    label += ` at ${formatMoneyNoCents(asCurrency(bracket.min))}+`;
  }

  return label;
}

export function standardDeductionMapToTable(
  name: string,
  standardDeductionMap: StandardDeductionMap,
): Table {
  const rows = [] as (string | number)[][];
  const headers = ["Filing Status", "Amount"];
  for (const [filingStatus, amount] of Object.entries(standardDeductionMap)) {
    rows.push([
      snakeToTitleCase(filingStatus),
      formatMoneyNoCents(asCurrency(amount)),
    ]);
  }

  return {
    name: toSnakeCase(name),
    headers,
    rows,
  };
}
