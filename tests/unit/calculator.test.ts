import { describe, it, expect } from "vitest";
import type { Money } from "@/utils/money";
import { calculate, getPercent } from "@/utils/calculator";
import federal2025 from "@/data/2025/federal";
import oregon2025 from "@/data/2025/state/oregon";
import federal2026 from "@/data/2026/federal";
import oregon2026 from "@/data/2026/state/oregon";
import oregon2023 from "@/data/2023/state/oregon";
import missouri2026 from "@/data/2026/state/missouri";
import newYork2026 from "@/data/2026/state/new_york";
import colorado2025 from "@/data/2025/state/colorado";
import alabama2025 from "@/data/2025/state/alabama";
import westVirginia2025 from "@/data/2025/state/west_virginia";
import {
  SINGLE,
  MARRIED,
  HEAD_OF_HOUSEHOLD,
  ALL,
} from "@/constants/filing-status";
import type { FilingStatus } from "@/constants/filing-status";
import {
  FEDERAL_INCOME,
  SOCIAL_SECURITY,
  MEDICARE,
  STATE_INCOME,
  STANDARD_DEDUCTION,
  OREGON_TRANSIT_TAX,
  OREGON_PAID_FAMILY_AND_MEDICAL_LEAVE,
} from "@/constants/tax_types";
import { INFINITY } from "@/constants";
import {
  add,
  asCurrency,
  equal,
  lessThanOrEqual,
  percentage,
  subtract,
  toCents,
  toUnit,
} from "@/utils/money";

/**
 * Manually calculate tax for a progressive bracket system using Money
 * This is our independent verification logic
 */
function calculateProgressiveTax(taxableIncome: Money, brackets: any[]): Money {
  let totalTax = asCurrency(0);

  for (const bracket of brackets) {
    const min = asCurrency(bracket.min);
    const max =
      bracket.max === INFINITY
        ? taxableIncome
        : asCurrency(Math.min(bracket.max, toUnit(taxableIncome)));

    if (lessThanOrEqual(taxableIncome, min)) {
      break;
    }

    const bracketRange = subtract(max, min);
    if (lessThanOrEqual(bracketRange, asCurrency(0))) {
      continue;
    }

    let bracketTax = percentage(bracketRange, bracket.rate);

    // Handle percent_of_total for things like employer/employee split
    if (bracket.percent_of_total) {
      bracketTax = percentage(bracketTax, bracket.percent_of_total);
    }

    totalTax = add(totalTax, bracketTax);
  }

  return totalTax;
}

/**
 * Calculate expected taxes independently
 */
