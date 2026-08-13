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
    [SINGLE]: 8850,
    [MARRIED]: 17700,
    [MARRIED_SEPARATELY]: 8850,
    [HEAD_OF_HOUSEHOLD]: 12950,
  },
  [STATE_INCOME]: {
    [SINGLE]: [
      { min: 0, max: 4130, rate: 2.46 },
      { min: 4130, max: 24760, rate: 3.51 },
      { min: 24760, max: INFINITY, rate: 4.55 },
    ],
    [MARRIED]: [
      { min: 0, max: 8250, rate: 2.46 },
      { min: 8250, max: 49530, rate: 3.51 },
      { min: 49530, max: INFINITY, rate: 4.55 },
    ],
    [MARRIED_SEPARATELY]: [
      { min: 0, max: 4130, rate: 2.46 },
      { min: 4130, max: 24760, rate: 3.51 },
      { min: 24760, max: INFINITY, rate: 4.55 },
    ],
    [HEAD_OF_HOUSEHOLD]: [
      { min: 0, max: 7700, rate: 2.46 },
      { min: 7700, max: 39620, rate: 3.51 },
      { min: 39620, max: INFINITY, rate: 4.55 },
    ],
  },
} as TaxData;
