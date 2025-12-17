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
    [SINGLE]: 5706,
    [MARRIED]: 11412,
    [MARRIED_SEPARATELY]: 5706,
    [HEAD_OF_HOUSEHOLD]: 11412,
  },
  [STATE_INCOME]: {
    [SINGLE]: [
      { min: 0, max: 11079, rate: 1 },
      { min: 11079, max: 26264, rate: 2 },
      { min: 26264, max: 41452, rate: 4 },
      { min: 41452, max: 57542, rate: 6 },
      { min: 57542, max: 72724, rate: 8 },
      { min: 72724, max: 371479, rate: 9.3 },
      { min: 371479, max: 445771, rate: 10.3 },
      { min: 445771, max: 742953, rate: 11.3 },
      { min: 742953, max: INFINITY, rate: 12.3 },
    ],
    [MARRIED]: [
      { min: 0, max: 22158, rate: 1 },
      { min: 22158, max: 52528, rate: 2 },
      { min: 52528, max: 82904, rate: 4 },
      { min: 82904, max: 115084, rate: 6 },
      { min: 115084, max: 145448, rate: 8 },
      { min: 145448, max: 742958, rate: 9.3 },
      { min: 742958, max: 891542, rate: 10.3 },
      { min: 891542, max: 1485906, rate: 11.3 },
      { min: 1485906, max: INFINITY, rate: 12.3 },
    ],
    [MARRIED_SEPARATELY]: [
      { min: 0, max: 11079, rate: 1 },
      { min: 11079, max: 26264, rate: 2 },
      { min: 26264, max: 41452, rate: 4 },
      { min: 41452, max: 57542, rate: 6 },
      { min: 57542, max: 72724, rate: 8 },
      { min: 72724, max: 371479, rate: 9.3 },
      { min: 371479, max: 445771, rate: 10.3 },
      { min: 445771, max: 742953, rate: 11.3 },
      { min: 742953, max: INFINITY, rate: 12.3 },
    ],
    [HEAD_OF_HOUSEHOLD]: [
      { min: 0, max: 22173, rate: 1 },
      { min: 22173, max: 52530, rate: 2 },
      { min: 52530, max: 67716, rate: 4 },
      { min: 67716, max: 83805, rate: 6 },
      { min: 83805, max: 98990, rate: 8 },
      { min: 98990, max: 505208, rate: 9.3 },
      { min: 505208, max: 606251, rate: 10.3 },
      { min: 606251, max: 1010417, rate: 11.3 },
      { min: 1010417, max: INFINITY, rate: 12.3 },
    ],
  },
} as TaxData;
