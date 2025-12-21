import { INFINITY } from "@/constants";
import { ALL } from "@/constants/filing-status";
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
    [ALL]: [
      { min: 0, max: 1207, rate: 0 },
      { min: 1207, max: 2414, rate: 2 },
      { min: 2414, max: 3621, rate: 2.5 },
      { min: 3621, max: 4828, rate: 3 },
      { min: 4828, max: 6035, rate: 3.5 },
      { min: 6035, max: 7242, rate: 4 },
      { min: 7242, max: 8449, rate: 4.5 },
      { min: 8449, max: INFINITY, rate: 4.95 },
    ],
  },
} as TaxData;
