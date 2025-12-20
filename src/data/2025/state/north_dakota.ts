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
    [SINGLE]: 15000,
    [MARRIED]: 30000,
    [MARRIED_SEPARATELY]: 15000,
    [HEAD_OF_HOUSEHOLD]: 15000,
  },
  [STATE_INCOME]: {
    [SINGLE]: [
      { min: 0, max: 48475, rate: 0 },
      { min: 48475, max: 244825, rate: 1.95 },
      { min: 244825, max: INFINITY, rate: 2.5 },
    ],
    [MARRIED]: [
      { min: 0, max: 80975, rate: 0 },
      { min: 80975, max: 298075, rate: 1.95 },
      { min: 298075, max: INFINITY, rate: 2.5 },
    ],
    [MARRIED_SEPARATELY]: [
      { min: 0, max: 48475, rate: 0 },
      { min: 48475, max: 244825, rate: 1.95 },
      { min: 244825, max: INFINITY, rate: 2.5 },
    ],
    [HEAD_OF_HOUSEHOLD]: [
      { min: 0, max: 48475, rate: 0 },
      { min: 48475, max: 244825, rate: 1.95 },
      { min: 244825, max: INFINITY, rate: 2.5 },
    ],
  },
} as TaxData;
