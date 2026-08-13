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
    [SINGLE]: 16100,
    [MARRIED]: 32200,
    [MARRIED_SEPARATELY]: 16100,
    [HEAD_OF_HOUSEHOLD]: 24150,
  },
  [STATE_INCOME]: {
    [SINGLE]: [{ min: 0, max: INFINITY, rate: 3.8 }],
    [MARRIED]: [{ min: 0, max: INFINITY, rate: 3.8 }],
    [MARRIED_SEPARATELY]: [{ min: 0, max: INFINITY, rate: 3.8 }],
    [HEAD_OF_HOUSEHOLD]: [{ min: 0, max: INFINITY, rate: 3.8 }],
  },
} as TaxData;
