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
    [HEAD_OF_HOUSEHOLD]: 22500,
  },
  [STATE_INCOME]: {
    [SINGLE]: [
      { min: 0, max: 26800, rate: 5.8 },
      { min: 26800, max: 63450, rate: 6.75 },
      { min: 63450, max: INFINITY, rate: 7.15 },
    ],
    [MARRIED]: [
      { min: 0, max: 53600, rate: 5.8 },
      { min: 53600, max: 126900, rate: 6.75 },
      { min: 126900, max: INFINITY, rate: 7.15 },
    ],
    [MARRIED_SEPARATELY]: [
      { min: 0, max: 26800, rate: 5.8 },
      { min: 26800, max: 63450, rate: 6.75 },
      { min: 63450, max: INFINITY, rate: 7.15 },
    ],
    [HEAD_OF_HOUSEHOLD]: [
      { min: 0, max: 40200, rate: 5.8 },
      { min: 40200, max: 95150, rate: 6.75 },
      { min: 95150, max: INFINITY, rate: 7.15 },
    ],
  },
} as TaxData;
