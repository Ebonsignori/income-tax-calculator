# Income Tax Calculator

[![Deploy site to Pages](https://github.com/Ebonsignori/income-tax-calculator/actions/workflows/github-pages-deploy.yml/badge.svg)](https://github.com/Ebonsignori/income-tax-calculator/actions/workflows/github-pages-deploy.yml)

https://ebonsignori.github.io/income-tax-calculator/

Calculates USA Federal, State, and City income cities tax.

Accounts for city-specific taxes (like Portland OR), unlike other online calculators.

If your city isn't included and you'd like to add it, see the [src/data/README.md](./src/data/README.md).

## Tax Data

All tax data used for calculations is located in [src/data](./src/data).

### Validating tax data

After updating tax data, validate it with `npm run validate-tax-data`

## Generating OG Images

1. Run the server with `NODE_ENV=development`, this can be done via `npm run dev`
2. In another terminal run `npm run generate-og-images`

`public/og-images` should be populated with screen captures for each page.

[get-metadata.ts](src/utils/get-metadata.ts) makes sure each page has a `<meta` tag pointing to the matching OG image.
