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
      { min: 0, max: 1053750, rate: 5 },
      { min: 1053750, max: INFINITY, rate: 9 },
    ],
    [MARRIED]: [
      { min: 0, max: 1053750, rate: 5 },
      { min: 1053750, max: INFINITY, rate: 9 },
    ],
    [MARRIED_SEPARATELY]: [
      { min: 0, max: 1053750, rate: 5 },
      { min: 1053750, max: INFINITY, rate: 9 },
    ],
    [HEAD_OF_HOUSEHOLD]: [
      { min: 0, max: 1053750, rate: 5 },
      { min: 1053750, max: INFINITY, rate: 9 },
    ],
  },
} as TaxData;
