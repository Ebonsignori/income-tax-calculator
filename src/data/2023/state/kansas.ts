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
    [SINGLE]: 3500,
    [MARRIED]: 8000,
    [MARRIED_SEPARATELY]: 3500,
    [HEAD_OF_HOUSEHOLD]: 6000,
  },
  [STATE_INCOME]: {
    [SINGLE]: [
      { min: 0, max: 15000, rate: 3.1 },
      { min: 15000, max: 30000, rate: 5.25 },
      { min: 30000, max: INFINITY, rate: 5.7 },
    ],
    [MARRIED]: [
      { min: 0, max: 30000, rate: 3.1 },
      { min: 30000, max: 60000, rate: 5.25 },
      { min: 60000, max: INFINITY, rate: 5.7 },
    ],
    [MARRIED_SEPARATELY]: [
      { min: 0, max: 15000, rate: 3.1 },
      { min: 15000, max: 30000, rate: 5.25 },
      { min: 30000, max: INFINITY, rate: 5.7 },
    ],
    [HEAD_OF_HOUSEHOLD]: [
      { min: 0, max: 15000, rate: 3.1 },
      { min: 15000, max: 30000, rate: 5.25 },
      { min: 30000, max: INFINITY, rate: 5.7 },
    ],
  },
} as TaxData;
