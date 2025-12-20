import { INFINITY } from "@/constants";
import {
  HEAD_OF_HOUSEHOLD,
  MARRIED,
  MARRIED_SEPARATELY,
  SINGLE,
} from "@/constants/filing-status";
import { STATE_INCOME, STANDARD_DEDUCTION } from "@/constants/tax_types";
import type { TaxData } from "@/types";

export default {
  [STANDARD_DEDUCTION]: {
    [SINGLE]: 2340,
    [MARRIED]: 4680,
    [MARRIED_SEPARATELY]: 2340,
    [HEAD_OF_HOUSEHOLD]: 2340,
  },
  [STATE_INCOME]: {
    [SINGLE]: [
      { min: 0, max: 5500, rate: 0 },
      { min: 5500, max: 10900, rate: 2 },
      { min: 10900, max: 15600, rate: 3 },
      { min: 15600, max: 25700, rate: 3.4 },
      { min: 25700, max: 92300, rate: 3.9 },
      { min: 92300, max: INFINITY, rate: 3.9 },
    ],
    [MARRIED]: [
      { min: 0, max: 5500, rate: 0 },
      { min: 5500, max: 10900, rate: 2 },
      { min: 10900, max: 15600, rate: 3 },
      { min: 15600, max: 25700, rate: 3.4 },
      { min: 25700, max: 92300, rate: 3.9 },
      { min: 92300, max: INFINITY, rate: 3.9 },
    ],
    [MARRIED_SEPARATELY]: [
      { min: 0, max: 5500, rate: 0 },
      { min: 5500, max: 10900, rate: 2 },
      { min: 10900, max: 15600, rate: 3 },
      { min: 15600, max: 25700, rate: 3.4 },
      { min: 25700, max: 92300, rate: 3.9 },
      { min: 92300, max: INFINITY, rate: 3.9 },
    ],
    [HEAD_OF_HOUSEHOLD]: [
      { min: 0, max: 5500, rate: 0 },
      { min: 5500, max: 10900, rate: 2 },
      { min: 10900, max: 15600, rate: 3 },
      { min: 15600, max: 25700, rate: 3.4 },
      { min: 25700, max: 92300, rate: 3.9 },
      { min: 92300, max: INFINITY, rate: 3.9 },
    ],
  },
} as TaxData;
