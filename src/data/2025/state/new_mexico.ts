import { INFINITY } from "@/constants";
import {
  HEAD_OF_HOUSEHOLD,
  MARRIED,
  MARRIED_SEPARATELY,
  SINGLE,
} from "@/constants/filing-status";
import { STATE_INCOME, STANDARD_DEDUCTION } from "@/constants/tax_types";
import type { TaxData } from "@/types";

export default {
  [STANDARD_DEDUCTION]: {
    [SINGLE]: 15000,
    [MARRIED]: 30000,
    [MARRIED_SEPARATELY]: 15000,
    [HEAD_OF_HOUSEHOLD]: 22500,
  },
  [STATE_INCOME]: {
    [SINGLE]: [
      { min: 0, max: 5500, rate: 1.5 },
      { min: 5500, max: 16500, rate: 3.2 },
      { min: 16500, max: 33500, rate: 4.3 },
      { min: 33500, max: 66500, rate: 4.7 },
      { min: 66500, max: 210000, rate: 4.9 },
      { min: 210000, max: INFINITY, rate: 5.9 },
    ],
    [MARRIED]: [
      { min: 0, max: 8000, rate: 1.5 },
      { min: 8000, max: 25000, rate: 3.2 },
      { min: 25000, max: 50000, rate: 4.3 },
      { min: 50000, max: 100000, rate: 4.7 },
      { min: 100000, max: 315000, rate: 4.9 },
      { min: 315000, max: INFINITY, rate: 5.9 },
    ],
    [MARRIED_SEPARATELY]: [
      { min: 0, max: 4000, rate: 1.5 },
      { min: 4000, max: 12500, rate: 3.2 },
      { min: 12500, max: 25000, rate: 4.3 },
      { min: 25000, max: 50000, rate: 4.7 },
      { min: 50000, max: 157500, rate: 4.9 },
      { min: 157500, max: INFINITY, rate: 5.9 },
    ],
    [HEAD_OF_HOUSEHOLD]: [
      { min: 0, max: 8000, rate: 1.5 },
      { min: 8000, max: 25000, rate: 3.2 },
      { min: 25000, max: 50000, rate: 4.3 },
      { min: 50000, max: 100000, rate: 4.7 },
      { min: 100000, max: 315000, rate: 4.9 },
      { min: 315000, max: INFINITY, rate: 5.9 },
    ],
  },
} as TaxData;
