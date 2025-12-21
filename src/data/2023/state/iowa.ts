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
      { min: 0, max: 6000, rate: 4.4 },
      { min: 6000, max: 30000, rate: 4.82 },
      { min: 30000, max: 75000, rate: 5.7 },
      { min: 75000, max: INFINITY, rate: 6 },
    ],
    [MARRIED]: [
      { min: 0, max: 12000, rate: 4.4 },
      { min: 12000, max: 60000, rate: 4.82 },
      { min: 60000, max: 150000, rate: 5.7 },
      { min: 150000, max: INFINITY, rate: 6 },
    ],
    [MARRIED_SEPARATELY]: [
      { min: 0, max: 6000, rate: 4.4 },
      { min: 6000, max: 30000, rate: 4.82 },
      { min: 30000, max: 75000, rate: 5.7 },
      { min: 75000, max: INFINITY, rate: 6 },
    ],
    [HEAD_OF_HOUSEHOLD]: [
      { min: 0, max: 6000, rate: 4.4 },
      { min: 6000, max: 30000, rate: 4.82 },
      { min: 30000, max: 75000, rate: 5.7 },
      { min: 75000, max: INFINITY, rate: 6 },
    ],
  },
} as TaxData;
