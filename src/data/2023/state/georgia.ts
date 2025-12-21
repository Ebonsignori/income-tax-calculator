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
    [SINGLE]: 5400,
    [MARRIED]: 7100,
    [MARRIED_SEPARATELY]: 3550,
    [HEAD_OF_HOUSEHOLD]: 5400,
  },
  [STATE_INCOME]: {
    [SINGLE]: [
      { min: 0, max: 750, rate: 1 },
      { min: 750, max: 2250, rate: 2 },
      { min: 2250, max: 3750, rate: 3 },
      { min: 3750, max: 5250, rate: 4 },
      { min: 5250, max: 7000, rate: 5 },
      { min: 7000, max: INFINITY, rate: 5.75 },
    ],
    [MARRIED]: [
      { min: 0, max: 1000, rate: 1 },
      { min: 1000, max: 3000, rate: 2 },
      { min: 3000, max: 5000, rate: 3 },
      { min: 5000, max: 7000, rate: 4 },
      { min: 7000, max: 10000, rate: 5 },
      { min: 10000, max: INFINITY, rate: 5.75 },
    ],
    [MARRIED_SEPARATELY]: [
      { min: 0, max: 500, rate: 1 },
      { min: 500, max: 1500, rate: 2 },
      { min: 1500, max: 2500, rate: 3 },
      { min: 2500, max: 3500, rate: 4 },
      { min: 3500, max: 5000, rate: 5 },
      { min: 5000, max: INFINITY, rate: 5.75 },
    ],
    [HEAD_OF_HOUSEHOLD]: [
      { min: 0, max: 1000, rate: 1 },
      { min: 1000, max: 3000, rate: 2 },
      { min: 3000, max: 5000, rate: 3 },
      { min: 5000, max: 7000, rate: 4 },
      { min: 7000, max: 10000, rate: 5 },
      { min: 10000, max: INFINITY, rate: 5.75 },
    ],
  },
} as TaxData;
