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
    [HEAD_OF_HOUSEHOLD]: 12250,
  },
  [STATE_INCOME]: {
    [SINGLE]: [
      { min: 0, max: 2999, rate: 2.46 },
      { min: 2999, max: 17999, rate: 3.51 },
      { min: 17999, max: 28999, rate: 5.01 },
      { min: 28999, max: INFINITY, rate: 5.84 },
    ],
    [MARRIED]: [
      { min: 0, max: 5999, rate: 2.46 },
      { min: 5999, max: 35999, rate: 3.51 },
      { min: 35999, max: 57999, rate: 5.01 },
      { min: 57999, max: INFINITY, rate: 5.84 },
    ],
    [MARRIED_SEPARATELY]: [
      { min: 0, max: 2999, rate: 2.46 },
      { min: 2999, max: 17999, rate: 3.51 },
      { min: 17999, max: 28999, rate: 5.01 },
      { min: 28999, max: INFINITY, rate: 5.84 },
    ],
    [HEAD_OF_HOUSEHOLD]: [
      { min: 0, max: 5599, rate: 2.46 },
      { min: 5599, max: 28799, rate: 3.51 },
      { min: 28799, max: 42999, rate: 5.01 },
      { min: 42999, max: INFINITY, rate: 5.84 },
    ],
  },
} as TaxData;
