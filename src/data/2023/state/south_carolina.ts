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
    [SINGLE]: 13850,
    [MARRIED]: 27700,
    [MARRIED_SEPARATELY]: 13850,
    [HEAD_OF_HOUSEHOLD]: 20800,
  },
  [STATE_INCOME]: {
    [SINGLE]: [
      { min: 0, max: 3460, rate: 0 },
      { min: 3460, max: 17330, rate: 3 },
      { min: 17330, max: INFINITY, rate: 6.4 },
    ],
    [MARRIED]: [
      { min: 0, max: 3460, rate: 0 },
      { min: 3460, max: 17330, rate: 3 },
      { min: 17330, max: INFINITY, rate: 6.4 },
    ],
    [MARRIED_SEPARATELY]: [
      { min: 0, max: 3460, rate: 0 },
      { min: 3460, max: 17330, rate: 3 },
      { min: 17330, max: INFINITY, rate: 6.4 },
    ],
    [HEAD_OF_HOUSEHOLD]: [
      { min: 0, max: 3460, rate: 0 },
      { min: 3460, max: 17330, rate: 3 },
      { min: 17330, max: INFINITY, rate: 6.4 },
    ],
  },
} as TaxData;
