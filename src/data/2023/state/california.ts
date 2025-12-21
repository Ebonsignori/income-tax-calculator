import { INFINITY } from "@/constants";
import {
  HEAD_OF_HOUSEHOLD,
  MARRIED,
  MARRIED_SEPARATELY,
  SINGLE,
} from "@/constants/filing-status";
import {
  CALIFORNIA_SDI,
  STANDARD_DEDUCTION,
  STATE_INCOME,
} from "@/constants/tax_types";
import type { TaxData } from "@/types";

export default {
  [STANDARD_DEDUCTION]: {
    [SINGLE]: 5363,
    [MARRIED]: 10726,
    [MARRIED_SEPARATELY]: 5363,
    [HEAD_OF_HOUSEHOLD]: 10726,
  },
  [STATE_INCOME]: {
    [SINGLE]: [
      { min: 0, max: 10412, rate: 1 },
      { min: 10412, max: 24684, rate: 2 },
      { min: 24684, max: 38959, rate: 4 },
      { min: 38959, max: 54081, rate: 6 },
      { min: 54081, max: 68350, rate: 8 },
      { min: 68350, max: 349137, rate: 9.3 },
      { min: 349137, max: 418961, rate: 10.3 },
      { min: 418961, max: 698271, rate: 11.3 },
      { min: 698271, max: 1000000, rate: 12.3 },
      { min: 1000000, max: INFINITY, rate: 13.3 },
    ],
    [MARRIED]: [
      { min: 0, max: 20824, rate: 1 },
      { min: 20824, max: 49368, rate: 2 },
      { min: 49368, max: 77918, rate: 4 },
      { min: 77918, max: 108162, rate: 6 },
      { min: 108162, max: 136700, rate: 8 },
      { min: 136700, max: 698274, rate: 9.3 },
      { min: 698274, max: 837922, rate: 10.3 },
      { min: 837922, max: 1396542, rate: 11.3 },
      { min: 1396542, max: 2000000, rate: 12.3 },
      { min: 2000000, max: INFINITY, rate: 13.3 },
    ],
    [MARRIED_SEPARATELY]: [
      { min: 0, max: 10412, rate: 1 },
      { min: 10412, max: 24684, rate: 2 },
      { min: 24684, max: 38959, rate: 4 },
      { min: 38959, max: 54081, rate: 6 },
      { min: 54081, max: 68350, rate: 8 },
      { min: 68350, max: 349137, rate: 9.3 },
      { min: 349137, max: 418961, rate: 10.3 },
      { min: 418961, max: 698271, rate: 11.3 },
      { min: 698271, max: 1000000, rate: 12.3 },
      { min: 1000000, max: INFINITY, rate: 13.3 },
    ],
    [HEAD_OF_HOUSEHOLD]: [
      { min: 0, max: 20839, rate: 1 },
      { min: 20839, max: 49371, rate: 2 },
      { min: 49371, max: 63644, rate: 4 },
      { min: 63644, max: 78765, rate: 6 },
      { min: 78765, max: 93037, rate: 8 },
      { min: 93037, max: 474824, rate: 9.3 },
      { min: 474824, max: 569790, rate: 10.3 },
      { min: 569790, max: 949649, rate: 11.3 },
      { min: 949649, max: 1000000, rate: 12.3 },
      { min: 1000000, max: INFINITY, rate: 13.3 },
    ],
  },
  [CALIFORNIA_SDI]: {
    [SINGLE]: [{ min: 0, max: 153164, rate: 0.9 }],
    [MARRIED]: [{ min: 0, max: 153164, rate: 0.9 }],
    [MARRIED_SEPARATELY]: [{ min: 0, max: 153164, rate: 0.9 }],
    [HEAD_OF_HOUSEHOLD]: [{ min: 0, max: 153164, rate: 0.9 }],
  },
} as TaxData;
