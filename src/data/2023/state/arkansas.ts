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
      { min: 0, max: 5100, rate: 0 },
      { min: 5100, max: 10300, rate: 2 },
      { min: 10300, max: 14700, rate: 3 },
      { min: 14700, max: 24300, rate: 3.4 },
      { min: 24300, max: INFINITY, rate: 4.7 },
    ],
  },
} as TaxData;
