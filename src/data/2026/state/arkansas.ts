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
    [SINGLE]: 2470,
    [MARRIED]: 4940,
    [MARRIED_SEPARATELY]: 2470,
    [HEAD_OF_HOUSEHOLD]: 2470,
  },
  [STATE_INCOME]: {
    [SINGLE]: [
      { min: 0, max: 5599, rate: 0 },
      { min: 5600, max: 11199, rate: 2 },
      { min: 11200, max: 15999, rate: 3 },
      { min: 16000, max: 26399, rate: 3.4 },
      { min: 26400, max: INFINITY, rate: 3.9 },
    ],
    [MARRIED]: [
      { min: 0, max: 5599, rate: 0 },
      { min: 5600, max: 11199, rate: 2 },
      { min: 11200, max: 15999, rate: 3 },
      { min: 16000, max: 26399, rate: 3.4 },
      { min: 26400, max: INFINITY, rate: 3.9 },
    ],
    [MARRIED_SEPARATELY]: [
      { min: 0, max: 5599, rate: 0 },
      { min: 5600, max: 11199, rate: 2 },
      { min: 11200, max: 15999, rate: 3 },
      { min: 16000, max: 26399, rate: 3.4 },
      { min: 26400, max: INFINITY, rate: 3.9 },
    ],
    [HEAD_OF_HOUSEHOLD]: [
      { min: 0, max: 5599, rate: 0 },
      { min: 5600, max: 11199, rate: 2 },
      { min: 11200, max: 15999, rate: 3 },
      { min: 16000, max: 26399, rate: 3.4 },
      { min: 26400, max: INFINITY, rate: 3.9 },
    ],
  },
} as TaxData;
