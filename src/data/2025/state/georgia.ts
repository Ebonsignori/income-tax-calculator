import { INFINITY } from "@/constants";
import {
  ALL,
  HEAD_OF_HOUSEHOLD,
  MARRIED,
  MARRIED_SEPARATELY,
  SINGLE,
} from "@/constants/filing-status";
import { STANDARD_DEDUCTION, STATE_INCOME } from "@/constants/tax_types";
import type { TaxData } from "@/types";

export default {
  [STANDARD_DEDUCTION]: {
    [SINGLE]: 12000,
    [MARRIED]: 24000,
    [MARRIED_SEPARATELY]: 12000,
    [HEAD_OF_HOUSEHOLD]: 12000,
  },
  [STATE_INCOME]: {
    [ALL]: [{ min: 0, max: INFINITY, rate: 5.19 }],
  },
} as TaxData;