function calculateExpectedTaxes(
  income: number,
  filingStatus: FilingStatus,
  ira: number,
  federalDeductions?: number,
  stateDeductions?: number,
) {
  const grossIncome = asCurrency(income);
  const incomeAfterIRA = subtract(grossIncome, asCurrency(ira));

  // Get standard deductions
  const federalStandardDeduction =
    (federal2025[STANDARD_DEDUCTION] as any)?.[filingStatus] || 0;
  const stateStandardDeduction =
    (oregon2025[STANDARD_DEDUCTION] as any)?.[filingStatus] || 0;

  // Use custom or standard deductions
  const fedDeductions = federalDeductions ?? federalStandardDeduction;
  const stateDeduct = stateDeductions ?? stateStandardDeduction;

  // Calculate taxable income
  const federalTaxableIncome = subtract(
    incomeAfterIRA,
    asCurrency(fedDeductions),
  );
  const stateTaxableIncome = subtract(incomeAfterIRA, asCurrency(stateDeduct));

  // Federal Income Tax
  const federalIncomeBrackets = (federal2025[FEDERAL_INCOME] as any)?.[
    filingStatus
  ] as any[];
  const federalIncomeTax = calculateProgressiveTax(
    federalTaxableIncome,
    federalIncomeBrackets,
  );

  // Social Security (on gross income after IRA, not taxable income)
  const socialSecurityBrackets = (federal2025[SOCIAL_SECURITY] as any)?.[
    ALL
  ] as any[];
  const socialSecurityTax = calculateProgressiveTax(
    incomeAfterIRA,
    socialSecurityBrackets,
  );

  // Medicare (on gross income after IRA, not taxable income)
  const medicareBrackets = (federal2025[MEDICARE] as any)?.[
    filingStatus
  ] as any[];
  const medicareTax = calculateProgressiveTax(incomeAfterIRA, medicareBrackets);

  // State Income Tax
  const stateIncomeBrackets = (oregon2025[STATE_INCOME] as any)?.[
    filingStatus
  ] as any[];
  const stateIncomeTax = calculateProgressiveTax(
    stateTaxableIncome,
    stateIncomeBrackets,
  );

  // Oregon Transit Tax (on gross wages, not income after deductions — Oregon
  // DOR computes it "before any exemptions or deductions")
  const transitBrackets = (oregon2025[OREGON_TRANSIT_TAX] as any)?.[
    ALL
  ] as any[];
  const transitTax = calculateProgressiveTax(incomeAfterIRA, transitBrackets);

  // Oregon Paid Family and Medical Leave (on gross income after IRA)
  const paidLeaveBrackets = (
    oregon2025[OREGON_PAID_FAMILY_AND_MEDICAL_LEAVE] as any
  )?.[ALL] as any[];
  const paidLeaveTax = calculateProgressiveTax(
    incomeAfterIRA,
    paidLeaveBrackets,
  );

  const totalFederal = add(
    add(federalIncomeTax, socialSecurityTax),
    medicareTax,
  );
  const totalState = add(add(stateIncomeTax, transitTax), paidLeaveTax);
  const totalTaxes = add(totalFederal, totalState);
  const takeHome = subtract(incomeAfterIRA, totalTaxes);

  return {
    federalTaxableIncome,
    stateTaxableIncome,
    federalIncomeTax,
    socialSecurityTax,
    medicareTax,
    totalFederal,
    stateIncomeTax,
    transitTax,
    paidLeaveTax,
    totalState,
    totalTaxes,
    takeHome,
  };
}

