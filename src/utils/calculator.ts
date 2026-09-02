import Dinero from "dinero.js";
import type {
  FilingStatus,
  StandardDeductionMap,
} from "@/constants/filing-status";
import { ALL } from "@/constants/filing-status";
import type {
  BracketSchedule,
  FlatFeeBracket,
  RateBracket,
  TaxData,
  TaxResults,
  TaxResultsWithCities,
} from "@/types";
import {
  MAX_401K_CONTRIBUTION,
  NONE,
  STANDARD_DEDUCTION,
  SOCIAL_SECURITY,
  MEDICARE,
  CALIFORNIA_SDI,
  WASHINGTON_CARES_FUND,
  OREGON_PAID_FAMILY_AND_MEDICAL_LEAVE,
  DC_PAID_FAMILY_LEAVE,
  NJ_DISABILITY_INSURANCE,
  NJ_FAMILY_LEAVE_INSURANCE,
  NJ_UNEMPLOYMENT_INSURANCE,
  NJ_WORKFORCE_DEVELOPMENT,
  NY_PAID_FAMILY_LEAVE,
  NY_DISABILITY_INSURANCE,
  RI_TEMPORARY_DISABILITY_INSURANCE,
  HI_TEMPORARY_DISABILITY_INSURANCE,
  COLORADO_FAMLI,
  CT_PAID_FAMILY_AND_MEDICAL_LEAVE,
  OCCUPATIONAL_TAX,
  OREGON_TRANSIT_TAX,
  EMPLOYEE_PAYROLL_TAX,
} from "@/constants/tax_types";
import {
  CITIES,
  EXEMPT,
  GROSS_INCOME_BASIS,
  INFINITY,
  TAXABLE_INCOME_BASIS,
  TAX_FREQUENCY_PERIODS_PER_YEAR,
} from "@/constants";
import type { TaxOption } from "./get-tax-options";
import type { PaycheckFrequency } from "@/constants/paycheck-frequency";
import { FREQUENCY_TO_PAYCHECKS_PER_YEAR } from "@/constants/paycheck-frequency";
import type { TaxFrequency } from "@/types";

const nonTaxKeys = [MAX_401K_CONTRIBUTION, STANDARD_DEDUCTION];

