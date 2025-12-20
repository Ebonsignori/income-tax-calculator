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
    [SINGLE]: 15000,
    [MARRIED]: 30000,
    [MARRIED_SEPARATELY]: 15000,
    [HEAD_OF_HOUSEHOLD]: 15000,
  },
  [STATE_INCOME]: {
    [SINGLE]: [
      { min: 0, max: 47150, rate: 0 },
      { min: 47150, max: 238200, rate: 1.95 },
      { min: 238200, max: INFINITY, rate: 2.5 },
    ],
    [MARRIED]: [
      { min: 0, max: 78775, rate: 0 },
      { min: 78775, max: 289975, rate: 1.95 },
      { min: 289975, max: INFINITY, rate: 2.5 },
    ],
    [MARRIED_SEPARATELY]: [
      { min: 0, max: 39375, rate: 0 },
      { min: 39375, max: 144975, rate: 1.95 },
      { min: 144975, max: INFINITY, rate: 2.5 },
    ],
    [HEAD_OF_HOUSEHOLD]: [
      { min: 0, max: 63175, rate: 0 },
      { min: 63175, max: 264100, rate: 1.95 },
      { min: 264100, max: INFINITY, rate: 2.5 },
    ],
  },
} as TaxData;
