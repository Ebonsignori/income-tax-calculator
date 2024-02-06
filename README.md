# Income Tax Calculator

[![Netlify Status](https://api.netlify.com/api/v1/badges/000c009b-6eb5-40f7-b10f-f52779cb1caa/deploy-status)](https://app.netlify.com/sites/peppy-centaur-2b8fe8/deploys)

Calculates USA Federal, State, and City income cities tax.

Accounts for city-specific taxes, unlike other online calculators.

## Tax Data

All tax data used for calculations is located in [src/data](./src/data).

## TODO before launch

- Ad in middle of screen

- Use paycheck frequency instead of per month: 
  - Weekly – 52 paychecks per year.
  - Biweekly – 26 paychecks per year.
  - Semi-monthly – 24 paychecks per year.
  - Monthly – 12 paychecks per year.

- Add other states / cities

- Verify PWA works offline for uncached states/cities
  
# Later TODO

Improve accessibility

- Tax options {...key} error in console? may be a Next.js bug

- Metadata only via tag, may be a Next.js bug
