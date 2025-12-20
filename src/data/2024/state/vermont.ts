import { INFINITY } from "@/constants";
import {
  HEAD_OF_HOUSEHOLD,
  MARRIED,
  MARRIED_SEPARATELY,
  SINGLE,
} from "@/constants/filing-status";
import { STANDARD_DEDUCTION, STATE_INCOME } from "@/constants/tax_types";
import type { TaxData } from "@/types";

export default {
  [STANDARD_DEDUCTION]: {
    [SINGLE]: 14600,
    [MARRIED]: 29200,
    [MARRIED_SEPARATELY]: 14600,
    [HEAD_OF_HOUSEHOLD]: 29200,
  },
  [STATE_INCOME]: {
    [SINGLE]: [
      { min: 0, max: 47900, rate: 3.35 },
      { min: 47900, max: 116000, rate: 6.6 },
      { min: 116000, max: 242000, rate: 7.6 },
      { min: 242000, max: INFINITY, rate: 8.75 },
    ],
    [MARRIED]: [
      { min: 0, max: 75000, rate: 3.35 },
      { min: 75000, max: 193300, rate: 6.6 },
      { min: 193300, max: 294600, rate: 7.6 },
      { min: 294600, max: INFINITY, rate: 8.75 },
    ],
    [MARRIED_SEPARATELY]: [
      { min: 0, max: 39975, rate: 3.35 },
      { min: 39975, max: 96650, rate: 6.6 },
      { min: 96650, max: 147300, rate: 7.6 },
      { min: 147300, max: INFINITY, rate: 8.75 },
    ],
    [HEAD_OF_HOUSEHOLD]: [
      { min: 0, max: 64200, rate: 3.35 },
      { min: 64200, max: 165700, rate: 6.6 },
      { min: 165700, max: 268300, rate: 7.6 },
      { min: 268300, max: INFINITY, rate: 8.75 },
    ],
  },
} as TaxData;
