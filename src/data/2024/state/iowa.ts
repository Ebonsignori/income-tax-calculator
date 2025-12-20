import { INFINITY } from "@/constants";
import {
  HEAD_OF_HOUSEHOLD,
  MARRIED,
  MARRIED_SEPARATELY,
  SINGLE,
} from "@/constants/filing-status";
import { STATE_INCOME } from "@/constants/tax_types";
import type { TaxData } from "@/types";

export default {
  [STATE_INCOME]: {
    [SINGLE]: [
      { min: 0, max: 6210, rate: 4.4 },
      { min: 6210, max: 31050, rate: 4.82 },
      { min: 31050, max: INFINITY, rate: 5.7 },
    ],
    [MARRIED]: [
      { min: 0, max: 12420, rate: 4.4 },
      { min: 12420, max: 62100, rate: 4.82 },
      { min: 62100, max: INFINITY, rate: 5.7 },
    ],
    [MARRIED_SEPARATELY]: [
      { min: 0, max: 6210, rate: 4.4 },
      { min: 6210, max: 31050, rate: 4.82 },
      { min: 31050, max: INFINITY, rate: 5.7 },
    ],
    [HEAD_OF_HOUSEHOLD]: [
      { min: 0, max: 6210, rate: 4.4 },
      { min: 6210, max: 31050, rate: 4.82 },
      { min: 31050, max: INFINITY, rate: 5.7 },
    ],
  },
} as TaxData;
