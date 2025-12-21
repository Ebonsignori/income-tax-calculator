import { INFINITY } from "@/constants";
import {
  ALL,
  HEAD_OF_HOUSEHOLD,
  MARRIED,
  MARRIED_SEPARATELY,
  SINGLE,
} from "@/constants/filing-status";
import { STANDARD_DEDUCTION, STATE_INCOME } from "@/constants/tax_types";
import type { TaxData } from "@/types";

export default {
  [STANDARD_DEDUCTION]: {
    [SINGLE]: 2340,
    [MARRIED]: 4680,
    [MARRIED_SEPARATELY]: 2340,
    [HEAD_OF_HOUSEHOLD]: 2340,
  },
  [STATE_INCOME]: {
    [ALL]: [
      { min: 0, max: 5099, rate: 0 },
      { min: 5099, max: 10299, rate: 2 },
      { min: 10299, max: 14699, rate: 3 },
      { min: 14699, max: 24299, rate: 3.4 },
      { min: 24299, max: INFINITY, rate: 4.7 },
    ],
  },
} as TaxData;
