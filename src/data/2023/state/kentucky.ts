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
    [SINGLE]: 2980,
    [MARRIED]: 5960,
    [MARRIED_SEPARATELY]: 2980,
    [HEAD_OF_HOUSEHOLD]: 2980,
  },
  [STATE_INCOME]: {
    [SINGLE]: [
      {
        min: 0,
        max: INFINITY,
        rate: 4.5,
      },
    ],
    [MARRIED]: [
      {
        min: 0,
        max: INFINITY,
        rate: 4.5,
      },
    ],
    [MARRIED_SEPARATELY]: [
      {
        min: 0,
        max: INFINITY,
        rate: 4.5,
      },
    ],
    [HEAD_OF_HOUSEHOLD]: [
      {
        min: 0,
        max: INFINITY,
        rate: 4.5,
      },
    ],
  },
} as TaxData;
