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
    [SINGLE]: 14600,
    [MARRIED]: 29200,
    [MARRIED_SEPARATELY]: 14600,
    [HEAD_OF_HOUSEHOLD]: 21900,
  },
  [STATE_INCOME]: {
    [SINGLE]: [
      { min: 0, max: 44725, rate: 0 },
      { min: 44725, max: 225975, rate: 1.95 },
      { min: 225975, max: INFINITY, rate: 2.5 },
    ],
    [MARRIED]: [
      { min: 0, max: 74750, rate: 0 },
      { min: 74750, max: 275100, rate: 1.95 },
      { min: 275100, max: INFINITY, rate: 2.5 },
    ],
    [MARRIED_SEPARATELY]: [
      { min: 0, max: 37375, rate: 0 },
      { min: 37375, max: 137550, rate: 1.95 },
      { min: 137550, max: INFINITY, rate: 2.5 },
    ],
    [HEAD_OF_HOUSEHOLD]: [
      { min: 0, max: 59950, rate: 0 },
      { min: 59950, max: 250550, rate: 1.95 },
      { min: 250550, max: INFINITY, rate: 2.5 },
    ],
  },
} as TaxData;
