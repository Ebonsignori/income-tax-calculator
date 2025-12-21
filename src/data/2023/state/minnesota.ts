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
    [SINGLE]: 13825,
    [MARRIED]: 27650,
    [MARRIED_SEPARATELY]: 13825,
    [HEAD_OF_HOUSEHOLD]: 20800,
  },
  [STATE_INCOME]: {
    [SINGLE]: [
      { min: 0, max: 30070, rate: 5.35 },
      { min: 30070, max: 98760, rate: 6.8 },
      { min: 98760, max: 183340, rate: 7.85 },
      { min: 183340, max: INFINITY, rate: 9.85 },
    ],
    [MARRIED]: [
      { min: 0, max: 43950, rate: 5.35 },
      { min: 43950, max: 174610, rate: 6.8 },
      { min: 174610, max: 304970, rate: 7.85 },
      { min: 304970, max: INFINITY, rate: 9.85 },
    ],
    [MARRIED_SEPARATELY]: [
      { min: 0, max: 21975, rate: 5.35 },
      { min: 21975, max: 87305, rate: 6.8 },
      { min: 87305, max: 152485, rate: 7.85 },
      { min: 152485, max: INFINITY, rate: 9.85 },
    ],
    [HEAD_OF_HOUSEHOLD]: [
      { min: 0, max: 37010, rate: 5.35 },
      { min: 37010, max: 148730, rate: 6.8 },
      { min: 148730, max: 243720, rate: 7.85 },
      { min: 243720, max: INFINITY, rate: 9.85 },
    ],
  },
} as TaxData;
