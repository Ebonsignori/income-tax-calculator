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
      { min: 0, max: 10000, rate: 2 },
      { min: 10000, max: 50000, rate: 4.5 },
      { min: 50000, max: 100000, rate: 5.5 },
      { min: 100000, max: 200000, rate: 6 },
      { min: 200000, max: 250000, rate: 6.5 },
      { min: 250000, max: 500000, rate: 6.9 },
      { min: 500000, max: INFINITY, rate: 6.99 },
    ],
    [MARRIED]: [
      { min: 0, max: 20000, rate: 2 },
      { min: 20000, max: 100000, rate: 4.5 },
      { min: 100000, max: 200000, rate: 5.5 },
      { min: 200000, max: 400000, rate: 6 },
      { min: 400000, max: 500000, rate: 6.5 },
      { min: 500000, max: 1000000, rate: 6.9 },
      { min: 1000000, max: INFINITY, rate: 6.99 },
    ],
    [MARRIED_SEPARATELY]: [
      { min: 0, max: 10000, rate: 2 },
      { min: 10000, max: 50000, rate: 4.5 },
      { min: 50000, max: 100000, rate: 5.5 },
      { min: 100000, max: 200000, rate: 6 },
      { min: 200000, max: 250000, rate: 6.5 },
      { min: 250000, max: 500000, rate: 6.9 },
      { min: 500000, max: INFINITY, rate: 6.99 },
    ],
    [HEAD_OF_HOUSEHOLD]: [
      { min: 0, max: 16000, rate: 2 },
      { min: 16000, max: 80000, rate: 4.5 },
      { min: 80000, max: 160000, rate: 5.5 },
      { min: 160000, max: 320000, rate: 6 },
      { min: 320000, max: 400000, rate: 6.5 },
      { min: 400000, max: 800000, rate: 6.9 },
      { min: 800000, max: INFINITY, rate: 6.99 },
    ],
  },
} as TaxData;
