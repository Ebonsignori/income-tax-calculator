import { INFINITY } from "@/constants";
import {
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
  [STANDARD_DEDUCTION]: {
    [SINGLE]: 10000,
    [MARRIED]: 20050,
    [MARRIED_SEPARATELY]: 10025,
    [HEAD_OF_HOUSEHOLD]: 15050,
  },
  [STATE_INCOME]: {
    [SINGLE]: [
      { min: 0, max: 73450, rate: 3.75 },
      { min: 73450, max: 166950, rate: 4.75 },
      { min: 166950, max: INFINITY, rate: 5.99 },
    ],
    [MARRIED]: [
      { min: 0, max: 73450, rate: 3.75 },
      { min: 73450, max: 166950, rate: 4.75 },
      { min: 166950, max: INFINITY, rate: 5.99 },
    ],
    [MARRIED_SEPARATELY]: [
      { min: 0, max: 73450, rate: 3.75 },
      { min: 73450, max: 166950, rate: 4.75 },
      { min: 166950, max: INFINITY, rate: 5.99 },
    ],
    [HEAD_OF_HOUSEHOLD]: [
      { min: 0, max: 73450, rate: 3.75 },
      { min: 73450, max: 166950, rate: 4.75 },
      { min: 166950, max: INFINITY, rate: 5.99 },
    ],
  },
  [RI_TEMPORARY_DISABILITY_INSURANCE]: {
    [SINGLE]: [{ min: 0, max: 84000, rate: 1.1 }],
    [MARRIED]: [{ min: 0, max: 84000, rate: 1.1 }],
    [MARRIED_SEPARATELY]: [{ min: 0, max: 84000, rate: 1.1 }],
    [HEAD_OF_HOUSEHOLD]: [{ min: 0, max: 84000, rate: 1.1 }],
  },
} as TaxData;
