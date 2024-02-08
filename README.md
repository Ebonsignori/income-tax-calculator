# Income Tax Calculator

[![Netlify Status](https://api.netlify.com/api/v1/badges/000c009b-6eb5-40f7-b10f-f52779cb1caa/deploy-status)](https://app.netlify.com/sites/peppy-centaur-2b8fe8/deploys)

Calculates USA Federal, State, and City income cities tax.

Accounts for city-specific taxes, unlike other online calculators.

## Tax Data

All tax data used for calculations is located in [src/data](./src/data).

### Validating tax data

After updating tax data, validate it with `npm run validate-tax-data`

## Generating OG Images

1. Run the server with `NODE_ENV=development`, this can be done via `npm run dev`
2. In another terminal run `npm run generate-og-images`

`public/og-images` should be populated with screen captures for each page.

[get-metadata.ts](src/utils/get-metadata.ts) makes sure each page has a `<meta` tag pointing to the matching OG image.


## TODO before launch

- Add other states / cities

- Ad in middle of screen

- Get PWA working offline for uncached states/cities

# Later TODO

- Improve accessibility

- Tax options {...key} error in console? may be a Next.js bug

- Metadata only via tag, may be a Next.js bug

- Expand Calculator tests

- Use `usePathname` to get Next.js URL and aysnc load the path params, show loader, and suggest URL
- Write about it
