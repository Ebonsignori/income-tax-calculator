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
    [SINGLE]: 8500,
    [MARRIED]: 17000,
    [MARRIED_SEPARATELY]: 8500,
    [HEAD_OF_HOUSEHOLD]: 8500,
  },
  [STATE_INCOME]: {
    [SINGLE]: [
      { min: 0, max: 3000, rate: 2 },
      { min: 3000, max: 5000, rate: 3 },
      { min: 5000, max: 17000, rate: 5 },
      { min: 17000, max: INFINITY, rate: 5.75 },
    ],
    [MARRIED]: [
      { min: 0, max: 3000, rate: 2 },
      { min: 3000, max: 5000, rate: 3 },
      { min: 5000, max: 17000, rate: 5 },
      { min: 17000, max: INFINITY, rate: 5.75 },
    ],
    [MARRIED_SEPARATELY]: [
      { min: 0, max: 3000, rate: 2 },
      { min: 3000, max: 5000, rate: 3 },
      { min: 5000, max: 17000, rate: 5 },
      { min: 17000, max: INFINITY, rate: 5.75 },
    ],
    [HEAD_OF_HOUSEHOLD]: [
      { min: 0, max: 3000, rate: 2 },
      { min: 3000, max: 5000, rate: 3 },
      { min: 5000, max: 17000, rate: 5 },
      { min: 17000, max: INFINITY, rate: 5.75 },
    ],
  },
} as TaxData;
