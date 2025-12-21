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
      { min: 0, max: 12500, rate: 1.85 },
      { min: 12500, max: 50000, rate: 3.5 },
      { min: 50000, max: INFINITY, rate: 4.25 },
    ],
    [MARRIED]: [
      { min: 0, max: 25000, rate: 1.85 },
      { min: 25000, max: 100000, rate: 3.5 },
      { min: 100000, max: INFINITY, rate: 4.25 },
    ],
    [MARRIED_SEPARATELY]: [
      { min: 0, max: 12500, rate: 1.85 },
      { min: 12500, max: 50000, rate: 3.5 },
      { min: 50000, max: INFINITY, rate: 4.25 },
    ],
    [HEAD_OF_HOUSEHOLD]: [
      { min: 0, max: 12500, rate: 1.85 },
      { min: 12500, max: 50000, rate: 3.5 },
      { min: 50000, max: INFINITY, rate: 4.25 },
    ],
  },
} as TaxData;
