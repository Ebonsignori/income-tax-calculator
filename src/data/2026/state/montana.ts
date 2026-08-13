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
      { min: 0, max: 47500, rate: 4.7 },
      { min: 47500, max: INFINITY, rate: 5.65 },
    ],
    [MARRIED]: [
      { min: 0, max: 95000, rate: 4.7 },
      { min: 95000, max: INFINITY, rate: 5.65 },
    ],
    [MARRIED_SEPARATELY]: [
      { min: 0, max: 47500, rate: 4.7 },
      { min: 47500, max: INFINITY, rate: 5.65 },
    ],
    [HEAD_OF_HOUSEHOLD]: [
      { min: 0, max: 71250, rate: 4.7 },
      { min: 71250, max: INFINITY, rate: 5.65 },
    ],
  },
} as TaxData;
