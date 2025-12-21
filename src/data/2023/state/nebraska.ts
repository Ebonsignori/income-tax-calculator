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
    [SINGLE]: 7900,
    [MARRIED]: 15800,
    [MARRIED_SEPARATELY]: 7900,
    [HEAD_OF_HOUSEHOLD]: 11600,
  },
  [STATE_INCOME]: {
    [SINGLE]: [
      { min: 0, max: 3700, rate: 2.46 },
      { min: 3700, max: 22170, rate: 3.51 },
      { min: 22170, max: 35730, rate: 5.01 },
      { min: 35730, max: INFINITY, rate: 6.64 },
    ],
    [MARRIED]: [
      { min: 0, max: 7390, rate: 2.46 },
      { min: 7390, max: 44350, rate: 3.51 },
      { min: 44350, max: 71460, rate: 5.01 },
      { min: 71460, max: INFINITY, rate: 6.64 },
    ],
    [MARRIED_SEPARATELY]: [
      { min: 0, max: 3700, rate: 2.46 },
      { min: 3700, max: 22170, rate: 3.51 },
      { min: 22170, max: 35730, rate: 5.01 },
      { min: 35730, max: INFINITY, rate: 6.64 },
    ],
    [HEAD_OF_HOUSEHOLD]: [
      { min: 0, max: 6900, rate: 2.46 },
      { min: 6900, max: 35480, rate: 3.51 },
      { min: 35480, max: 52980, rate: 5.01 },
      { min: 52980, max: INFINITY, rate: 6.64 },
    ],
  },
} as TaxData;
