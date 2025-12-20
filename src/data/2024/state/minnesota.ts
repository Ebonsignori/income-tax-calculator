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
    [SINGLE]: 14575,
    [MARRIED]: 29150,
    [MARRIED_SEPARATELY]: 14575,
    [HEAD_OF_HOUSEHOLD]: 21900,
  },
  [STATE_INCOME]: {
    [SINGLE]: [
      { min: 0, max: 31690, rate: 5.35 },
      { min: 31690, max: 104090, rate: 6.8 },
      { min: 104090, max: 193240, rate: 7.85 },
      { min: 193240, max: INFINITY, rate: 9.85 },
    ],
    [MARRIED]: [
      { min: 0, max: 46330, rate: 5.35 },
      { min: 46330, max: 184040, rate: 6.8 },
      { min: 184040, max: 321450, rate: 7.85 },
      { min: 321450, max: INFINITY, rate: 9.85 },
    ],
    [MARRIED_SEPARATELY]: [
      { min: 0, max: 23165, rate: 5.35 },
      { min: 23165, max: 92020, rate: 6.8 },
      { min: 92020, max: 160725, rate: 7.85 },
      { min: 160725, max: INFINITY, rate: 9.85 },
    ],
    [HEAD_OF_HOUSEHOLD]: [
      { min: 0, max: 39010, rate: 5.35 },
      { min: 39010, max: 156760, rate: 6.8 },
      { min: 156760, max: 256880, rate: 7.85 },
      { min: 256880, max: INFINITY, rate: 9.85 },
    ],
  },
} as TaxData;
