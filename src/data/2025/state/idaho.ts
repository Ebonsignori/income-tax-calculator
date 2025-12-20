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
    [SINGLE]: 15000,
    [MARRIED]: 30000,
    [MARRIED_SEPARATELY]: 15000,
    [HEAD_OF_HOUSEHOLD]: 22500,
  },
  [STATE_INCOME]: {
    [SINGLE]: [
      { min: 0, max: 2500, rate: 0 },
      { min: 2500, max: INFINITY, rate: 5.3 },
    ],
    [MARRIED]: [
      { min: 0, max: 5000, rate: 0 },
      { min: 5000, max: INFINITY, rate: 5.3 },
    ],
    [MARRIED_SEPARATELY]: [
      { min: 0, max: 2500, rate: 0 },
      { min: 2500, max: INFINITY, rate: 5.3 },
    ],
    [HEAD_OF_HOUSEHOLD]: [
      { min: 0, max: 3750, rate: 0 },
      { min: 3750, max: INFINITY, rate: 5.3 },
    ],
  },
} as TaxData;
