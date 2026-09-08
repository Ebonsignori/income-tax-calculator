import { GROSS_INCOME_BASIS, INFINITY } from "@/constants";
import { WILMINGTON, CITIES } from "@/constants/cities";
import {
  ALL,
  HEAD_OF_HOUSEHOLD,
  MARRIED,
  MARRIED_SEPARATELY,
  SINGLE,
} from "@/constants/filing-status";
import {
  CITY_INCOME,
  STANDARD_DEDUCTION,
  STATE_INCOME,
} from "@/constants/tax_types";
import type { TaxData } from "@/types";

export default {
  [STANDARD_DEDUCTION]: {
    [SINGLE]: 3250,
    [MARRIED]: 6500,
    [MARRIED_SEPARATELY]: 3250,
    [HEAD_OF_HOUSEHOLD]: 3250,
  },
  [STATE_INCOME]: {
    [ALL]: [
      { min: 0, max: 2000, rate: 0 },
      { min: 2000, max: 5000, rate: 2.2 },
      { min: 5000, max: 10000, rate: 3.9 },
      { min: 10000, max: 20000, rate: 4.8 },
      { min: 20000, max: 25000, rate: 5.2 },
      { min: 25000, max: 60000, rate: 5.55 },
      { min: 60000, max: INFINITY, rate: 6.6 },
    ],
  },
  [CITIES]: {
    [WILMINGTON]: {
      // 22 Del. C. sec. 903 defines the base as "the total income from
      // whatever source earned by any resident of such city", and the City's
      // own budget states it outright -- "WAGE TAX / Base: Individual gross
      // earned income of City residents." Delaware's $3,250 standard deduction
      // is a Title 30 personal-income-tax figure and does not reach this tax,
      // so the rate must not be charged on income after it. Same defect, and
      // same fix, as the Missouri earnings taxes.
      // Rate 1.25% is the statutory ceiling in 22 Del. C. sec. 902 and the rate
      // actually levied; unchanged FY2025 through FY2027.
      // https://delcode.delaware.gov/title22/c009/index.html
      // https://wilmdebudget.org/wp-content/uploads/2026/03/fy27-tax-rates.pdf
      [CITY_INCOME]: {
        [ALL]: [
          { min: 0, max: INFINITY, rate: 1.25, basis: GROSS_INCOME_BASIS },
        ],
      },
    },
  },
} as TaxData;
