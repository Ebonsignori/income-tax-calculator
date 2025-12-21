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
      { min: 0, max: 5500, rate: 1.7 },
      { min: 5500, max: 11000, rate: 3.2 },
      { min: 11000, max: 16000, rate: 4.7 },
      { min: 16000, max: 210000, rate: 4.9 },
      { min: 210000, max: INFINITY, rate: 5.9 },
    ],
    [MARRIED]: [
      { min: 0, max: 8000, rate: 1.7 },
      { min: 8000, max: 16000, rate: 3.2 },
      { min: 16000, max: 24000, rate: 4.7 },
      { min: 24000, max: 315000, rate: 4.9 },
      { min: 315000, max: INFINITY, rate: 5.9 },
    ],
    [MARRIED_SEPARATELY]: [
      { min: 0, max: 4000, rate: 1.7 },
      { min: 4000, max: 8000, rate: 3.2 },
      { min: 8000, max: 12000, rate: 4.7 },
      { min: 12000, max: 157500, rate: 4.9 },
      { min: 157500, max: INFINITY, rate: 5.9 },
    ],
    [HEAD_OF_HOUSEHOLD]: [
      { min: 0, max: 8000, rate: 1.7 },
      { min: 8000, max: 16000, rate: 3.2 },
      { min: 16000, max: 24000, rate: 4.7 },
      { min: 24000, max: 315000, rate: 4.9 },
      { min: 315000, max: INFINITY, rate: 5.9 },
    ],
  },
} as TaxData;
