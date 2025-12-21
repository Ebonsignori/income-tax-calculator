# Unit Tests

This directory contains unit tests for the income tax calculator using [Vitest](https://vitest.dev/).

## Overview

The unit tests verify the accuracy of tax calculations by:

1. **Using Dinero.js for precise arithmetic** - No floating-point errors
2. **Independent calculation verification** - Tests include separate logic to manually calculate expected results
3. **Comprehensive coverage** - Tests standard deductions, FICA tax bases, progressive brackets, and edge cases

## Running Tests

```bash
# Run all unit tests
npm run test:unit

# Run in watch mode (auto-rerun on file changes)
npm run test:unit:watch

# Open interactive UI
npm run test:unit:ui

# Run all tests (unit + e2e)
npm test
```

## Test Structure

### `calculator.test.ts`

Main test file for the tax calculator with the following test suites:

#### 1. Standard Deduction Application
- Verifies standard deductions are applied when custom deductions aren't provided
- Tests all filing statuses (Single, Married, Head of Household)
- Ensures custom deductions override standard deductions when provided

#### 2. FICA Tax Base Verification
- Confirms FICA taxes (Social Security, Medicare) use gross income (after IRA)
- Validates that standard/itemized deductions do NOT reduce FICA taxes
- Tests state payroll taxes use correct income base

#### 3. Complete Tax Calculation Verification
- End-to-end tests comparing calculator output against independent calculations
- Tests various income levels and filing statuses
- Includes high-earner scenarios that trigger additional Medicare tax

#### 4. Edge Cases
- Zero income handling
- Social Security wage base limits ($176,100 in 2025)
- Maximum IRA/401k contributions
- Interaction between IRA contributions and FICA taxes

## How Tests Work

### Independent Verification

Each test includes two calculations:

1. **Calculator Output** - Runs through the actual `calculate()` function
2. **Expected Values** - Independently calculated using `calculateExpectedTaxes()`

The two results are compared using Dinero's `.equalsTo()` method for precise equality.

### Example

```typescript
it("should correctly calculate all taxes - Single filer, $100k", () => {
  const income = 100000;
  const filingStatus = SINGLE;
  const ira = 0;

  // Run calculator
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

  // Calculate expected values independently
  const expected = calculateExpectedTaxes(income, filingStatus, ira);

  // Compare using Dinero precision
  expect(results.totalTaxes.equalsTo(expected.totalTaxes)).toBe(true);
  expect(results.takeHome.amount.equalsTo(expected.takeHome)).toBe(true);
});
```

## Key Tax Rules Verified

### Standard Deductions (2025)
- Single: $15,000
- Married: $30,000
- Head of Household: $22,500

### FICA Taxes
- **Social Security**: 6.2% on first $176,100 of gross wages (after pre-tax 401k, but NOT after standard deduction)
- **Medicare**: 1.45% on all gross wages (after pre-tax 401k, but NOT after standard deduction)
- **Additional Medicare**: 0.9% on gross wages above $200k (Single) or $250k (Married)

### Income Taxes
- Calculated on taxable income (gross income - IRA - deductions)
- Uses progressive brackets
- Different brackets for each filing status

### State Payroll Taxes
- Oregon Paid Family & Medical Leave: 1% of first $176,100, employee pays 60%
- Calculated on gross income (after IRA), NOT taxable income

## Debugging Failed Tests

If a test fails:

1. **Check the error message** - Vitest will show which value doesn't match
2. **Use watch mode** - `npm run test:unit:watch` for instant feedback
3. **Use the UI** - `npm run test:unit:ui` for visual debugging
4. **Check Dinero values** - Use `.toUnit()` to see actual dollar amounts

```typescript
// Add this to see actual values:
console.log('Calculator:', results.totalTaxes.toUnit());
console.log('Expected:', expected.totalTaxes.toUnit());
```

## Adding New Tests

To add a new test case:

```typescript
it("should handle [your scenario]", () => {
  const income = 75000;
  const filingStatus = SINGLE;
  const ira = 5000;

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
});
```

## Benefits Over Previous Audit Scripts

The previous audit scripts (in `/scripts/`) have been replaced with these unit tests because:

1. **Precision**: Dinero.js eliminates floating-point rounding errors
2. **Integration**: Runs as part of `npm test` and CI/CD pipeline
3. **Speed**: Vitest is fast (~200ms for 15 tests)
4. **Developer Experience**: Watch mode, UI, and IDE integration
5. **Maintainability**: Standard testing framework with better error messages

## CI/CD Integration

These tests run automatically:

- Before every commit (if using git hooks)
- In CI/CD pipeline
- Before deployment

Failed tests block deployment, ensuring tax calculations are always accurate.

## Coverage

To generate test coverage:

```bash
npx vitest run --coverage
```

## Related Documentation

- [Vitest Documentation](https://vitest.dev/)
- [Dinero.js Documentation](https://dinerojs.com/)
- [Main Audit Report](../../AUDIT_REPORT.md)
- [Tax Data README](../../src/data/README.md)
