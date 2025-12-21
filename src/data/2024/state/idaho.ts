import { INFINITY } from "@/constants";
import {
  HEAD_OF_HOUSEHOLD,
  MARRIED,
  MARRIED_SEPARATELY,
  SINGLE,
} from "@/constants/filing-status";
import { STATE_INCOME, STANDARD_DEDUCTION } from "@/constants/tax_types";
import type { TaxData } from "@/types";

export default {
  [STANDARD_DEDUCTION]: {
    [SINGLE]: 4489,
    [MARRIED]: 8978,
    [MARRIED_SEPARATELY]: 4489,
    [HEAD_OF_HOUSEHOLD]: 4489,
  },
  [STATE_INCOME]: {
    [SINGLE]: [
      { min: 0, max: 4673, rate: 0 },
      { min: 4673, max: INFINITY, rate: 5.695 },
    ],
    [MARRIED]: [
      { min: 0, max: 9346, rate: 0 },
      { min: 9346, max: INFINITY, rate: 5.695 },
    ],
    [MARRIED_SEPARATELY]: [
      { min: 0, max: 4673, rate: 0 },
      { min: 4673, max: INFINITY, rate: 5.695 },
    ],
    [HEAD_OF_HOUSEHOLD]: [
      { min: 0, max: 4673, rate: 0 },
      { min: 4673, max: INFINITY, rate: 5.695 },
    ],
  },
} as TaxData;
