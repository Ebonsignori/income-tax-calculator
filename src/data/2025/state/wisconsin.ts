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
    [SINGLE]: 13930,
    [MARRIED]: 25890,
    [MARRIED_SEPARATELY]: 13930,
    [HEAD_OF_HOUSEHOLD]: 13930,
  },
  [STATE_INCOME]: {
    [SINGLE]: [
      { min: 0, max: 14320, rate: 3.5 },
      { min: 14320, max: 28640, rate: 4.4 },
      { min: 28640, max: 315310, rate: 5.3 },
      { min: 315310, max: INFINITY, rate: 7.65 },
    ],
    [MARRIED]: [
      { min: 0, max: 19090, rate: 3.5 },
      { min: 19090, max: 38190, rate: 4.4 },
      { min: 38190, max: 420420, rate: 5.3 },
      { min: 420420, max: INFINITY, rate: 7.65 },
    ],
    [MARRIED_SEPARATELY]: [
      { min: 0, max: 9550, rate: 3.5 },
      { min: 9550, max: 19090, rate: 4.4 },
      { min: 19090, max: 210210, rate: 5.3 },
      { min: 210210, max: INFINITY, rate: 7.65 },
    ],
    [HEAD_OF_HOUSEHOLD]: [
      { min: 0, max: 14320, rate: 3.5 },
      { min: 14320, max: 28640, rate: 4.4 },
      { min: 28640, max: 315310, rate: 5.3 },
      { min: 315310, max: INFINITY, rate: 7.65 },
    ],
  },
} as TaxData;
