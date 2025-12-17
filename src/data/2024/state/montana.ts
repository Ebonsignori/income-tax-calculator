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
      { min: 0, max: 20500, rate: 4.7 },
      { min: 20500, max: INFINITY, rate: 5.9 },
    ],
    [MARRIED]: [
      { min: 0, max: 41000, rate: 4.7 },
      { min: 41000, max: INFINITY, rate: 5.9 },
    ],
    [MARRIED_SEPARATELY]: [
      { min: 0, max: 20500, rate: 4.7 },
      { min: 20500, max: INFINITY, rate: 5.9 },
    ],
    [HEAD_OF_HOUSEHOLD]: [
      { min: 0, max: 30750, rate: 4.7 },
      { min: 30750, max: INFINITY, rate: 5.9 },
    ],
  },
} as TaxData;