describe("Calculator Audit Tests", () => {
  describe("Standard Deduction Application", () => {
    it("should apply federal standard deduction when no custom deduction provided - Single filer", () => {
      const income = 100000;
      const filingStatus = SINGLE;
      const ira = 0;

      const results = calculate(
        federal2025,
        oregon2025,
        income,
        filingStatus,
        ira,
        undefined, // No custom federal deduction
        undefined, // No custom state deduction
        [],
        "oregon",
        "",
      );

      const expected = calculateExpectedTaxes(income, filingStatus, ira);

      // Verify taxable income includes standard deduction
      expect(
        equal(results.federalTaxableIncome, expected.federalTaxableIncome),
      ).toBe(true);
      expect(
        equal(results.stateTaxableIncome, expected.stateTaxableIncome),
      ).toBe(true);

      // Standard deduction for single filer in 2025
      const expectedFederalTaxableIncome = asCurrency(100000 - 15000);
      expect(
        equal(results.federalTaxableIncome, expectedFederalTaxableIncome),
      ).toBe(true);
    });

    it("should apply standard deduction - Married filer", () => {
      const income = 200000;
      const filingStatus = MARRIED;
      const ira = 0;

      const results = calculate(
        federal2025,
        oregon2025,
        income,
        filingStatus,
        ira,
        undefined,
        undefined,
        [],
        "oregon",
        "",
      );

      const expected = calculateExpectedTaxes(income, filingStatus, ira);

      // Standard deduction for married filer in 2025
      const expectedFederalTaxableIncome = asCurrency(200000 - 30000);
      expect(
        equal(results.federalTaxableIncome, expectedFederalTaxableIncome),
      ).toBe(true);
      expect(
        equal(results.federalTaxableIncome, expected.federalTaxableIncome),
      ).toBe(true);
    });

    it("should apply standard deduction - Head of Household", () => {
      const income = 80000;
      const filingStatus = HEAD_OF_HOUSEHOLD;
      const ira = 0;

      const results = calculate(
        federal2025,
        oregon2025,
        income,
        filingStatus,
        ira,
        undefined,
        undefined,
        [],
        "oregon",
        "",
      );

      const expected = calculateExpectedTaxes(income, filingStatus, ira);

      // Standard deduction for head of household in 2025
      const expectedFederalTaxableIncome = asCurrency(80000 - 22500);
      expect(
        equal(results.federalTaxableIncome, expectedFederalTaxableIncome),
      ).toBe(true);
      expect(
        equal(results.federalTaxableIncome, expected.federalTaxableIncome),
      ).toBe(true);
    });

    it("should use custom deductions when provided", () => {
      const income = 50000;
      const filingStatus = SINGLE;
      const ira = 5000;
      const customFederalDeduction = 2000;
      const customStateDeduction = 1000;

      const results = calculate(
        federal2025,
        oregon2025,
        income,
        filingStatus,
        ira,
        customFederalDeduction,
        customStateDeduction,
        [],
        "oregon",
        "",
      );

      const expected = calculateExpectedTaxes(
        income,
        filingStatus,
        ira,
        customFederalDeduction,
        customStateDeduction,
      );

      // Should use custom deductions, not standard
      const expectedFederalTaxableIncome = asCurrency(50000 - 5000 - 2000);
      const expectedStateTaxableIncome = asCurrency(50000 - 5000 - 1000);

      expect(
        equal(results.federalTaxableIncome, expectedFederalTaxableIncome),
      ).toBe(true);
      expect(
        equal(results.stateTaxableIncome, expectedStateTaxableIncome),
      ).toBe(true);
      expect(
        equal(results.federalTaxableIncome, expected.federalTaxableIncome),
      ).toBe(true);
      expect(
        equal(results.stateTaxableIncome, expected.stateTaxableIncome),
      ).toBe(true);
    });
  });

  describe("FICA Tax Base Verification", () => {
    it("should calculate FICA taxes on gross income (after IRA), not taxable income", () => {
      const income = 50000;
      const filingStatus = SINGLE;
      const ira = 5000;
      const customFederalDeduction = 2000;

      const results = calculate(
        federal2025,
        oregon2025,
        income,
        filingStatus,
        ira,
        customFederalDeduction,
        undefined,
        [],
        "oregon",
        "",
      );

      const expected = calculateExpectedTaxes(
        income,
        filingStatus,
        ira,
        customFederalDeduction,
      );

      // FICA taxes should be on $45,000 (50k - 5k IRA), NOT on $43,000 (after deductions)
      const grossIncomeAfterIRA = asCurrency(45000);

      // Social Security: 6.2% of $45,000
      const expectedSocialSecurity = percentage(grossIncomeAfterIRA, 6.2);
      expect(
        equal(
          results.federalResults.social_security as any,
          expectedSocialSecurity,
        ),
      ).toBe(true);

      // Medicare: 1.45% of $45,000 (below threshold)
      const expectedMedicare = percentage(grossIncomeAfterIRA, 1.45);
      expect(
        equal(results.federalResults.medicare as any, expectedMedicare),
      ).toBe(true);

      // Verify against independent calculation
      expect(
        equal(
          results.federalResults.social_security as any,
          expected.socialSecurityTax,
        ),
      ).toBe(true);
      expect(
        equal(results.federalResults.medicare as any, expected.medicareTax),
      ).toBe(true);
    });

    it("should calculate state payroll taxes on gross income, not taxable income", () => {
      const income = 50000;
      const filingStatus = SINGLE;
      const ira = 5000;
      const customStateDeduction = 1000;

      const results = calculate(
        federal2025,
        oregon2025,
        income,
        filingStatus,
        ira,
        undefined,
        customStateDeduction,
        [],
        "oregon",
        "",
      );

      const expected = calculateExpectedTaxes(
        income,
        filingStatus,
        ira,
        undefined,
        customStateDeduction,
      );

      // Oregon Paid Leave should be on gross income after IRA, not taxable income
      expect(
        equal(
          results.stateResults.oregon_paid_family_and_medical_leave as any,
          expected.paidLeaveTax,
        ),
      ).toBe(true);
    });
  });

  describe("Complete Tax Calculation Verification", () => {
    it("should correctly calculate all taxes - Single filer, $100k, no IRA", () => {
      const income = 100000;
      const filingStatus = SINGLE;
      const ira = 0;

      const results = calculate(
        federal2025,
        oregon2025,
        income,
        filingStatus,
        ira,
        undefined,
        undefined,
        [],
        "oregon",
        "",
      );

      const expected = calculateExpectedTaxes(income, filingStatus, ira);

      // Verify all tax components match
      expect(
        equal(
          results.federalResults.federal_income as any,
          expected.federalIncomeTax,
        ),
      ).toBe(true);
      expect(
        equal(
          results.federalResults.social_security as any,
          expected.socialSecurityTax,
        ),
      ).toBe(true);
      expect(
        equal(results.federalResults.medicare as any, expected.medicareTax),
      ).toBe(true);
      expect(equal(results.totalFederal.amount, expected.totalFederal)).toBe(
        true,
      );

      expect(
        equal(
          results.stateResults.state_income as any,
          expected.stateIncomeTax,
        ),
      ).toBe(true);
      expect(
        equal(
          results.stateResults.oregon_transit_tax as any,
          expected.transitTax,
        ),
      ).toBe(true);
      expect(
        equal(
          results.stateResults.oregon_paid_family_and_medical_leave as any,
          expected.paidLeaveTax,
        ),
      ).toBe(true);
      expect(equal(results.totalState.amount, expected.totalState)).toBe(true);

      expect(equal(results.totalTaxes, expected.totalTaxes)).toBe(true);
      expect(equal(results.takeHome.amount, expected.takeHome)).toBe(true);
    });

    it("should correctly calculate all taxes - Single filer, $100k, $10k IRA", () => {
      const income = 100000;
      const filingStatus = SINGLE;
      const ira = 10000;

      const results = calculate(
        federal2025,
        oregon2025,
        income,
        filingStatus,
        ira,
        undefined,
        undefined,
        [],
        "oregon",
        "",
      );

      const expected = calculateExpectedTaxes(income, filingStatus, ira);

      expect(
        equal(
          results.federalResults.federal_income as any,
          expected.federalIncomeTax,
        ),
      ).toBe(true);
      expect(
        equal(
          results.federalResults.social_security as any,
          expected.socialSecurityTax,
        ),
      ).toBe(true);
      expect(
        equal(results.federalResults.medicare as any, expected.medicareTax),
      ).toBe(true);
      expect(equal(results.totalFederal.amount, expected.totalFederal)).toBe(
        true,
      );
      expect(equal(results.totalState.amount, expected.totalState)).toBe(true);
      expect(equal(results.totalTaxes, expected.totalTaxes)).toBe(true);
      expect(equal(results.takeHome.amount, expected.takeHome)).toBe(true);
    });

    it("should correctly calculate all taxes - Married filer, $200k", () => {
      const income = 200000;
      const filingStatus = MARRIED;
      const ira = 0;

      const results = calculate(
        federal2025,
        oregon2025,
        income,
        filingStatus,
        ira,
        undefined,
        undefined,
        [],
        "oregon",
        "",
      );

      const expected = calculateExpectedTaxes(income, filingStatus, ira);

      expect(
        equal(
          results.federalResults.federal_income as any,
          expected.federalIncomeTax,
        ),
      ).toBe(true);
      expect(
        equal(
          results.federalResults.social_security as any,
          expected.socialSecurityTax,
        ),
      ).toBe(true);
      expect(
        equal(results.federalResults.medicare as any, expected.medicareTax),
      ).toBe(true);
      expect(equal(results.totalFederal.amount, expected.totalFederal)).toBe(
        true,
      );
      expect(equal(results.totalState.amount, expected.totalState)).toBe(true);
      expect(equal(results.totalTaxes, expected.totalTaxes)).toBe(true);
      expect(equal(results.takeHome.amount, expected.takeHome)).toBe(true);
    });

    it("should correctly calculate all taxes - Head of Household, $80k", () => {
      const income = 80000;
      const filingStatus = HEAD_OF_HOUSEHOLD;
      const ira = 0;

      const results = calculate(
        federal2025,
        oregon2025,
        income,
        filingStatus,
        ira,
        undefined,
        undefined,
        [],
        "oregon",
        "",
      );

      const expected = calculateExpectedTaxes(income, filingStatus, ira);

      expect(
        equal(
          results.federalResults.federal_income as any,
          expected.federalIncomeTax,
        ),
      ).toBe(true);
      expect(
        equal(
          results.federalResults.social_security as any,
          expected.socialSecurityTax,
        ),
      ).toBe(true);
      expect(
        equal(results.federalResults.medicare as any, expected.medicareTax),
      ).toBe(true);
      expect(equal(results.totalFederal.amount, expected.totalFederal)).toBe(
        true,
      );
      expect(equal(results.totalState.amount, expected.totalState)).toBe(true);
      expect(equal(results.totalTaxes, expected.totalTaxes)).toBe(true);
      expect(equal(results.takeHome.amount, expected.takeHome)).toBe(true);
    });

    it("should correctly calculate all taxes - High earner, $250k (tests additional Medicare tax)", () => {
      const income = 250000;
      const filingStatus = SINGLE;
      const ira = 0;

      const results = calculate(
        federal2025,
        oregon2025,
        income,
        filingStatus,
        ira,
        undefined,
        undefined,
        [],
        "oregon",
        "",
      );

      const expected = calculateExpectedTaxes(income, filingStatus, ira);

      // This should trigger the additional 0.9% Medicare tax above $200k
      expect(
        equal(results.federalResults.medicare as any, expected.medicareTax),
      ).toBe(true);
      expect(equal(results.totalFederal.amount, expected.totalFederal)).toBe(
        true,
      );
      expect(equal(results.totalState.amount, expected.totalState)).toBe(true);
      expect(equal(results.totalTaxes, expected.totalTaxes)).toBe(true);
      expect(equal(results.takeHome.amount, expected.takeHome)).toBe(true);
    });

    it("should correctly calculate with custom deductions", () => {
      const income = 50000;
      const filingStatus = SINGLE;
      const ira = 5000;
      const federalDeductions = 2000;
      const stateDeductions = 1000;

      const results = calculate(
        federal2025,
        oregon2025,
        income,
        filingStatus,
        ira,
        federalDeductions,
        stateDeductions,
        [],
        "oregon",
        "",
      );

      const expected = calculateExpectedTaxes(
        income,
        filingStatus,
        ira,
        federalDeductions,
        stateDeductions,
      );

      expect(
        equal(
          results.federalResults.federal_income as any,
          expected.federalIncomeTax,
        ),
      ).toBe(true);
      expect(
        equal(
          results.federalResults.social_security as any,
          expected.socialSecurityTax,
        ),
      ).toBe(true);
      expect(
        equal(results.federalResults.medicare as any, expected.medicareTax),
      ).toBe(true);
      expect(equal(results.totalFederal.amount, expected.totalFederal)).toBe(
        true,
      );
      expect(equal(results.totalState.amount, expected.totalState)).toBe(true);
      expect(equal(results.totalTaxes, expected.totalTaxes)).toBe(true);
      expect(equal(results.takeHome.amount, expected.takeHome)).toBe(true);
    });
  });

  describe("Edge Cases", () => {
    it("should handle zero income", () => {
      const income = 0;
      const filingStatus = SINGLE;
      const ira = 0;

      const results = calculate(
        federal2025,
        oregon2025,
        income,
        filingStatus,
        ira,
        undefined,
        undefined,
        [],
        "oregon",
        "",
      );

      const expected = calculateExpectedTaxes(income, filingStatus, ira);

      expect(equal(results.totalTaxes, expected.totalTaxes)).toBe(true);
      expect(equal(results.takeHome.amount, expected.takeHome)).toBe(true);
    });

    it("should handle Social Security wage base limit correctly", () => {
      // Income above Social Security wage base ($176,100 in 2025)
      const income = 200000;
      const filingStatus = SINGLE;
      const ira = 0;

      const results = calculate(
        federal2025,
        oregon2025,
        income,
        filingStatus,
        ira,
        undefined,
        undefined,
        [],
        "oregon",
        "",
      );

      const expected = calculateExpectedTaxes(income, filingStatus, ira);

      // Social Security should cap at $176,100 * 6.2%
      const maxSocialSecurity = percentage(asCurrency(176100), 6.2);
      expect(
        equal(results.federalResults.social_security as any, maxSocialSecurity),
      ).toBe(true);
      expect(
        equal(
          results.federalResults.social_security as any,
          expected.socialSecurityTax,
        ),
      ).toBe(true);
    });

    it("should handle IRA contributions reducing taxable income but not FICA base", () => {
      const income = 100000;
      const filingStatus = SINGLE;
      const ira = 23500; // Max 401k contribution for 2025

      const results = calculate(
        federal2025,
        oregon2025,
        income,
        filingStatus,
        ira,
        undefined,
        undefined,
        [],
        "oregon",
        "",
      );

      const expected = calculateExpectedTaxes(income, filingStatus, ira);

      // Federal income tax should be on reduced amount
      const expectedFederalTaxableIncome = asCurrency(100000 - 23500 - 15000);
      expect(
        equal(results.federalTaxableIncome, expectedFederalTaxableIncome),
      ).toBe(true);

      // But FICA should be on income after IRA only (not after standard deduction)
      const incomeAfterIRA = asCurrency(100000 - 23500);
      const expectedSocialSecurity = percentage(incomeAfterIRA, 6.2);
      const expectedMedicare = percentage(incomeAfterIRA, 1.45);

      expect(
        equal(
          results.federalResults.social_security as any,
          expectedSocialSecurity,
        ),
      ).toBe(true);
      expect(
        equal(results.federalResults.medicare as any, expectedMedicare),
      ).toBe(true);

      expect(equal(results.totalTaxes, expected.totalTaxes)).toBe(true);
    });
  });

  describe("Percentages with a zero income base", () => {
    it("returns 0 rather than NaN when income is fully offset by IRA contributions", () => {
      // Reachable from the UI: the 401k field has a "set to max" button, and
      // the 2025 cap equals this income.
      const results = calculate(
        federal2025,
        oregon2025,
        23500,
        SINGLE,
        23500,
        undefined,
        undefined,
        [],
        "oregon",
        "portland",
      );

      expect(Number.isNaN(results.takeHome.percent)).toBe(false);
      expect(results.takeHome.percent).toBe(0);
      expect(results.totalFederal.percent).toBe(0);
      expect(results.totalState.percent).toBe(0);
    });

    it("guards getPercent directly", () => {
      expect(getPercent(asCurrency(0), asCurrency(0))).toBe(0);
      expect(getPercent(asCurrency(100), asCurrency(0))).toBe(0);
    });
  });

  describe("Flat fee thresholds", () => {
    it("applies Portland's Arts Tax at exactly $1,000 of gross income", () => {
      // The $1,000 test is against gross income, not income after Oregon's
      // standard deduction, and the rule is "$1,000 or more".
      const below = calculate(
        federal2025,
        oregon2025,
        999,
        SINGLE,
        0,
        undefined,
        undefined,
        [],
        "oregon",
        "portland",
      );
      const atThreshold = calculate(
        federal2025,
        oregon2025,
        1000,
        SINGLE,
        0,
        undefined,
        undefined,
        [],
        "oregon",
        "portland",
      );

      expect(equal(below.totalCity.amount, asCurrency(0))).toBe(true);
      expect(equal(atThreshold.totalCity.amount, asCurrency(35))).toBe(true);
    });

    it("does not let the state standard deduction suppress the Arts Tax", () => {
      // $3,500 gross is above $1,000 even though it is below it after
      // Oregon's $2,835 standard deduction.
      const results = calculate(
        federal2025,
        oregon2025,
        3500,
        SINGLE,
        0,
        undefined,
        undefined,
        [],
        "oregon",
        "portland",
      );
      expect(equal(results.totalCity.amount, asCurrency(35))).toBe(true);
    });

    it("applies Denver's occupational privilege tax at exactly $6,000", () => {
      const below = calculate(
        federal2025,
        colorado2025,
        5999,
        SINGLE,
        0,
        undefined,
        undefined,
        [],
        "colorado",
        "denver",
      );
      const atThreshold = calculate(
        federal2025,
        colorado2025,
        6000,
        SINGLE,
        0,
        undefined,
        undefined,
        [],
        "colorado",
        "denver",
      );

      expect(equal(below.totalCity.amount, asCurrency(0))).toBe(true);
      // $5.75 a month, annualized
      expect(equal(atThreshold.totalCity.amount, asCurrency(69))).toBe(true);
    });

    it("annualizes a weekly flat fee", () => {
      // Charleston charges $3 a week.
      const results = calculate(
        federal2025,
        westVirginia2025,
        50000,
        SINGLE,
        0,
        undefined,
        undefined,
        [],
        "west_virginia",
        "charleston",
      );
      expect(equal(results.totalCity.amount, asCurrency(3 * 52))).toBe(true);
    });
  });

  describe("Portland Arts Tax, tax year 2026", () => {
    // Ordinance 192185: $50 single / $100 filing jointly, on Oregon taxable
    // income above $20,000 / $40,000.
    it("charges $50 to a single filer above the taxable income threshold", () => {
      const results = calculate(
        federal2026,
        oregon2026,
        40000,
        SINGLE,
        0,
        undefined,
        undefined,
        [],
        "oregon",
        "portland",
      );
      expect(equal(results.totalCity.amount, asCurrency(50))).toBe(true);
    });

    it("charges $100 to joint filers above their higher threshold", () => {
      const results = calculate(
        federal2026,
        oregon2026,
        80000,
        MARRIED,
        0,
        undefined,
        undefined,
        [],
        "oregon",
        "portland",
      );
      expect(equal(results.totalCity.amount, asCurrency(100))).toBe(true);
    });

    it("charges nothing below the threshold", () => {
      const results = calculate(
        federal2026,
        oregon2026,
        15000,
        SINGLE,
        0,
        undefined,
        undefined,
        [],
        "oregon",
        "portland",
      );
      expect(equal(results.totalCity.amount, asCurrency(0))).toBe(true);
    });
  });

  describe("asCurrency", () => {
    it("rounds to whole cents instead of throwing", () => {
      expect(() => asCurrency(1000.005)).not.toThrow();
      expect(toCents(asCurrency(2.5))).toBe(250);
      expect(toCents(asCurrency(5.75))).toBe(575);
    });
  });

  describe("Wage-based taxes ignore the state standard deduction", () => {
    it("charges Birmingham's occupational tax on gross wages", () => {
      // Alabama municipal occupational taxes are withheld from gross wages, so
      // Alabama's standard deduction must not shrink the base.
      const income = 100000;
      const results = calculate(
        federal2025,
        alabama2025,
        income,
        SINGLE,
        0,
        undefined,
        undefined,
        [],
        "alabama",
        "birmingham",
      );

      // 1% of the full $100,000, not of income after the state deduction
      expect(equal(results.totalCity.amount, asCurrency(1000))).toBe(true);
    });

    it("still nets out 401k contributions before charging it", () => {
      // Gross income here means after IRA but before deductions, the same
      // base FICA uses.
      const results = calculate(
        federal2025,
        alabama2025,
        100000,
        SINGLE,
        10000,
        undefined,
        undefined,
        [],
        "alabama",
        "birmingham",
      );
      expect(equal(results.totalCity.amount, asCurrency(900))).toBe(true);
    });

    it("charges Oregon's transit tax on gross wages", () => {
      // 0.1% of $100,000, not of income after Oregon's standard deduction
      const results = calculate(
        federal2025,
        oregon2025,
        100000,
        SINGLE,
        0,
        undefined,
        undefined,
        [],
        "oregon",
        "",
      );
      expect(
        equal(results.stateResults.oregon_transit_tax as any, asCurrency(100)),
      ).toBe(true);
    });
  });
  describe("Eugene's payroll tax is a rate lookup, not a marginal schedule", () => {
    // The City's rate chart says its purpose is "to obtain the rate to be
    // applied to all subject wages paid in a pay period". Charging it
    // marginally understated it at every income above the exempt threshold.
    const eugene = (
      stateData: typeof oregon2026,
      income: number,
      totalIRA = 0,
    ) =>
      calculate(
        federal2026,
        stateData,
        income,
        SINGLE,
        totalIRA,
        undefined,
        undefined,
        [],
        "oregon",
        "eugene",
      ).totalCity.amount;

    it("charges 0.44% of all wages once the threshold is cleared", () => {
      // $440, not the $302.26 a marginal reading of { min: 32344 } produces
      expect(equal(eugene(oregon2026, 100000), asCurrency(440))).toBe(true);
    });

    it("charges nothing below the exempt threshold", () => {
      expect(equal(eugene(oregon2026, 32343), asCurrency(0))).toBe(true);
    });

    it("charges the full rate at exactly the threshold", () => {
      // The chart reads "equal to or more than $32,344", so the band is
      // inclusive at its floor.
      expect(equal(eugene(oregon2026, 32344), asCurrency(32344 * 0.0044))).toBe(
        true,
      );
    });

    it("uses the reduced 0.30% band in years that still had one", () => {
      // 2023 chart: at least $29,557 but less than $31,221 pays 0.30% on all
      // wages. $30,000 x 0.003 = $90.
      expect(
        equal(
          calculate(
            federal2025,
            oregon2023,
            30000,
            SINGLE,
            0,
            undefined,
            undefined,
            [],
            "oregon",
            "eugene",
          ).totalCity.amount,
          asCurrency(90),
        ),
      ).toBe(true);
    });

    it("looks the rate up after 401k contributions, not before", () => {
      // Subject wages are gross wages after pre-tax deductions, so a big
      // deferral can drop the employee below the exempt threshold entirely.
      expect(equal(eugene(oregon2026, 40000, 8000), asCurrency(0))).toBe(true);
    });
  });

  describe("City taxes levied on wages rather than state taxable income", () => {
    it("charges the Kansas City earnings tax on gross wages", () => {
      // RSMo 92.111(2)(1) levies it on "salaries, wages, commissions and other
      // compensation". Missouri's standard deduction tracks the federal one, so
      // charging it on taxable income understated this by $161 at any income.
      const results = calculate(
        federal2026,
        missouri2026,
        100000,
        SINGLE,
        0,
        undefined,
        undefined,
        [],
        "missouri",
        "kansas_city",
      );
      expect(equal(results.totalCity.amount, asCurrency(1000))).toBe(true);
    });

    it("leaves Yonkers on state taxable income", () => {
      // The counter-case the per-schedule basis exists for: `city_income`
      // covers both kinds, and New York's does start after the deduction.
      const income = 100000;
      const deduction = (newYork2026[STANDARD_DEDUCTION] as any)[SINGLE];
      const results = calculate(
        federal2026,
        newYork2026,
        income,
        SINGLE,
        0,
        undefined,
        undefined,
        [],
        "new_york",
        "yonkers",
      );
      expect(
        equal(
          (results.stateResults.cities as any).city_income,
          asCurrency((income - deduction) * 0.005),
        ),
      ).toBe(true);
    });
  });
});
