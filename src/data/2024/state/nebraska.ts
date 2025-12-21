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
    [SINGLE]: 8380,
    [MARRIED]: 16760,
    [MARRIED_SEPARATELY]: 8380,
    [HEAD_OF_HOUSEHOLD]: 12620,
  },
  [STATE_INCOME]: {
    [SINGLE]: [
      { min: 0, max: 3000, rate: 2.46 },
      { min: 3000, max: 18000, rate: 3.51 },
      { min: 18000, max: 29000, rate: 5.01 },
      { min: 29000, max: INFINITY, rate: 5.84 },
    ],
    [MARRIED]: [
      { min: 0, max: 6000, rate: 2.46 },
      { min: 6000, max: 36000, rate: 3.51 },
      { min: 36000, max: 58000, rate: 5.01 },
      { min: 58000, max: INFINITY, rate: 5.84 },
    ],
    [MARRIED_SEPARATELY]: [
      { min: 0, max: 3000, rate: 2.46 },
      { min: 3000, max: 18000, rate: 3.51 },
      { min: 18000, max: 29000, rate: 5.01 },
      { min: 29000, max: INFINITY, rate: 5.84 },
    ],
    [HEAD_OF_HOUSEHOLD]: [
      { min: 0, max: 5600, rate: 2.46 },
      { min: 5600, max: 28800, rate: 3.51 },
      { min: 28800, max: 43000, rate: 5.01 },
      { min: 43000, max: INFINITY, rate: 5.84 },
    ],
  },
} as TaxData;