// Taxes levied on wages rather than on income after deductions.
//
// Two groups, same treatment. FICA and the state paid-leave/disability programs
// are statutorily computed on gross income — standard and itemized deductions
// do not reduce them. Local occupational and payroll taxes land here for the
// same practical reason: they are withheld from gross wages, so a state
// standard deduction must not shrink their base either.
//
// Everything not listed here is computed on income after deductions. That is
// correct for genuine income taxes, including the city and county income taxes
// that start from state taxable income (Maryland, Indiana, NYC).
const grossIncomeTaxes = [
  SOCIAL_SECURITY,
  MEDICARE,
  CALIFORNIA_SDI,
  WASHINGTON_CARES_FUND,
  OREGON_PAID_FAMILY_AND_MEDICAL_LEAVE,
  DC_PAID_FAMILY_LEAVE,
  NJ_DISABILITY_INSURANCE,
  NJ_FAMILY_LEAVE_INSURANCE,
  NJ_UNEMPLOYMENT_INSURANCE,
  NJ_WORKFORCE_DEVELOPMENT,
  NY_PAID_FAMILY_LEAVE,
  NY_DISABILITY_INSURANCE,
  RI_TEMPORARY_DISABILITY_INSURANCE,
  HI_TEMPORARY_DISABILITY_INSURANCE,
  COLORADO_FAMLI,
  CT_PAID_FAMILY_AND_MEDICAL_LEAVE,
  // Alabama and Kentucky municipal occupational taxes: withheld from gross
  // salaries and wages.
  OCCUPATIONAL_TAX,
  // Oregon statewide transit tax: computed on gross wages before any
  // exemptions or deductions.
  OREGON_TRANSIT_TAX,
  // Eugene's community safety payroll tax: applied to wages, not to income
  // after the Oregon standard deduction.
  EMPLOYEE_PAYROLL_TAX,
];

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
  if (!taxData) {
    const taxableIncome = totalIncome.subtract(asCurrency(totalIRA));
    return { taxesPerBracket: {}, taxableIncome };
  }

  // If no custom deductions provided, use standard deduction from tax data
  let deductions = totalDeductions;
  if (deductions === undefined) {
    const standardDeductions = taxData[STANDARD_DEDUCTION] as
      | StandardDeductionMap
      | undefined;
    if (standardDeductions?.[filingStatus] !== undefined) {
      deductions = standardDeductions[filingStatus];
    }
  }

  // Gross income after IRA (used for FICA and payroll taxes)
  const grossIncome = totalIncome.subtract(asCurrency(totalIRA));

  // Taxable income after deductions (used for income taxes)
  const taxableIncome = grossIncome.subtract(asCurrency(deductions || 0));

  const taxesPerBracket = {} as TaxResultsWithCities;
  Object.entries(taxData).forEach(([taxType, taxTypeData]) => {
    if (nonTaxKeys.includes(taxType)) {
      return;
    }
    if (exemptions.includes(taxType)) {
      taxesPerBracket[taxType] = EXEMPT;
      return;
    }
    if (taxTypeData === NONE) {
      taxesPerBracket[taxType] = asCurrency(0);
      return;
    }
    if (taxType === CITIES) {
      const citiesData = taxTypeData as TaxData[typeof CITIES];
      const cityTaxes =
        selectedState && selectedCity ? citiesData?.[selectedCity] : undefined;
      if (cityTaxes) {
        taxesPerBracket.cities = calculateTaxesPerBracket(
          cityTaxes,
          totalIncome,
          filingStatus,
          totalIRA,
          deductions,
          exemptions,
          selectedState,
          selectedCity,
        ).taxesPerBracket as TaxResults;
      }
      return;
    }

    const brackets = scheduleForFilingStatus(taxTypeData, filingStatus);
    if (!brackets?.length) {
      return;
    }

    if (isFlatFeeSchedule(brackets)) {
      taxesPerBracket[taxType] = calculateFlatFee(
        brackets,
        grossIncome,
        taxableIncome,
      );
      return;
    }

    // FICA and payroll taxes use gross income, income taxes use taxable income.
    // A schedule may override that where the tax type alone does not settle it
    // -- `city_income` covers both Yonkers, which starts from state taxable
    // income, and the Missouri earnings taxes, which are levied on wages.
    const declaredBasis = brackets[0].basis;
    let incomeBase: Dinero.Dinero;
    if (declaredBasis === TAXABLE_INCOME_BASIS) {
      incomeBase = taxableIncome;
    } else if (declaredBasis === GROSS_INCOME_BASIS) {
      incomeBase = grossIncome;
    } else {
      incomeBase = grossIncomeTaxes.includes(taxType)
        ? grossIncome
        : taxableIncome;
    }

    taxesPerBracket[taxType] = isRateLookupSchedule(brackets)
      ? calculateRateLookup(incomeBase, brackets)
      : calculateTaxBracket(incomeBase, brackets);
  });

  return { taxesPerBracket, taxableIncome };
}

/**
 * The bracket list a tax applies to this taxpayer.
 *
 * Brackets are keyed either by ALL (the tax applies the same way to every
 * filing status) or by the individual filing status. Values that are not
 * bracket maps at all -- a bare number, the NONE sentinel -- yield undefined.
 */
function scheduleForFilingStatus(
  taxTypeData: TaxData[string],
  filingStatus: FilingStatus,
): BracketSchedule | undefined {
  if (!taxTypeData || typeof taxTypeData !== "object") {
    return undefined;
  }
  // BracketsByFilingStatus is a union of two mapped types and so carries no
  // index signature to read through. The keys are checked by
  // scripts/validate-tax-data.ts.
  const byStatus = taxTypeData as Record<string, BracketSchedule | undefined>;
  const schedule = byStatus[ALL] ?? byStatus[filingStatus];
  return Array.isArray(schedule) ? schedule : undefined;
}

