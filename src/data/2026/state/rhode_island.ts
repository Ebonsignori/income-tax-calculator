import { INFINITY } from "@/constants";
import {
  ALL,
  HEAD_OF_HOUSEHOLD,
  MARRIED,
  MARRIED_SEPARATELY,
  SINGLE,
} from "@/constants/filing-status";
import {
  RI_TEMPORARY_DISABILITY_INSURANCE,
  STANDARD_DEDUCTION,
  STATE_INCOME,
} from "@/constants/tax_types";
import type { TaxData } from "@/types";

export default {
  // CARRIED FROM 2025 — RI indexes annually and the 2026 RI-1040
  // instructions were not published yet. Revisit.
  [STANDARD_DEDUCTION]: {
    [SINGLE]: 10900,
    [MARRIED]: 21800,
    [MARRIED_SEPARATELY]: 10900,
    [HEAD_OF_HOUSEHOLD]: 16350,
  },
  [STATE_INCOME]: {
    [SINGLE]: [
      { min: 0, max: 82050, rate: 3.75 },
      { min: 82050, max: 186450, rate: 4.75 },
      { min: 186450, max: INFINITY, rate: 5.99 },
    ],
    [MARRIED]: [
      { min: 0, max: 82050, rate: 3.75 },
      { min: 82050, max: 186450, rate: 4.75 },
      { min: 186450, max: INFINITY, rate: 5.99 },
    ],
    [MARRIED_SEPARATELY]: [
      { min: 0, max: 82050, rate: 3.75 },
      { min: 82050, max: 186450, rate: 4.75 },
      { min: 186450, max: INFINITY, rate: 5.99 },
    ],
    [HEAD_OF_HOUSEHOLD]: [
      { min: 0, max: 82050, rate: 3.75 },
      { min: 82050, max: 186450, rate: 4.75 },
      { min: 186450, max: INFINITY, rate: 5.99 },
    ],
  },
  [RI_TEMPORARY_DISABILITY_INSURANCE]: {
    [ALL]: [
      { min: 0, max: 100000, rate: 1.1 },
      { min: 100000, max: INFINITY, rate: 0 },
    ],
  },
} as TaxData;
