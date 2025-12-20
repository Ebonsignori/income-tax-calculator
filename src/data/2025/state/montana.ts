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
      { min: 0, max: 21100, rate: 4.7 },
      { min: 21100, max: INFINITY, rate: 5.9 },
    ],
    [MARRIED]: [
      { min: 0, max: 42200, rate: 4.7 },
      { min: 42200, max: INFINITY, rate: 5.9 },
    ],
    [MARRIED_SEPARATELY]: [
      { min: 0, max: 21100, rate: 4.7 },
      { min: 21100, max: INFINITY, rate: 5.9 },
    ],
    [HEAD_OF_HOUSEHOLD]: [
      { min: 0, max: 31700, rate: 4.7 },
      { min: 31700, max: INFINITY, rate: 5.9 },
    ],
  },
} as TaxData;
