import { CITIES } from "@/constants";
import type {
  FilingStatus,
  StandardDeductionMap,
} from "@/constants/filing-status";
import { STANDARD_DEDUCTION } from "@/constants/tax_types";
import type { TaxData } from "@/types";
import { calculate } from "./calculator";
import type { Money } from "./money";
import { toUnit } from "./money";

/** A place to compare: a state, optionally narrowed to one of its cities. */
export type ComparedLocation = {
  state: string;
  /** "" when comparing the state without a city's local taxes. */
  city: string;
};

export type ComparisonRow = {
  location: ComparedLocation;
  /** Stable key for React and for the URL. */
  id: string;
  label: string;
  takeHome: Money;
  totalTaxes: Money;
  /** Of gross income, 0-100. */
  effectiveRate: number;
  /** Dollars behind the best location in the set; 0 for the winner. */
  behindLeaderBy: number;
  federalResults: ReturnType<typeof calculate>["federalResults"];
  stateResults: ReturnType<typeof calculate>["stateResults"];
};

export function locationId({ state, city }: ComparedLocation): string {
  return city ? `${state}/${city}` : state;
}

/**
 * The state's own standard deduction for this filing status.
 *
 * Carrying one number across locations is the trap here: applying Oregon's
 * $2,835 to Texas would quietly flatter whichever state the comparison
 * started from. Each location resolves its own.
 */
export function standardStateDeduction(
  stateTaxes: TaxData,
  filingStatus: FilingStatus,
): number | undefined {
  const map = stateTaxes?.[STANDARD_DEDUCTION] as
    | StandardDeductionMap
    | undefined;
  return map?.[filingStatus];
}

/** Cities that levy their own taxes in this state, for the location picker. */
export function citiesForState(stateTaxes: TaxData): string[] {
  return Object.keys(stateTaxes?.[CITIES] ?? {});
}

type BuildArgs = {
  locations: ComparedLocation[];
  /** Keyed by state name. */
  stateTaxesByState: Record<string, TaxData>;
  federalTaxes: TaxData;
  income: number;
  filingStatus: FilingStatus;
  totalIRA: number;
  /** Federal deductions are the same wherever you live. */
  federalDeductions: number | undefined;
};

/**
 * Run the same calculation once per location and rank by take-home.
 *
 * State deductions are deliberately not a parameter: see
 * standardStateDeduction above.
 */
export function buildComparison({
  locations,
  stateTaxesByState,
  federalTaxes,
  income,
  filingStatus,
  totalIRA,
  federalDeductions,
}: BuildArgs): ComparisonRow[] {
  const rows = locations.flatMap((location) => {
    const stateTaxes = stateTaxesByState[location.state];
    if (!stateTaxes) return [];

    const result = calculate(
      federalTaxes,
      stateTaxes,
      income,
      filingStatus,
      totalIRA,
      federalDeductions,
      standardStateDeduction(stateTaxes, filingStatus),
      [],
      location.state,
      location.city,
    );

    return [
      {
        location,
        id: locationId(location),
        label: "",
        takeHome: result.takeHome.amount,
        totalTaxes: result.totalTaxes,
        effectiveRate:
          income > 0 ? (toUnit(result.totalTaxes) / income) * 100 : 0,
        behindLeaderBy: 0,
        federalResults: result.federalResults,
        stateResults: result.stateResults,
      },
    ];
  });

  rows.sort((a, b) => toUnit(b.takeHome) - toUnit(a.takeHome));

  const leader = rows.length ? toUnit(rows[0].takeHome) : 0;
  return rows.map((row) => ({
    ...row,
    behindLeaderBy: leader - toUnit(row.takeHome),
  }));
}
