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
    [SINGLE]: 8600,
    [MARRIED]: 17200,
    [MARRIED_SEPARATELY]: 8600,
    [HEAD_OF_HOUSEHOLD]: 12600,
  },
  [STATE_INCOME]: {
    [SINGLE]: [
      { min: 0, max: 3699, rate: 2.46 },
      { min: 3699, max: 22169, rate: 3.51 },
      { min: 22169, max: 35729, rate: 5.01 },
      { min: 35729, max: INFINITY, rate: 5.2 },
    ],
    [MARRIED]: [
      { min: 0, max: 7399, rate: 2.46 },
      { min: 7399, max: 44339, rate: 3.51 },
      { min: 44339, max: 71459, rate: 5.01 },
      { min: 71459, max: INFINITY, rate: 5.2 },
    ],
    [MARRIED_SEPARATELY]: [
      { min: 0, max: 3699, rate: 2.46 },
      { min: 3699, max: 22169, rate: 3.51 },
      { min: 22169, max: 35729, rate: 5.01 },
      { min: 35729, max: INFINITY, rate: 5.2 },
    ],
    [HEAD_OF_HOUSEHOLD]: [
      { min: 0, max: 5599, rate: 2.46 },
      { min: 5599, max: 28799, rate: 3.51 },
      { min: 28799, max: 42999, rate: 5.01 },
      { min: 42999, max: INFINITY, rate: 5.2 },
    ],
  },
} as TaxData;
