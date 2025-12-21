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
      { min: 0, max: 24500, rate: 5.8 },
      { min: 24500, max: 58050, rate: 6.75 },
      { min: 58050, max: INFINITY, rate: 7.15 },
    ],
    [MARRIED]: [
      { min: 0, max: 49050, rate: 5.8 },
      { min: 49050, max: 116100, rate: 6.75 },
      { min: 116100, max: INFINITY, rate: 7.15 },
    ],
    [MARRIED_SEPARATELY]: [
      { min: 0, max: 24500, rate: 5.8 },
      { min: 24500, max: 58050, rate: 6.75 },
      { min: 58050, max: INFINITY, rate: 7.15 },
    ],
    [HEAD_OF_HOUSEHOLD]: [
      { min: 0, max: 36750, rate: 5.8 },
      { min: 36750, max: 87100, rate: 6.75 },
      { min: 87100, max: INFINITY, rate: 7.15 },
    ],
  },
} as TaxData;
