import { INFINITY } from "@/constants";
import {
  HEAD_OF_HOUSEHOLD,
  MARRIED,
  MARRIED_SEPARATELY,
  SINGLE,
} from "@/constants/filing-status";
import { STANDARD_DEDUCTION, STATE_INCOME } from "@/constants/tax_types";
import type { TaxData } from "@/types";

export default {
  [STANDARD_DEDUCTION]: {
    [SINGLE]: 16100,
    [MARRIED]: 32200,
    [MARRIED_SEPARATELY]: 16100,
    [HEAD_OF_HOUSEHOLD]: 24150,
  },
  [STATE_INCOME]: {
    [SINGLE]: [
      { min: 0, max: 53225, rate: 3.35 },
      { min: 53225, max: 123525, rate: 6.6 },
      { min: 123525, max: 253525, rate: 7.6 },
      { min: 253525, max: INFINITY, rate: 8.75 },
    ],
    [MARRIED]: [
      { min: 0, max: 93975, rate: 3.35 },
      { min: 93975, max: 210925, rate: 6.6 },
      { min: 210925, max: 315475, rate: 7.6 },
      { min: 315475, max: INFINITY, rate: 8.75 },
    ],
    [MARRIED_SEPARATELY]: [
      { min: 0, max: 53225, rate: 3.35 },
      { min: 53225, max: 123525, rate: 6.6 },
      { min: 123525, max: 253525, rate: 7.6 },
      { min: 253525, max: INFINITY, rate: 8.75 },
    ],
    [HEAD_OF_HOUSEHOLD]: [
      { min: 0, max: 93975, rate: 3.35 },
      { min: 93975, max: 210925, rate: 6.6 },
      { min: 210925, max: 315475, rate: 7.6 },
      { min: 315475, max: INFINITY, rate: 8.75 },
    ],
  },
} as TaxData;
