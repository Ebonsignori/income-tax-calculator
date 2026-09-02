# Data

All tax bracket data is organized by TypeScript files that each export a default object:

- `{year}/federal.ts` - Values for each tax (e.g. income, medicare, social security) by filing status for the `{year}`

- `{year}/state/{state}.ts` - Values for each `{state}` level tax by filing status for the `{year}`. Any city-specific taxes are under the `[CITIES]` key.

For a complete example including state income tax, standard deductions, payroll taxes, and city-specific taxes, see [2025/state/oregon.ts](./2025/state/oregon.ts).

## Rate

`rate` is expressed as a percentage,

Examples:

- 0.58% = `rate: 0.58`
- 1.25% = `rate: 1.25`
- 13% = `rate: 13`

## Naming

Make sure to use `snake_case` for all state, city, and tax names.

Rather than adding string literals for city & tax names, add and reference a constant variable in the relevant [constants](../constants/) file.

- City names go in [cities.ts](../constants/cities.ts)

- Tax type names go in [tax-types.ts](../constants/tax_types.ts)

## File organization

The default object in each file is organized in the following format:

```typescript
import type { TaxData } from "@/types";

export default {
  "tax type": {
    "filing status": [
      { min: number, max: number, rate: number }  // Progressive tax brackets
      ||
      { min: number, amount: number }              // Flat fee (e.g., min: 1000, amount: 35)
      ||
      { ..., percent_of_total: number }            // Employee portion (e.g., 60 = 60% employee, 40% employer)
      ...
    ]
  }
} as TaxData;
```

**Filing Status:**

- Use specific filing statuses ([SINGLE, MARRIED, etc.](../constants/filing_status.ts)) for taxes that vary by status
- Use `ALL` for taxes applied the same way regardless of filing status (e.g., payroll taxes)

**Special Formats:**

- **Standard deductions**: Single number per filing status, not brackets (e.g., `[SINGLE]: 2835`)
- **INFINITY constant**: Use for the max of the highest bracket (e.g., `{ min: 250000, max: INFINITY, rate: 9.9 }`)
- **City taxes**: Nested under `[CITIES]: { [CITY_NAME]: { ... } }`

## Rate brackets must be contiguous

One bracket's `max` is the next bracket's `min` — the same number, written twice:

```typescript
{ min: 0,    max: 5500,  rate: 0 },
{ min: 5500, max: 10900, rate: 2 },   // not min: 5501, and not a previous max of 5499
```

A bracket is the range _above_ its `min` up to and including its `max`. Writing
`max: 5499` next to `min: 5500` leaves a dollar taxed at no rate, and the tax
tables render bracket floors from this convention, so mixing the two styles
makes the displayed range wrong too. `npm run validate-tax-data` enforces this.

Every filing status a tax defines must define all four — a partial set means the
calculator is handed `undefined` for the missing ones. Use `[ALL]` when the tax
does not vary by status.

## Rate lookups

Most rate schedules are marginal: each bracket taxes the slice of income between
its `min` and `max`. A few taxes instead use their bands to _pick_ a rate, which
is then charged on the whole base. Those set `rate_on_total` on every bracket:

```typescript
{ min: 0,     max: 32344,    rate: 0,    rate_on_total: true },
{ min: 32344, max: INFINITY, rate: 0.44, rate_on_total: true },   // 0.44% of everything
```

At $100,000 that is $440, not the $302.26 a marginal reading gives. Eugene's
community safety payroll tax is the only one so far; the City's published rate
chart states the rule outright — its purpose is "to obtain the rate to be
applied to all subject wages paid in a pay period."

Note the cliff this creates at the threshold, which is real: a dollar more in
wages turns $0 into $142.31.

## Which income a rate is charged on

By default the income base comes from the tax type — `grossIncomeTaxes` in
`utils/calculator.ts` lists the ones computed on wages (FICA, the state
paid-leave programs, the local occupational and payroll taxes); everything else
is computed on income after deductions.

Where the tax type alone does not settle it, a schedule says so with `basis`.
`city_income` is the case that needs it: Yonkers genuinely starts from state
taxable income, while the Kansas City and St. Louis earnings taxes are levied on
"salaries, wages, commissions and other compensation" (RSMo 92.111), so those
declare `basis: GROSS_INCOME_BASIS`.

`rate_on_total` and `basis` describe the whole schedule but are written per
bracket, and the calculator reads them off the first one. `npm run
validate-tax-data` rejects a schedule that sets either on only some brackets.

## Flat fees

A fixed-dollar tax uses `amount` instead of `rate`:

```typescript
{ min: 6000, amount: 5.75, frequency: "monthly" }   // Denver: $5.75/mo above $6,000
```

- `min` is **inclusive** — income _at_ the threshold owes the fee.
- `frequency` annualizes the amount (`weekly`, `biweekly`, `semi_monthly`,
  `monthly`, `annually`). Omit it for a fee that is already annual.
- `basis` picks which income figure the threshold is measured against:
  `"gross"` (the default — gross wages after IRA, before deductions) or
  `"taxable"` (after deductions). Most thresholds are written against gross
  wages; Portland's 2026 Arts Tax is the exception and tests Oregon taxable
  income, so it sets `basis: TAXABLE_INCOME_BASIS`.
- `amount` must land on a whole cent.

Where a schedule lists several tiers, the highest one the taxpayer qualifies for
applies; fees are not cumulative.

For example a `federal.ts` file might contain part of this object,

```js
import { INFINITY } from "@/constants";
import { SINGLE } from "@/constants/filing_status";
import { INCOME } from "@/constants/tax_types";

export default {
  [INCOME]: {
    [SINGLE]: [
      { min: 0, max: 11000, rate: 10 },
      { min: 11000, max: 44725, rate: 12 },
      { min: 44725, max: 95375, rate: 22 },
      { min: 95375, max: 182100, rate: 24 },
      { min: 182100, max: 231250, rate: 32 },
      { min: 231250, max: 578125, rate: 35 },
      { min: 578125, max: INFINITY, rate: 37 },
    ],
  },
};
```

## Contributing

When adding a new state or city:

1. Create/update the state file: `{year}/state/{state_name}.ts`
2. Add constants to:
   - [states.ts](../constants/states.ts) - if adding a new state
   - [cities.ts](../constants/cities.ts) - if adding a new city
   - [tax_types.ts](../constants/tax_types.ts) - if adding a new tax type
3. Validate: `npm run validate-tax-data`
4. Test: `npm test`

## Why

We split the files up like this for [code splitting](https://nextjs.org/docs/pages/building-your-application/optimizing/lazy-loading#nextdynamic) so that the entire JSON database of brackets isn't sent to the user when they load the page. Instead the client will fetch the necessary files as needed based on the user's selection.
