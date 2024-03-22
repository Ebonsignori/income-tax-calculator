import Dinero from "dinero.js";
import type { FilingStatus } from "@/constants/filing-status";
import { ALL } from "@/constants/filing-status";
import type { TaxData, TaxResults, TaxResultsWithCities } from "@/types";
import {
  MAX_401K_CONTRIBUTION,
  NONE,
  STANDARD_DEDUCTION,
} from "@/constants/tax_types";
import { CITIES, EXEMPT, INFINITY } from "@/constants";
import type { TaxOption } from "./get-tax-options";
import type { PaycheckFrequency } from "@/constants/paycheck-frequency";
import { FREQUENCY_TO_PAYCHECKS_PER_YEAR } from "@/constants/paycheck-frequency";

const nonTaxKeys = [MAX_401K_CONTRIBUTION, STANDARD_DEDUCTION];

export function calculate(
  federalTaxData: TaxData,
  stateTaxData: TaxData,
  income: number,
  filingStatus: FilingStatus,
  totalIRA: number,
  totalFederalDeductions: number | undefined,
  totalStateDeductions: number | undefined,
  exemptTaxes: TaxOption[],
  selectedState: string,
  selectedCity: string,
) {
  const totalIncome = asCurrency(income);
  const exemptions = exemptTaxes.map((tax) => tax.value);

  const {
    taxesPerBracket: federalResults,
    taxableIncome: federalTaxableIncome,
  } = calculateTaxesPerBracket(
    federalTaxData,
    totalIncome,
    filingStatus,
    totalIRA,
    totalFederalDeductions,
    exemptions,
  );

  const { taxesPerBracket: stateResults, taxableIncome: stateTaxableIncome } =
    calculateTaxesPerBracket(
      stateTaxData,
      totalIncome,
      filingStatus,
      totalIRA,
      totalStateDeductions,
      exemptions,
      selectedState,
      selectedCity,
    );

  const totals = sumTotals(totalIncome, federalResults, stateResults, totalIRA);

  return { ...totals, federalTaxableIncome, stateTaxableIncome };
}

export function calculateTaxesPerBracket(
  taxData: TaxData,
  totalIncome: Dinero.Dinero,
  filingStatus: FilingStatus,
  totalIRA: number,
  totalDeductions: number | undefined,
  exemptions: string[],
  selectedState?: string,
  selectedCity?: string,
): { taxesPerBracket: TaxResultsWithCities; taxableIncome: Dinero.Dinero } {
  const taxableIncome = totalIncome
    .subtract(asCurrency(totalIRA))
    .subtract(asCurrency(totalDeductions || 0));

  if (!taxData) {
    return { taxesPerBracket: {}, taxableIncome };
  }

  const taxesPerBracket = {} as TaxResultsWithCities;
  Object.entries(taxData).forEach(([taxType, taxTypeData]) => {
    if (nonTaxKeys.includes(taxType)) {
      return;
    }
    if (exemptions.includes(taxType)) {
      taxesPerBracket[taxType] = EXEMPT;
    } else if (taxTypeData?.[ALL]) {
      if (taxTypeData[ALL]?.[0]?.amount) {
        let amount = asCurrency(taxTypeData[ALL][0].amount);
        if (taxTypeData[ALL]?.[0]?.frequency) {
          amount = amount.multiply(
            FREQUENCY_TO_PAYCHECKS_PER_YEAR[
              taxTypeData[ALL][0].frequency as PaycheckFrequency
            ],
          );
        }
        if (taxableIncome.toUnit() > (taxTypeData[ALL][0].min || 0)) {
          taxesPerBracket[taxType] = amount;
        }
      } else {
        taxesPerBracket[taxType] = calculateTaxBracket(
          taxableIncome,
          taxTypeData[ALL],
        );
      }
    } else if (taxTypeData === NONE) {
      taxesPerBracket[taxType] = asCurrency(0);
    } else if (taxType === CITIES) {
      if (selectedState && selectedCity) {
        taxesPerBracket.cities = calculateTaxesPerBracket(
          taxTypeData[selectedCity],
          totalIncome,
          filingStatus,
          totalIRA,
          totalDeductions,
          exemptions,
          selectedState,
          selectedCity,
        ).taxesPerBracket as TaxResults;
      }
    } else {
      taxesPerBracket[taxType] = calculateTaxBracket(
        taxableIncome,
        taxTypeData[filingStatus],
      );
    }
  });

  return { taxesPerBracket, taxableIncome };
}

