# [Income Tax Calculator](https://income-tax.org/)

[![Netlify Status](https://api.netlify.com/api/v1/badges/e5febf5c-a294-4da3-aad2-97638044909d/deploy-status)](https://app.netlify.com/projects/serene-liger-7f3279/deploys)

https://income-tax.org/

Calculates USA Federal, State, and City income cities tax.

Accounts for city-specific taxes (like Portland OR), unlike other online calculators.

If your city isn't included and you'd like to add it, see the [src/data/README.md](./src/data/README.md).

## Tax Data

All tax data used for calculations is located in [src/data](./src/data).

### Validating tax data

After updating tax data, validate it with `npm run validate-tax-data`


## Generating OG Images

1. Run a local dev instance with `npm run dev`
2. In another terminal run `npm run generate-og-images`

`public/og-images` should be populated with screen captures for each state and city. 

[get-metadata.ts](src/utils/get-metadata.ts) makes sure each page has a `<meta` tag pointing to the matching OG image.

## Standards

- All URLs and files should use dash case, e.g. `/localhost:3001/tax-tables/2025/missouri/kansas-city/?tables=city-income`, but all of our app code should use snake case for [constants](src/constants/), e.g. `kansas_city` and `city_income`.
- `npm run lint` and `npm run lint:fix` to keep code formatted.
- Use [end-to-end tests](./tests/) over unit tests.