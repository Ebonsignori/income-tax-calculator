# Data

All tax bracket data is organized by TypeScript files that each export a default object:

- `{year}/federal.ts` - Values for each tax (e.g. income, medicare, social security) by filing status for the `{year}`

- `{year}/states/{state}.ts` - Values for each `{state}` level tax by filing status for the `{year}`. Any city-specific taxes are under the `[CITIES]` key.

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

```js
export default {
  "tax type": {
    "filing status": [
      { min: number, max: number, rate: number }
      ||
      { min: number, amount: number }
      ||
      { ..., percent_of_total: number }
      ...
    ]
  }
```

Where "filing status" is one of [these values](../constants/filing_status.ts)

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

Feel free to make a PR to add or fix any of the brackets. Just follow the patterns above to organize the filesystem.

Run `npm run validate-tax-data` after updating tax data to make sure the schema is valid.

## Why

We split the files up like this for [code splitting](https://nextjs.org/docs/pages/building-your-application/optimizing/lazy-loading#nextdynamic) so that the entire JSON database of brackets isn't sent to the user when they load the page. Instead the client will fetch the necessary files as needed based on the user's selection.
