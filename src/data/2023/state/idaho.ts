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
      { min: 0, max: 4489, rate: 0 },
      { min: 4489, max: INFINITY, rate: 5.8 },
    ],
    [MARRIED]: [
      { min: 0, max: 8978, rate: 0 },
      { min: 8978, max: INFINITY, rate: 5.8 },
    ],
    [MARRIED_SEPARATELY]: [
      { min: 0, max: 4489, rate: 0 },
      { min: 4489, max: INFINITY, rate: 5.8 },
    ],
    [HEAD_OF_HOUSEHOLD]: [
      { min: 0, max: 6733, rate: 0 },
      { min: 6733, max: INFINITY, rate: 5.8 },
    ],
  },
} as TaxData;
