import type { TaxFrequency } from "@/types";
import { WEEKLY, BIWEEKLY, SEMI_MONTHLY, MONTHLY } from "./paycheck-frequency";

export const INFINITY = "Infinity";

// Single source of truth lives in ./cities, alongside the city name
// constants the tax-data files use. Re-exported here so app code can keep
// importing it from "@/constants".
export { CITIES } from "./cities";

export const EXEMPT = "exempt";

export const ANNUALLY = "annually";

// How many times a year a tax-data `frequency` recurs. Distinct from
// FREQUENCY_TO_PAYCHECKS_PER_YEAR, which drives the paycheck-frequency picker:
// this one also covers `annually`, which tax data may declare but nobody
// selects as a pay schedule.
export const TAX_FREQUENCY_PERIODS_PER_YEAR: Record<TaxFrequency, number> = {
  [WEEKLY]: 52,
  [BIWEEKLY]: 26,
  [SEMI_MONTHLY]: 24,
  [MONTHLY]: 12,
  [ANNUALLY]: 1,
};

// Which income figure a flat-fee threshold is measured against.
export const GROSS_INCOME_BASIS = "gross";
export const TAXABLE_INCOME_BASIS = "taxable";
export const INCOME_BASES = [GROSS_INCOME_BASIS, TAXABLE_INCOME_BASIS];
