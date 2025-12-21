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
      { min: 0, max: 45400, rate: 3.35 },
      { min: 45400, max: 110050, rate: 6.6 },
      { min: 110050, max: 229550, rate: 7.6 },
      { min: 229550, max: INFINITY, rate: 8.75 },
    ],
    [MARRIED]: [
      { min: 0, max: 75850, rate: 3.35 },
      { min: 75850, max: 183400, rate: 6.6 },
      { min: 183400, max: 279450, rate: 7.6 },
      { min: 279450, max: INFINITY, rate: 8.75 },
    ],
    [MARRIED_SEPARATELY]: [
      { min: 0, max: 37925, rate: 3.35 },
      { min: 37925, max: 91700, rate: 6.6 },
      { min: 91700, max: 139725, rate: 7.6 },
      { min: 139725, max: INFINITY, rate: 8.75 },
    ],
    [HEAD_OF_HOUSEHOLD]: [
      { min: 0, max: 60850, rate: 3.35 },
      { min: 60850, max: 157150, rate: 6.6 },
      { min: 157150, max: 254500, rate: 7.6 },
      { min: 254500, max: INFINITY, rate: 8.75 },
    ],
  },
} as TaxData;
