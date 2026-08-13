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
    [SINGLE]: 15750,
    [MARRIED]: 31500,
    [MARRIED_SEPARATELY]: 15750,
    [HEAD_OF_HOUSEHOLD]: 23625,
  },
  [STATE_INCOME]: {
    [SINGLE]: [
      { min: 0, max: 4811, rate: 0 },
      { min: 4811, max: INFINITY, rate: 5.3 },
    ],
    [MARRIED]: [
      { min: 0, max: 9622, rate: 0 },
      { min: 9622, max: INFINITY, rate: 5.3 },
    ],
    [MARRIED_SEPARATELY]: [
      { min: 0, max: 4811, rate: 0 },
      { min: 4811, max: INFINITY, rate: 5.3 },
    ],
    [HEAD_OF_HOUSEHOLD]: [
      { min: 0, max: 9622, rate: 0 },
      { min: 9622, max: INFINITY, rate: 5.3 },
    ],
  },
} as TaxData;
