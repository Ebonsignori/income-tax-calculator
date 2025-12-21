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
    [SINGLE]: 12750,
    [MARRIED]: 25500,
    [MARRIED_SEPARATELY]: 12750,
    [HEAD_OF_HOUSEHOLD]: 19125,
  },
  [STATE_INCOME]: {
    [SINGLE]: [{ min: 0, max: INFINITY, rate: 4.75 }],
    [MARRIED]: [{ min: 0, max: INFINITY, rate: 4.75 }],
    [MARRIED_SEPARATELY]: [{ min: 0, max: INFINITY, rate: 4.75 }],
    [HEAD_OF_HOUSEHOLD]: [{ min: 0, max: INFINITY, rate: 4.75 }],
  },
} as TaxData;
