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
    [SINGLE]: 3605,
    [MARRIED]: 8240,
    [MARRIED_SEPARATELY]: 4120,
    [HEAD_OF_HOUSEHOLD]: 6180,
  },
  [STATE_INCOME]: {
    [SINGLE]: [
      { min: 0, max: 23000, rate: 5.2 },
      { min: 23000, max: INFINITY, rate: 5.58 },
    ],
    [MARRIED]: [
      { min: 0, max: 46000, rate: 5.2 },
      { min: 46000, max: INFINITY, rate: 5.58 },
    ],
    [MARRIED_SEPARATELY]: [
      { min: 0, max: 23000, rate: 5.2 },
      { min: 23000, max: INFINITY, rate: 5.58 },
    ],
    [HEAD_OF_HOUSEHOLD]: [
      { min: 0, max: 23000, rate: 5.2 },
      { min: 23000, max: INFINITY, rate: 5.58 },
    ],
  },
} as TaxData;
