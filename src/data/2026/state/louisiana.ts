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
    [SINGLE]: 12875,
    [MARRIED]: 25750,
    [MARRIED_SEPARATELY]: 12875,
    [HEAD_OF_HOUSEHOLD]: 25750,
  },
  [STATE_INCOME]: {
    [SINGLE]: [{ min: 0, max: INFINITY, rate: 3 }],
    [MARRIED]: [{ min: 0, max: INFINITY, rate: 3 }],
    [MARRIED_SEPARATELY]: [{ min: 0, max: INFINITY, rate: 3 }],
    [HEAD_OF_HOUSEHOLD]: [{ min: 0, max: INFINITY, rate: 3 }],
  },
} as TaxData;
