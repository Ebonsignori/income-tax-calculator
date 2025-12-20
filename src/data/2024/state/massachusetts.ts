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
    [SINGLE]: 4400,
    [MARRIED]: 8800,
    [MARRIED_SEPARATELY]: 4400,
    [HEAD_OF_HOUSEHOLD]: 6800,
  },
  [STATE_INCOME]: {
    [SINGLE]: [
      { min: 0, max: 1000000, rate: 5 },
      { min: 1000000, max: INFINITY, rate: 9 },
    ],
    [MARRIED]: [
      { min: 0, max: 1000000, rate: 5 },
      { min: 1000000, max: INFINITY, rate: 9 },
    ],
    [MARRIED_SEPARATELY]: [
      { min: 0, max: 1000000, rate: 5 },
      { min: 1000000, max: INFINITY, rate: 9 },
    ],
    [HEAD_OF_HOUSEHOLD]: [
      { min: 0, max: 1000000, rate: 5 },
      { min: 1000000, max: INFINITY, rate: 9 },
    ],
  },
} as TaxData;
