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
    [SINGLE]: 10550,
    [MARRIED]: 21150,
    [MARRIED_SEPARATELY]: 10575,
    [HEAD_OF_HOUSEHOLD]: 15850,
  },
  [STATE_INCOME]: {
    [SINGLE]: [
      { min: 0, max: 77450, rate: 3.75 },
      { min: 77450, max: 176050, rate: 4.75 },
      { min: 176050, max: INFINITY, rate: 5.99 },
    ],
    [MARRIED]: [
      { min: 0, max: 77450, rate: 3.75 },
      { min: 77450, max: 176050, rate: 4.75 },
      { min: 176050, max: INFINITY, rate: 5.99 },
    ],
    [MARRIED_SEPARATELY]: [
      { min: 0, max: 77450, rate: 3.75 },
      { min: 77450, max: 176050, rate: 4.75 },
      { min: 176050, max: INFINITY, rate: 5.99 },
    ],
    [HEAD_OF_HOUSEHOLD]: [
      { min: 0, max: 77450, rate: 3.75 },
      { min: 77450, max: 176050, rate: 4.75 },
      { min: 176050, max: INFINITY, rate: 5.99 },
    ],
  },
} as TaxData;
