import { INFINITY, TAXABLE_INCOME_BASIS } from "@/constants";
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
    [SINGLE]: 2910,
    [MARRIED]: 5820,
    [MARRIED_SEPARATELY]: 2910,
    [HEAD_OF_HOUSEHOLD]: 4680,
  },
  [STATE_INCOME]: {
    [SINGLE]: [
      { min: 0, max: 4550, rate: 4.75 },
      { min: 4550, max: 11400, rate: 6.75 },
      { min: 11400, max: 125000, rate: 8.75 },
      { min: 125000, max: INFINITY, rate: 9.9 },
    ],
    [MARRIED]: [
      { min: 0, max: 9100, rate: 4.75 },
      { min: 9100, max: 22800, rate: 6.75 },
      { min: 22800, max: 250000, rate: 8.75 },
      { min: 250000, max: INFINITY, rate: 9.9 },
    ],
    [MARRIED_SEPARATELY]: [
      { min: 0, max: 4550, rate: 4.75 },
      { min: 4550, max: 11400, rate: 6.75 },
      { min: 11400, max: 125000, rate: 8.75 },
      { min: 125000, max: INFINITY, rate: 9.9 },
    ],
    [HEAD_OF_HOUSEHOLD]: [
      { min: 0, max: 9100, rate: 4.75 },
      { min: 9100, max: 22800, rate: 6.75 },
      { min: 22800, max: 250000, rate: 8.75 },
      { min: 250000, max: INFINITY, rate: 9.9 },
    ],
  },
  [OREGON_TRANSIT_TAX]: {
    [ALL]: [{ min: 0, max: INFINITY, rate: 0.1 }],
  },
  [OREGON_PAID_FAMILY_AND_MEDICAL_LEAVE]: {
    [ALL]: [{ min: 0, max: 184500, rate: 1, percent_of_total: 60 }],
  },
  [CITIES]: {
    [PORTLAND]: {
      // Ordinance 192185 (passed 2026-05-27) rewrote the Arts Tax for tax year
      // 2026: $35 flat becomes $50 ($100 filing jointly), and the $1,000 income
      // and federal-poverty exemptions are replaced by an Oregon-taxable-income
      // threshold of $20,000 (single/MFS) or $40,000 (MFJ/HoH). Rate and
      // threshold begin inflation-indexing in tax year 2027.
      [ART_TAX]: {
        [SINGLE]: [{ min: 20000, amount: 50, basis: TAXABLE_INCOME_BASIS }],
        [MARRIED]: [{ min: 40000, amount: 100, basis: TAXABLE_INCOME_BASIS }],
        [MARRIED_SEPARATELY]: [
          { min: 20000, amount: 50, basis: TAXABLE_INCOME_BASIS },
        ],
        [HEAD_OF_HOUSEHOLD]: [
          { min: 40000, amount: 50, basis: TAXABLE_INCOME_BASIS },
        ],
      },
      [SUPPORTIVE_HOUSING_SERVICES]: {
        [SINGLE]: [{ min: 128000, max: INFINITY, rate: 1 }],
        [MARRIED]: [{ min: 205000, max: INFINITY, rate: 1 }],
        [MARRIED_SEPARATELY]: [{ min: 128000, max: INFINITY, rate: 1 }],
        [HEAD_OF_HOUSEHOLD]: [{ min: 205000, max: INFINITY, rate: 1 }],
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
          // Chart of 7/1/2026 - 6/30/2027.
          { min: 0, max: 32344, rate: 0, rate_on_total: true },
          { min: 32344, max: INFINITY, rate: 0.44, rate_on_total: true },
        ],
      },
    },
  },
} as TaxData;
