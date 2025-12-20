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
    [SINGLE]: 14600,
    [MARRIED]: 29200,
    [MARRIED_SEPARATELY]: 14600,
    [HEAD_OF_HOUSEHOLD]: 29200,
  },
  [STATE_INCOME]: {
    [SINGLE]: [
      { min: 0, max: 47600, rate: 3.35 },
      { min: 47600, max: 115350, rate: 5.4 },
      { min: 115350, max: 200200, rate: 6.6 },
      { min: 200200, max: 254400, rate: 7.6 },
      { min: 254400, max: INFINITY, rate: 8.75 },
    ],
    [MARRIED]: [
      { min: 0, max: 79300, rate: 3.35 },
      { min: 79300, max: 192250, rate: 5.4 },
      { min: 192250, max: 333650, rate: 6.6 },
      { min: 333650, max: 424000, rate: 7.6 },
      { min: 424000, max: INFINITY, rate: 8.75 },
    ],
    [MARRIED_SEPARATELY]: [
      { min: 0, max: 47600, rate: 3.35 },
      { min: 47600, max: 115350, rate: 5.4 },
      { min: 115350, max: 200200, rate: 6.6 },
      { min: 200200, max: 254400, rate: 7.6 },
      { min: 254400, max: INFINITY, rate: 8.75 },
    ],
    [HEAD_OF_HOUSEHOLD]: [
      { min: 0, max: 79300, rate: 3.35 },
      { min: 79300, max: 192250, rate: 5.4 },
      { min: 192250, max: 333650, rate: 6.6 },
      { min: 333650, max: 424000, rate: 7.6 },
      { min: 424000, max: INFINITY, rate: 8.75 },
    ],
  },
} as TaxData;
