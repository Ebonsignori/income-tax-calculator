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
    [SINGLE]: 3160,
    [MARRIED]: 6320,
    [MARRIED_SEPARATELY]: 3160,
    [HEAD_OF_HOUSEHOLD]: 3160,
  },
  [STATE_INCOME]: {
    [SINGLE]: [{ min: 0, max: INFINITY, rate: 4 }],
    [MARRIED]: [{ min: 0, max: INFINITY, rate: 4 }],
    [MARRIED_SEPARATELY]: [{ min: 0, max: INFINITY, rate: 4 }],
    [HEAD_OF_HOUSEHOLD]: [{ min: 0, max: INFINITY, rate: 4 }],
  },
} as TaxData;