function calculateTaxBracket(
  income: Dinero.Dinero,
  brackets: any,
): Dinero.Dinero {
  let totalTax = asCurrency(0);
  let incomeTaxed = asCurrency(0);

  for (let i = 0; i < brackets.length; i++) {
    const bracket = brackets[i];
    let minBracket = asCurrency(bracket.min);

    let maxBracket = bracket.max;
    if (bracket.max === INFINITY) {
      maxBracket = income.toUnit();
    }
    maxBracket = asCurrency(maxBracket);

    const max = asCurrency(Dinero.minimum([income, maxBracket]).toUnit());
    let bracketRange = max.subtract(minBracket);
    if (bracketRange.lessThanOrEqual(asCurrency(0))) {
      break;
    }

    let totalBracketAmount = bracketRange.percentage(bracket.rate);
    if (bracket.percent_of_total) {
      totalBracketAmount = totalBracketAmount.percentage(
        bracket.percent_of_total,
      );
    }
    totalTax = totalTax.add(totalBracketAmount);
    incomeTaxed = incomeTaxed.add(bracketRange);

    if (incomeTaxed.greaterThanOrEqual(income)) {
      break;
    }
  }

  return totalTax;
}

export function sumTotals(
  totalIncome: Dinero.Dinero,
  federalResults: TaxResultsWithCities,
  stateResults: TaxResultsWithCities,
  totalIRA: number,
) {
  let totalFederal = sumBracketsByTaxType(
    federalResults,
    Object.keys(federalResults),
  );
  const totalFica = sumBracketsByTaxType(federalResults, [
    "social_security",
    "medicare",
  ]);
  let totalState = sumBracketsByTaxType(
    stateResults,
    Object.keys(stateResults),
  );
  let totalCity = asCurrency(0);
  if (stateResults[CITIES]) {
    totalCity = sumBracketsByTaxType(
      stateResults[CITIES] as TaxResults,
      Object.keys(stateResults[CITIES]),
    );
  }

  if (totalCity.lessThanOrEqual(asCurrency(0))) {
    totalCity = asCurrency(0);
  }
  if (totalState.lessThanOrEqual(asCurrency(0))) {
    totalState = asCurrency(0);
  }
  if (totalFederal.lessThanOrEqual(asCurrency(0))) {
    totalFederal = asCurrency(0);
  }

  totalState = totalState.add(totalCity);

  let totalTaxes = totalFederal.add(totalState);

  const taxableIncome = totalIncome.subtract(asCurrency(totalIRA));

  const takeHome = taxableIncome.subtract(totalFederal).subtract(totalState);

  return {
    takeHome: {
      percent: getPercent(takeHome, taxableIncome),
      amount: takeHome,
    },
    totalTaxes,
    totalFederal: {
      percent: getPercent(totalFederal, taxableIncome),
      amount: totalFederal,
    },
    totalState: {
      percent: getPercent(totalState, taxableIncome),
      amount: totalState,
    },
    totalCity: {
      percent: getPercent(totalCity, taxableIncome),
      amount: totalCity,
    },
    totalFica: {
      percent: getPercent(totalFica, taxableIncome),
      amount: totalFica,
    },
    federalResults,
    stateResults,
  };
}

// Sum all values in results under specified keys
export function sumBracketsByTaxType(
  results: TaxResultsWithCities,
  taxTypes: string[],
): Dinero.Dinero {
  let total = Dinero({ amount: 0 });
  for (const taxType of taxTypes) {
    if (results[taxType] === EXEMPT || taxType === CITIES) {
      continue;
    }
    if (results[taxType]) {
      total = total.add(results[taxType] as Dinero.Dinero);
    }
  }
  return total;
}

// Amount always passed as full dollar amount without cents
// So we need to multiply by 100 to get cents
export function asCurrency(amount: number) {
  return Dinero({ amount: amount * 100, currency: "USD" });
}

// Determine the percentage of two Dinero objects
export function getPercent(
  amount: Dinero.Dinero,
  total: Dinero.Dinero,
): number {
  return Math.round((amount.getAmount() / total.getAmount()) * 10000) / 100;
}

export const formatNoZeros = "$0,0";

export function getPaycheckByFrequency(
  totalIncome: Dinero.Dinero,
  paycheckFrequency: PaycheckFrequency,
) {
  const paycheck = totalIncome.divide(
    FREQUENCY_TO_PAYCHECKS_PER_YEAR[paycheckFrequency],
  );
  return paycheck;
}
