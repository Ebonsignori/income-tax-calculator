import { INFINITY } from "@/constants";
import { ALL } from "@/constants/filing-status";
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
    [SINGLE]: 5540,
    [MARRIED]: 11080,
    [MARRIED_SEPARATELY]: 5540,
    [HEAD_OF_HOUSEHOLD]: 5540,
  },
  [STATE_INCOME]: {
    [ALL]: [
      { min: 0, max: 3600, rate: 1 },
      { min: 3600, max: 6300, rate: 2 },
      { min: 6300, max: 9700, rate: 3 },
      { min: 9700, max: 13000, rate: 4 },
      { min: 13000, max: 16800, rate: 5 },
      { min: 16800, max: 21600, rate: 6 },
      { min: 21600, max: INFINITY, rate: 6.75 },
    ],
  },
} as TaxData;
