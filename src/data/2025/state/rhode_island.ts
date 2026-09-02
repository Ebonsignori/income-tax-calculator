import { INFINITY } from "@/constants";
import {
  ALL,
  HEAD_OF_HOUSEHOLD,
  MARRIED,
  MARRIED_SEPARATELY,
  SINGLE,
} from "@/constants/filing-status";
import {
  RI_TEMPORARY_DISABILITY_INSURANCE,
  STANDARD_DEDUCTION,
  STATE_INCOME,
} from "@/constants/tax_types";
import type { TaxData } from "@/types";

export default {
  // Per the 2025 RI-1040 instructions. RI phases this out above
  // $254,250 of modified federal AGI, which this model does not express.
  [STANDARD_DEDUCTION]: {
    [SINGLE]: 10900,
    [MARRIED]: 21800,
    [MARRIED_SEPARATELY]: 10900,
    [HEAD_OF_HOUSEHOLD]: 16350,
  },
  [STATE_INCOME]: {
    [SINGLE]: [
      { min: 0, max: 79900, rate: 3.75 },
      { min: 79900, max: 181650, rate: 4.75 },
      { min: 181650, max: INFINITY, rate: 5.99 },
    ],
    [MARRIED]: [
      { min: 0, max: 79900, rate: 3.75 },
      { min: 79900, max: 181650, rate: 4.75 },
      { min: 181650, max: INFINITY, rate: 5.99 },
    ],
    [MARRIED_SEPARATELY]: [
      { min: 0, max: 79900, rate: 3.75 },
      { min: 79900, max: 181650, rate: 4.75 },
      { min: 181650, max: INFINITY, rate: 5.99 },
    ],
    [HEAD_OF_HOUSEHOLD]: [
      { min: 0, max: 79900, rate: 3.75 },
      { min: 79900, max: 181650, rate: 4.75 },
      { min: 181650, max: INFINITY, rate: 5.99 },
    ],
  },
  [RI_TEMPORARY_DISABILITY_INSURANCE]: {
    [ALL]: [
      { min: 0, max: 89200, rate: 1.3 },
      { min: 89200, max: INFINITY, rate: 0 },
    ],
  },
} as TaxData;
