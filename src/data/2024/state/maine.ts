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
    [HEAD_OF_HOUSEHOLD]: 21900,
  },
  [STATE_INCOME]: {
    [SINGLE]: [
      { min: 0, max: 26050, rate: 5.8 },
      { min: 26050, max: 61600, rate: 6.75 },
      { min: 61600, max: INFINITY, rate: 7.15 },
    ],
    [MARRIED]: [
      { min: 0, max: 52100, rate: 5.8 },
      { min: 52100, max: 123250, rate: 6.75 },
      { min: 123250, max: INFINITY, rate: 7.15 },
    ],
    [MARRIED_SEPARATELY]: [
      { min: 0, max: 26050, rate: 5.8 },
      { min: 26050, max: 61600, rate: 6.75 },
      { min: 61600, max: INFINITY, rate: 7.15 },
    ],
    [HEAD_OF_HOUSEHOLD]: [
      { min: 0, max: 39050, rate: 5.8 },
      { min: 39050, max: 92450, rate: 6.75 },
      { min: 92450, max: INFINITY, rate: 7.15 },
    ],
  },
} as TaxData;
