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
    [SINGLE]: 13960,
    [MARRIED]: 25840,
    [MARRIED_SEPARATELY]: 13960,
    [HEAD_OF_HOUSEHOLD]: 13960,
  },
  [STATE_INCOME]: {
    [SINGLE]: [
      { min: 0, max: 15110, rate: 3.5 },
      { min: 15110, max: 51950, rate: 4.4 },
      { min: 51950, max: 332720, rate: 5.3 },
      { min: 332720, max: INFINITY, rate: 7.65 },
    ],
    [MARRIED]: [
      { min: 0, max: 20150, rate: 3.5 },
      { min: 20150, max: 69260, rate: 4.4 },
      { min: 69260, max: 443630, rate: 5.3 },
      { min: 443630, max: INFINITY, rate: 7.65 },
    ],
    [MARRIED_SEPARATELY]: [
      { min: 0, max: 10075, rate: 3.5 },
      { min: 10075, max: 34630, rate: 4.4 },
      { min: 34630, max: 221815, rate: 5.3 },
      { min: 221815, max: INFINITY, rate: 7.65 },
    ],
    [HEAD_OF_HOUSEHOLD]: [
      { min: 0, max: 15110, rate: 3.5 },
      { min: 15110, max: 51950, rate: 4.4 },
      { min: 51950, max: 332720, rate: 5.3 },
      { min: 332720, max: INFINITY, rate: 7.65 },
    ],
  },
} as TaxData;
