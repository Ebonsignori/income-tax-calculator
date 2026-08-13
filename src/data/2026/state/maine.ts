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
    [SINGLE]: 15300,
    [MARRIED]: 30600,
    [MARRIED_SEPARATELY]: 15300,
    [HEAD_OF_HOUSEHOLD]: 22950,
  },
  [STATE_INCOME]: {
    [SINGLE]: [
      { min: 0, max: 27400, rate: 5.8 },
      { min: 27400, max: 64850, rate: 6.75 },
      { min: 64850, max: INFINITY, rate: 7.15 },
    ],
    [MARRIED]: [
      { min: 0, max: 54850, rate: 5.8 },
      { min: 54850, max: 129750, rate: 6.75 },
      { min: 129750, max: INFINITY, rate: 7.15 },
    ],
    [MARRIED_SEPARATELY]: [
      { min: 0, max: 27400, rate: 5.8 },
      { min: 27400, max: 64850, rate: 6.75 },
      { min: 64850, max: INFINITY, rate: 7.15 },
    ],
    [HEAD_OF_HOUSEHOLD]: [
      { min: 0, max: 41100, rate: 5.8 },
      { min: 41100, max: 97300, rate: 6.75 },
      { min: 97300, max: INFINITY, rate: 7.15 },
    ],
  },
} as TaxData;
