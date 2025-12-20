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
      { min: 0, max: 20000, rate: 1.4 },
      { min: 20000, max: 35000, rate: 1.75 },
      { min: 35000, max: 40000, rate: 3.5 },
      { min: 40000, max: 75000, rate: 5.53 },
      { min: 75000, max: 500000, rate: 6.37 },
      { min: 500000, max: 1000000, rate: 8.97 },
      { min: 1000000, max: INFINITY, rate: 10.75 },
    ],
    [MARRIED]: [
      { min: 0, max: 20000, rate: 1.4 },
      { min: 20000, max: 50000, rate: 1.75 },
      { min: 50000, max: 70000, rate: 2.45 },
      { min: 70000, max: 80000, rate: 3.5 },
      { min: 80000, max: 150000, rate: 5.53 },
      { min: 150000, max: 500000, rate: 6.37 },
      { min: 500000, max: 1000000, rate: 8.97 },
      { min: 1000000, max: INFINITY, rate: 10.75 },
    ],
    [MARRIED_SEPARATELY]: [
      { min: 0, max: 20000, rate: 1.4 },
      { min: 20000, max: 35000, rate: 1.75 },
      { min: 35000, max: 40000, rate: 3.5 },
      { min: 40000, max: 75000, rate: 5.53 },
      { min: 75000, max: 500000, rate: 6.37 },
      { min: 500000, max: 1000000, rate: 8.97 },
      { min: 1000000, max: INFINITY, rate: 10.75 },
    ],
    [HEAD_OF_HOUSEHOLD]: [
      { min: 0, max: 20000, rate: 1.4 },
      { min: 20000, max: 50000, rate: 1.75 },
      { min: 50000, max: 70000, rate: 2.45 },
      { min: 70000, max: 80000, rate: 3.5 },
      { min: 80000, max: 150000, rate: 5.53 },
      { min: 150000, max: 500000, rate: 6.37 },
      { min: 500000, max: 1000000, rate: 8.97 },
      { min: 1000000, max: INFINITY, rate: 10.75 },
    ],
  },
} as TaxData;
