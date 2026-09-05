import type { Money } from "@/utils/money";
import { CITIES, EXEMPT } from "@/constants";
import type { TaxResults, TaxResultsWithCities } from "@/types";
import { snakeToTitleCase } from "./string-utils";
import { toUnit } from "@/utils/money";

/** One tax, flattened out of the nested federal/state/city results. */
export type BreakdownSegment = {
  id: string;
  /** Display label, e.g. "Art Tax (City)". */
  label: string;
  amount: Money;
  isCity: boolean;
};

/**
 * Flatten `calculate`'s federal and state results into a single sorted list.
 *
 * Both the pie chart and the stacked bar need the same walk: skip exempt and
 * zero-value taxes, and descend into the `cities` key rather than treating it
 * as a tax of its own. TableBreakdown keeps its own walk -- it builds nested
 * rows with per-section percentage denominators, which is a different shape.
 */
export function toBreakdownSegments(
  federalResults: TaxResultsWithCities,
  stateResults: TaxResultsWithCities,
): BreakdownSegment[] {
  const segments: BreakdownSegment[] = [];

  const push = (id: string, value: unknown, isCity: boolean) => {
    if (value === EXEMPT) return;
    const amount = value as Money;
    if (!amount || toUnit(amount) <= 0) return;
    segments.push({
      id,
      label: isCity ? `${snakeToTitleCase(id)} (City)` : snakeToTitleCase(id),
      amount,
      isCity,
    });
  };

  for (const [taxType, value] of Object.entries(federalResults)) {
    push(taxType, value, false);
  }

  for (const [taxType, value] of Object.entries(stateResults)) {
    if (taxType === CITIES) {
      for (const [cityTaxType, cityValue] of Object.entries(
        value as TaxResults,
      )) {
        push(cityTaxType, cityValue, true);
      }
    } else {
      push(taxType, value, false);
    }
  }

  return segments.sort((a, b) => toUnit(b.amount) - toUnit(a.amount));
}
