import { describe, it, expect } from "vitest";
import Dinero from "dinero.js";
import { calculate } from "@/utils/calculator";
import { asCurrency } from "@/utils/calculator";
import federal2025 from "@/data/2025/federal";
import oregon2025 from "@/data/2025/state/oregon";
import {
  SINGLE,
  MARRIED,
  MARRIED_SEPARATELY,
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
import type { TaxData } from "@/types";

/**
 * Manually calculate tax for a progressive bracket system using Dinero
 * This is our independent verification logic
 */
function calculateProgressiveTax(
  taxableIncome: Dinero.Dinero,
  brackets: any[],
): Dinero.Dinero {
  let totalTax = asCurrency(0);

  for (const bracket of brackets) {
    const min = asCurrency(bracket.min);
    const max =
      bracket.max === INFINITY
        ? taxableIncome
        : asCurrency(Math.min(bracket.max, taxableIncome.toUnit()));

    if (taxableIncome.lessThanOrEqual(min)) {
      break;
    }

    const bracketRange = max.subtract(min);
    if (bracketRange.lessThanOrEqual(asCurrency(0))) {
      continue;
    }

    let bracketTax = bracketRange.percentage(bracket.rate);

    // Handle percent_of_total for things like employer/employee split
    if (bracket.percent_of_total) {
      bracketTax = bracketTax.percentage(bracket.percent_of_total);
    }

    totalTax = totalTax.add(bracketTax);
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
  const incomeAfterIRA = grossIncome.subtract(asCurrency(ira));

  // Get standard deductions
  const federalStandardDeduction =
    (federal2025[STANDARD_DEDUCTION] as any)?.[filingStatus] || 0;
  const stateStandardDeduction =
    (oregon2025[STANDARD_DEDUCTION] as any)?.[filingStatus] || 0;

  // Use custom or standard deductions
  const fedDeductions = federalDeductions ?? federalStandardDeduction;
  const stateDeduct = stateDeductions ?? stateStandardDeduction;

  // Calculate taxable income
  const federalTaxableIncome = incomeAfterIRA.subtract(
    asCurrency(fedDeductions),
  );
  const stateTaxableIncome = incomeAfterIRA.subtract(asCurrency(stateDeduct));

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

  // Oregon Transit Tax
  const transitBrackets = (oregon2025[OREGON_TRANSIT_TAX] as any)?.[
    ALL
  ] as any[];
  const transitTax = calculateProgressiveTax(stateTaxableIncome, transitBrackets);

  // Oregon Paid Family and Medical Leave (on gross income after IRA)
  const paidLeaveBrackets = (
    oregon2025[OREGON_PAID_FAMILY_AND_MEDICAL_LEAVE] as any
  )?.[ALL] as any[];
  const paidLeaveTax = calculateProgressiveTax(
    incomeAfterIRA,
    paidLeaveBrackets,
  );

  const totalFederal = federalIncomeTax
    .add(socialSecurityTax)
    .add(medicareTax);
  const totalState = stateIncomeTax.add(transitTax).add(paidLeaveTax);
  const totalTaxes = totalFederal.add(totalState);
  const takeHome = incomeAfterIRA.subtract(totalTaxes);

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
      expect(results.federalTaxableIncome.equalsTo(expected.federalTaxableIncome)).toBe(true);
      expect(results.stateTaxableIncome.equalsTo(expected.stateTaxableIncome)).toBe(true);

      // Standard deduction for single filer in 2025
      const expectedFederalTaxableIncome = asCurrency(100000 - 15000);
      expect(results.federalTaxableIncome.equalsTo(expectedFederalTaxableIncome)).toBe(true);
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
      expect(results.federalTaxableIncome.equalsTo(expectedFederalTaxableIncome)).toBe(true);
      expect(results.federalTaxableIncome.equalsTo(expected.federalTaxableIncome)).toBe(true);
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
      expect(results.federalTaxableIncome.equalsTo(expectedFederalTaxableIncome)).toBe(true);
      expect(results.federalTaxableIncome.equalsTo(expected.federalTaxableIncome)).toBe(true);
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

      expect(results.federalTaxableIncome.equalsTo(expectedFederalTaxableIncome)).toBe(true);
      expect(results.stateTaxableIncome.equalsTo(expectedStateTaxableIncome)).toBe(true);
      expect(results.federalTaxableIncome.equalsTo(expected.federalTaxableIncome)).toBe(true);
      expect(results.stateTaxableIncome.equalsTo(expected.stateTaxableIncome)).toBe(true);
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
      const expectedSocialSecurity = grossIncomeAfterIRA.percentage(6.2);
      expect(
        (results.federalResults.social_security as any).equalsTo(
          expectedSocialSecurity,
        ),
      ).toBe(true);

      // Medicare: 1.45% of $45,000 (below threshold)
      const expectedMedicare = grossIncomeAfterIRA.percentage(1.45);
      expect(
        (results.federalResults.medicare as any).equalsTo(expectedMedicare),
      ).toBe(true);

      // Verify against independent calculation
      expect(
        (results.federalResults.social_security as any).equalsTo(
          expected.socialSecurityTax,
        ),
      ).toBe(true);
      expect(
        (results.federalResults.medicare as any).equalsTo(expected.medicareTax),
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
        (
          results.stateResults
            .oregon_paid_family_and_medical_leave as any
        ).equalsTo(expected.paidLeaveTax),
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
        (results.federalResults.federal_income as any).equalsTo(
          expected.federalIncomeTax,
        ),
      ).toBe(true);
      expect(
        (results.federalResults.social_security as any).equalsTo(
          expected.socialSecurityTax,
        ),
      ).toBe(true);
      expect(
        (results.federalResults.medicare as any).equalsTo(expected.medicareTax),
      ).toBe(true);
      expect(results.totalFederal.amount.equalsTo(expected.totalFederal)).toBe(true);

      expect(
        (results.stateResults.state_income as any).equalsTo(
          expected.stateIncomeTax,
        ),
      ).toBe(true);
      expect(
        (results.stateResults.oregon_transit_tax as any).equalsTo(
          expected.transitTax,
        ),
      ).toBe(true);
      expect(
        (
          results.stateResults
            .oregon_paid_family_and_medical_leave as any
        ).equalsTo(expected.paidLeaveTax),
      ).toBe(true);
      expect(results.totalState.amount.equalsTo(expected.totalState)).toBe(true);

      expect(results.totalTaxes.equalsTo(expected.totalTaxes)).toBe(true);
      expect(results.takeHome.amount.equalsTo(expected.takeHome)).toBe(true);
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
        (results.federalResults.federal_income as any).equalsTo(
          expected.federalIncomeTax,
        ),
      ).toBe(true);
      expect(
        (results.federalResults.social_security as any).equalsTo(
          expected.socialSecurityTax,
        ),
      ).toBe(true);
      expect(
        (results.federalResults.medicare as any).equalsTo(expected.medicareTax),
      ).toBe(true);
      expect(results.totalFederal.amount.equalsTo(expected.totalFederal)).toBe(true);
      expect(results.totalState.amount.equalsTo(expected.totalState)).toBe(true);
      expect(results.totalTaxes.equalsTo(expected.totalTaxes)).toBe(true);
      expect(results.takeHome.amount.equalsTo(expected.takeHome)).toBe(true);
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
        (results.federalResults.federal_income as any).equalsTo(
          expected.federalIncomeTax,
        ),
      ).toBe(true);
      expect(
        (results.federalResults.social_security as any).equalsTo(
          expected.socialSecurityTax,
        ),
      ).toBe(true);
      expect(
        (results.federalResults.medicare as any).equalsTo(expected.medicareTax),
      ).toBe(true);
      expect(results.totalFederal.amount.equalsTo(expected.totalFederal)).toBe(true);
      expect(results.totalState.amount.equalsTo(expected.totalState)).toBe(true);
      expect(results.totalTaxes.equalsTo(expected.totalTaxes)).toBe(true);
      expect(results.takeHome.amount.equalsTo(expected.takeHome)).toBe(true);
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
        (results.federalResults.federal_income as any).equalsTo(
          expected.federalIncomeTax,
        ),
      ).toBe(true);
      expect(
        (results.federalResults.social_security as any).equalsTo(
          expected.socialSecurityTax,
        ),
      ).toBe(true);
      expect(
        (results.federalResults.medicare as any).equalsTo(expected.medicareTax),
      ).toBe(true);
      expect(results.totalFederal.amount.equalsTo(expected.totalFederal)).toBe(true);
      expect(results.totalState.amount.equalsTo(expected.totalState)).toBe(true);
      expect(results.totalTaxes.equalsTo(expected.totalTaxes)).toBe(true);
      expect(results.takeHome.amount.equalsTo(expected.takeHome)).toBe(true);
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
        (results.federalResults.medicare as any).equalsTo(expected.medicareTax),
      ).toBe(true);
      expect(results.totalFederal.amount.equalsTo(expected.totalFederal)).toBe(true);
      expect(results.totalState.amount.equalsTo(expected.totalState)).toBe(true);
      expect(results.totalTaxes.equalsTo(expected.totalTaxes)).toBe(true);
      expect(results.takeHome.amount.equalsTo(expected.takeHome)).toBe(true);
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
        (results.federalResults.federal_income as any).equalsTo(
          expected.federalIncomeTax,
        ),
      ).toBe(true);
      expect(
        (results.federalResults.social_security as any).equalsTo(
          expected.socialSecurityTax,
        ),
      ).toBe(true);
      expect(
        (results.federalResults.medicare as any).equalsTo(expected.medicareTax),
      ).toBe(true);
      expect(results.totalFederal.amount.equalsTo(expected.totalFederal)).toBe(true);
      expect(results.totalState.amount.equalsTo(expected.totalState)).toBe(true);
      expect(results.totalTaxes.equalsTo(expected.totalTaxes)).toBe(true);
      expect(results.takeHome.amount.equalsTo(expected.takeHome)).toBe(true);
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

      expect(results.totalTaxes.equalsTo(expected.totalTaxes)).toBe(true);
      expect(results.takeHome.amount.equalsTo(expected.takeHome)).toBe(true);
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
      const maxSocialSecurity = asCurrency(176100).percentage(6.2);
      expect(
        (results.federalResults.social_security as any).equalsTo(
          maxSocialSecurity,
        ),
      ).toBe(true);
      expect(
        (results.federalResults.social_security as any).equalsTo(
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
      expect(results.federalTaxableIncome.equalsTo(expectedFederalTaxableIncome)).toBe(true);

      // But FICA should be on income after IRA only (not after standard deduction)
      const incomeAfterIRA = asCurrency(100000 - 23500);
      const expectedSocialSecurity = incomeAfterIRA.percentage(6.2);
      const expectedMedicare = incomeAfterIRA.percentage(1.45);

      expect(
        (results.federalResults.social_security as any).equalsTo(
          expectedSocialSecurity,
        ),
      ).toBe(true);
      expect(
        (results.federalResults.medicare as any).equalsTo(expectedMedicare),
      ).toBe(true);

      expect(results.totalTaxes.equalsTo(expected.totalTaxes)).toBe(true);
    });
  });
});
