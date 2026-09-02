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
    [SINGLE]: 2410,
    [MARRIED]: 4820,
    [MARRIED_SEPARATELY]: 2410,
    [HEAD_OF_HOUSEHOLD]: 2410,
  },
  [STATE_INCOME]: {
    [SINGLE]: [
      { min: 0, max: 5500, rate: 0 },
      { min: 5500, max: 10900, rate: 2 },
      { min: 10900, max: 15600, rate: 3 },
      { min: 15600, max: 25700, rate: 3.4 },
      { min: 25700, max: INFINITY, rate: 3.9 },
    ],
    [MARRIED]: [
      { min: 0, max: 5500, rate: 0 },
      { min: 5500, max: 10900, rate: 2 },
      { min: 10900, max: 15600, rate: 3 },
      { min: 15600, max: 25700, rate: 3.4 },
      { min: 25700, max: INFINITY, rate: 3.9 },
    ],
    [MARRIED_SEPARATELY]: [
      { min: 0, max: 5500, rate: 0 },
      { min: 5500, max: 10900, rate: 2 },
      { min: 10900, max: 15600, rate: 3 },
      { min: 15600, max: 25700, rate: 3.4 },
      { min: 25700, max: INFINITY, rate: 3.9 },
    ],
    [HEAD_OF_HOUSEHOLD]: [
      { min: 0, max: 5500, rate: 0 },
      { min: 5500, max: 10900, rate: 2 },
      { min: 10900, max: 15600, rate: 3 },
      { min: 15600, max: 25700, rate: 3.4 },
      { min: 25700, max: INFINITY, rate: 3.9 },
    ],
  },
} as TaxData;
