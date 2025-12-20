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
    [SINGLE]: 2300,
    [MARRIED]: 4600,
    [MARRIED_SEPARATELY]: 2300,
    [HEAD_OF_HOUSEHOLD]: 2300,
  },
  [STATE_INCOME]: {
    [ALL]: [
      { min: 0, max: 10000, rate: 0 },
      { min: 10000, max: INFINITY, rate: 4.7 },
    ],
  },
} as TaxData;
