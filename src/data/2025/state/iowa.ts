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
    [SINGLE]: 15750,
    [MARRIED]: 31500,
    [MARRIED_SEPARATELY]: 15750,
    [HEAD_OF_HOUSEHOLD]: 23625,
  },
  [STATE_INCOME]: {
    [SINGLE]: [{ min: 0, max: INFINITY, rate: 3.8 }],
    [MARRIED]: [{ min: 0, max: INFINITY, rate: 3.8 }],
    [MARRIED_SEPARATELY]: [{ min: 0, max: INFINITY, rate: 3.8 }],
    [HEAD_OF_HOUSEHOLD]: [{ min: 0, max: INFINITY, rate: 3.8 }],
  },
} as TaxData;
