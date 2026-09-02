import { INFINITY } from "@/constants";
import { CITIES, EUGENE, PORTLAND } from "@/constants/cities";
import {
  ALL,
  HEAD_OF_HOUSEHOLD,
  MARRIED,
  MARRIED_SEPARATELY,
  SINGLE,
} from "@/constants/filing-status";
import {
  ART_TAX,
  EMPLOYEE_PAYROLL_TAX,
  OREGON_PAID_FAMILY_AND_MEDICAL_LEAVE,
  OREGON_TRANSIT_TAX,
  PRESCHOOL_FOR_ALL,
  STANDARD_DEDUCTION,
  STATE_INCOME,
  SUPPORTIVE_HOUSING_SERVICES,
} from "@/constants/tax_types";
import type { TaxData } from "@/types";

export default {
  [STANDARD_DEDUCTION]: {
    [SINGLE]: 2835,
    [MARRIED]: 5670,
    [MARRIED_SEPARATELY]: 2835,
    [HEAD_OF_HOUSEHOLD]: 4560,
  },
  [STATE_INCOME]: {
    [SINGLE]: [
      { min: 0, max: 4300, rate: 4.75 },
      { min: 4300, max: 10750, rate: 6.75 },
      { min: 10750, max: 125000, rate: 8.75 },
      { min: 125000, max: INFINITY, rate: 9.9 },
    ],
    [MARRIED]: [
      { min: 0, max: 8600, rate: 4.75 },
      { min: 8600, max: 21500, rate: 6.75 },
      { min: 21500, max: 250000, rate: 8.75 },
      { min: 250000, max: INFINITY, rate: 9.9 },
    ],
    [MARRIED_SEPARATELY]: [
      { min: 0, max: 4300, rate: 4.75 },
      { min: 4300, max: 10750, rate: 6.75 },
      { min: 10750, max: 125000, rate: 8.75 },
      { min: 125000, max: INFINITY, rate: 9.9 },
    ],
    [HEAD_OF_HOUSEHOLD]: [
      { min: 0, max: 8600, rate: 4.75 },
      { min: 8600, max: 21500, rate: 6.75 },
      { min: 21500, max: 250000, rate: 8.75 },
      { min: 250000, max: INFINITY, rate: 9.9 },
    ],
  },
  [OREGON_TRANSIT_TAX]: {
    [ALL]: [{ min: 0, max: INFINITY, rate: 0.1 }],
  },
  [OREGON_PAID_FAMILY_AND_MEDICAL_LEAVE]: {
    [ALL]: [{ min: 0, max: 176100, rate: 1, percent_of_total: 60 }],
  },
  [CITIES]: {
    [PORTLAND]: {
      [ART_TAX]: {
        [ALL]: [{ min: 1000, amount: 35 }],
      },
      [SUPPORTIVE_HOUSING_SERVICES]: {
        [SINGLE]: [{ min: 125000, max: INFINITY, rate: 1 }],
        [MARRIED]: [{ min: 200000, max: INFINITY, rate: 1 }],
        [MARRIED_SEPARATELY]: [{ min: 125000, max: INFINITY, rate: 1 }],
        [HEAD_OF_HOUSEHOLD]: [{ min: 200000, max: INFINITY, rate: 1 }],
      },
      [PRESCHOOL_FOR_ALL]: {
        [SINGLE]: [
          { min: 125000, max: 250000, rate: 1.5 },
          { min: 250000, max: INFINITY, rate: 3.0 },
        ],
        [MARRIED_SEPARATELY]: [
          { min: 125000, max: 250000, rate: 1.5 },
          { min: 250000, max: INFINITY, rate: 3.0 },
        ],
        [MARRIED]: [
          { min: 250000, max: 400000, rate: 1.5 },
          { min: 400000, max: INFINITY, rate: 3.0 },
        ],
        [HEAD_OF_HOUSEHOLD]: [
          { min: 125000, max: 250000, rate: 1.5 },
          { min: 250000, max: INFINITY, rate: 3.0 },
        ],
      },
    },
    [EUGENE]: {
      // Community safety payroll tax. The rate chart is a lookup, not a
      // marginal schedule: wages pick a rate, and that rate is charged on all
      // subject wages. `rate_on_total` is what says so.
      [EMPLOYEE_PAYROLL_TAX]: {
        [ALL]: [
          // Chart of 7/1/2025 - 6/30/2026. The minimum wage passed $15.00, so
          // Ordinance 20616's reduced 0.30% band no longer has any range.
          { min: 0, max: 31304, rate: 0, rate_on_total: true },
          { min: 31304, max: INFINITY, rate: 0.44, rate_on_total: true },
        ],
      },
    },
  },
} as TaxData;
