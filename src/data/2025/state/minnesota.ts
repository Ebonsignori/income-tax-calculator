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
    [SINGLE]: 14950,
    [MARRIED]: 29900,
    [MARRIED_SEPARATELY]: 14950,
    [HEAD_OF_HOUSEHOLD]: 22500,
  },
  [STATE_INCOME]: {
    [SINGLE]: [
      { min: 0, max: 32570, rate: 5.35 },
      { min: 32570, max: 106990, rate: 6.8 },
      { min: 106990, max: 198630, rate: 7.85 },
      { min: 198630, max: INFINITY, rate: 9.85 },
    ],
    [MARRIED]: [
      { min: 0, max: 47620, rate: 5.35 },
      { min: 47620, max: 189180, rate: 6.8 },
      { min: 189180, max: 330410, rate: 7.85 },
      { min: 330410, max: INFINITY, rate: 9.85 },
    ],
    [MARRIED_SEPARATELY]: [
      { min: 0, max: 23810, rate: 5.35 },
      { min: 23810, max: 94590, rate: 6.8 },
      { min: 94590, max: 165205, rate: 7.85 },
      { min: 165205, max: INFINITY, rate: 9.85 },
    ],
    [HEAD_OF_HOUSEHOLD]: [
      { min: 0, max: 40100, rate: 5.35 },
      { min: 40100, max: 161130, rate: 6.8 },
      { min: 161130, max: 264050, rate: 7.85 },
      { min: 264050, max: INFINITY, rate: 9.85 },
    ],
  },
} as TaxData;
