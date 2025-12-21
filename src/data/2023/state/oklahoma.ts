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
    [SINGLE]: 6350,
    [MARRIED]: 12700,
    [MARRIED_SEPARATELY]: 6350,
    [HEAD_OF_HOUSEHOLD]: 9350,
  },
  [STATE_INCOME]: {
    [SINGLE]: [
      { min: 0, max: 1000, rate: 0.25 },
      { min: 1000, max: 2500, rate: 0.75 },
      { min: 2500, max: 3750, rate: 1.75 },
      { min: 3750, max: 4900, rate: 2.75 },
      { min: 4900, max: 7200, rate: 3.75 },
      { min: 7200, max: INFINITY, rate: 4.75 },
    ],
    [MARRIED]: [
      { min: 0, max: 2000, rate: 0.25 },
      { min: 2000, max: 5000, rate: 0.75 },
      { min: 5000, max: 7500, rate: 1.75 },
      { min: 7500, max: 9800, rate: 2.75 },
      { min: 9800, max: 14400, rate: 3.75 },
      { min: 14400, max: INFINITY, rate: 4.75 },
    ],
    [MARRIED_SEPARATELY]: [
      { min: 0, max: 1000, rate: 0.25 },
      { min: 1000, max: 2500, rate: 0.75 },
      { min: 2500, max: 3750, rate: 1.75 },
      { min: 3750, max: 4900, rate: 2.75 },
      { min: 4900, max: 7200, rate: 3.75 },
      { min: 7200, max: INFINITY, rate: 4.75 },
    ],
    [HEAD_OF_HOUSEHOLD]: [
      { min: 0, max: 2000, rate: 0.25 },
      { min: 2000, max: 5000, rate: 0.75 },
      { min: 5000, max: 7500, rate: 1.75 },
      { min: 7500, max: 9800, rate: 2.75 },
      { min: 9800, max: 14400, rate: 3.75 },
      { min: 14400, max: INFINITY, rate: 4.75 },
    ],
  },
} as TaxData;