export function isFlatFeeSchedule(
  brackets: BracketSchedule,
): brackets is FlatFeeBracket[] {
  return (
    typeof (brackets[0] as FlatFeeBracket | undefined)?.amount !== "undefined"
  );
}

/**
 * Fixed-dollar taxes: a flat fee owed once the taxpayer clears an income
 * threshold. Portland's Arts Tax and the Colorado / West Virginia occupational
 * privilege taxes work this way.
 *
 * Thresholds are inclusive ("$1,000 or more of annual income", "$500 per month
 * or more"), and are written against gross wages rather than income after
 * deductions — so `basis` defaults to gross. Portland's 2026 Arts Tax is the
 * exception: it tests Oregon taxable income, and declares `basis: "taxable"`.
 *
 * Where a schedule has several tiers the highest one the taxpayer qualifies for
 * applies; the fees are not cumulative.
 */
function calculateFlatFee(
  brackets: FlatFeeBracket[],
  grossIncome: Dinero.Dinero,
  taxableIncome: Dinero.Dinero,
): Dinero.Dinero {
  let owed = asCurrency(0);

  for (const bracket of brackets) {
    const incomeBase =
      bracket.basis === TAXABLE_INCOME_BASIS ? taxableIncome : grossIncome;
    if (incomeBase.toUnit() < (bracket.min || 0)) {
      continue;
    }
    let amount = asCurrency(bracket.amount);
    if (bracket.frequency) {
      amount = amount.multiply(
        TAX_FREQUENCY_PERIODS_PER_YEAR[bracket.frequency as TaxFrequency],
      );
    }
    owed = amount;
  }

  return owed;
}

/**
 * A rate-lookup schedule charges one rate on the whole income base; `min` and
 * `max` say which rate applies rather than which slice of income is taxed.
 *
 * Eugene's community safety payroll tax is the only one so far. Its published
 * chart is explicit: "The purpose of the tax rate chart is to obtain the rate to
 * be applied to *all* subject wages paid in a pay period." Charging it
 * marginally understated the tax at every income above the exempt threshold.
 */
export function isRateLookupSchedule(
  brackets: BracketSchedule,
): brackets is RateBracket[] {
  return (brackets[0] as RateBracket | undefined)?.rate_on_total === true;
}

function calculateRateLookup(
  income: Dinero.Dinero,
  brackets: RateBracket[],
): Dinero.Dinero {
  const amount = income.toUnit();
  // Bands are half-open, matching the contiguous `max === next min` convention
  // the rest of the data uses and the charts' own "at least X but less than Y".
  const bracket = brackets.find(
    (candidate) =>
      amount >= candidate.min &&
      (candidate.max === INFINITY || amount < (candidate.max as number)),
  );
  if (!bracket) {
    return asCurrency(0);
  }
  return income.percentage(bracket.rate);
}

function calculateTaxBracket(
  income: Dinero.Dinero,
  brackets: RateBracket[],
): Dinero.Dinero {
  let totalTax = asCurrency(0);
  let incomeTaxed = asCurrency(0);

  for (let i = 0; i < brackets.length; i++) {
    const bracket = brackets[i];
    let minBracket = asCurrency(bracket.min);

    const maxBracket = asCurrency(
      bracket.max === INFINITY ? income.toUnit() : (bracket.max as number),
    );

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
    SOCIAL_SECURITY,
    MEDICARE,
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
  // Dinero rejects non-integer amounts, and `amount * 100` can land off a whole
  // cent through either sub-cent data or float error (1000.1 * 100).
  return Dinero({ amount: Math.round(amount * 100), currency: "USD" });
}

// Determine the percentage of two Dinero objects
export function getPercent(
  amount: Dinero.Dinero,
  total: Dinero.Dinero,
): number {
  const totalAmount = total.getAmount();
  // Guard the divide. Reachable from the UI: contributing the 401k maximum
  // against an income equal to it leaves a zero base, which otherwise renders
  // as "NaN%" in every row of the breakdown table.
  if (totalAmount === 0) {
    return 0;
  }
  return Math.round((amount.getAmount() / totalAmount) * 10000) / 100;
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
