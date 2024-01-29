import Dinero from "dinero.js";
import { ALL, FilingStatus } from "@/constants/filing_status";
import { TaxData, TaxResults, TaxResultsWithCities } from "@/types";
import {
  MAX_401K_CONTRIBUTION,
  STANDARD_DEDUCTION,
} from "@/constants/tax_types";
import { CITIES, EXEMPT, INFINITY } from "@/constants";

const nonTaxKeys = [MAX_401K_CONTRIBUTION, STANDARD_DEDUCTION];

export function calculate(
  federalTaxData: TaxData,
  stateTaxData: TaxData,
  income: number,
  filingStatus: FilingStatus,
  totalIRA: number,
  totalFederalDeductions: number | undefined,
  totalStateDeductions: number | undefined,
  exemptTaxes: { title: string; value: string }[],
  selectedState: string
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
    selectedState
  );

  const { taxesPerBracket: stateResults, taxableIncome: stateTaxableIncome } =
    calculateTaxesPerBracket(
      stateTaxData,
      totalIncome,
      filingStatus,
      totalIRA,
      totalStateDeductions,
      exemptions,
      selectedState
    );

  const totals = sumTotals(totalIncome, federalResults, stateResults);

  return { ...totals, federalTaxableIncome, stateTaxableIncome };
}

export function calculateTaxesPerBracket(
  taxData: TaxData,
  totalIncome: Dinero.Dinero,
  filingStatus: FilingStatus,
  totalIRA: number,
  totalDeductions: number | undefined,
  exemptions: string[],
  selectedState: string
): { taxesPerBracket: TaxResultsWithCities; taxableIncome: Dinero.Dinero } {
  const taxableIncome = totalIncome
    .subtract(asCurrency(totalIRA))
    .subtract(asCurrency(totalDeductions || 0));

  const taxesPerBracket = {} as TaxResultsWithCities;
  Object.entries(taxData).forEach(([taxType, taxTypeData]) => {
    if (nonTaxKeys.includes(taxType)) {
      return;
    }
    if (exemptions.includes(taxType)) {
      taxesPerBracket[taxType] = EXEMPT;
    } else if (taxTypeData?.[ALL]) {
      if (taxTypeData[ALL]?.[0]?.amount) {
        taxesPerBracket[taxType] = asCurrency(taxTypeData[ALL][0].amount);
      } else {
        taxesPerBracket[taxType] = calculateTaxBracket(
          taxableIncome,
          taxTypeData[ALL]
        );
      }
    } else if (taxType === CITIES) {
      if (selectedState) {
        taxesPerBracket.cities = calculateTaxesPerBracket(
          taxTypeData[selectedState],
          totalIncome,
          filingStatus,
          totalIRA,
          totalDeductions,
          exemptions,
          selectedState
        ).taxesPerBracket as TaxResults;
      }
    } else {
      taxesPerBracket[taxType] = calculateTaxBracket(
        taxableIncome,
        taxTypeData[filingStatus]
      );
    }
  });

  return { taxesPerBracket, taxableIncome };
}

function calculateTaxBracket(
  income: Dinero.Dinero,
  brackets: any
): Dinero.Dinero {
  let totalTax = asCurrency(0);
  let incomeTaxed = asCurrency(0);

  for (let i = 0; i < brackets.length; i++) {
    const bracket = brackets[i];
    let minBracket = asCurrency(bracket.min);

    console.log("bracket", bracket);

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
    totalTax = totalTax.add(bracketRange.percentage(bracket.rate));
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
  stateResults: TaxResultsWithCities
) {
  let totalFederal = sumBracketsByTaxType(
    federalResults,
    Object.keys(federalResults)
  );
  const totalFica = sumBracketsByTaxType(federalResults, [
    "social_security",
    "medicare",
  ]);
  let totalState = sumBracketsByTaxType(
    stateResults,
    Object.keys(stateResults)
  );
  let totalCity = asCurrency(0);
  if (stateResults[CITIES]) {
    totalCity = sumBracketsByTaxType(
      stateResults[CITIES] as TaxResults,
      Object.keys(stateResults[CITIES])
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

  const takeHome = totalIncome.subtract(totalFederal).subtract(totalState);

  return {
    takeHome: {
      percent: getPercent(takeHome, totalIncome),
      amount: takeHome,
    },
    totalTaxes,
    totalFederal: {
      percent: getPercent(totalFederal, totalIncome),
      amount: totalFederal,
    },
    totalState: {
      percent: getPercent(totalState, totalIncome),
      amount: totalState,
    },
    totalCity: {
      percent: getPercent(totalCity, totalIncome),
      amount: totalCity,
    },
    totalFica: {
      percent: getPercent(totalFica, totalIncome),
      amount: totalFica,
    },
    federalResults,
    stateResults,
  };
}

// Sum all values in results under specified keys
export function sumBracketsByTaxType(
  results: TaxResultsWithCities,
  taxTypes: string[]
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
  total: Dinero.Dinero
): number {
  return Math.round((amount.getAmount() / total.getAmount()) * 10000) / 100;
}
