import type { TaxFrequency } from "@/types";
import { WEEKLY, BIWEEKLY, SEMI_MONTHLY, MONTHLY } from "./paycheck-frequency";

export const INFINITY = "Infinity";

export const CITIES = "cities";

export const EXEMPT = "exempt";

export const ANNUALLY = "annually";
export const TAX_FREQUENCY_AMOUNTS: Record<TaxFrequency, number> = {
  [WEEKLY]: 52,
  [BIWEEKLY]: 26,
  [SEMI_MONTHLY]: 24,
  [MONTHLY]: 12,
  [ANNUALLY]: 1,
};
