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
    [SINGLE]: 15300,
    [MARRIED]: 30600,
    [MARRIED_SEPARATELY]: 15300,
    [HEAD_OF_HOUSEHOLD]: 23000,
  },
  [STATE_INCOME]: {
    [SINGLE]: [
      { min: 0, max: 33310, rate: 5.35 },
      { min: 33310, max: 109430, rate: 6.8 },
      { min: 109430, max: 203150, rate: 7.85 },
      { min: 203150, max: INFINITY, rate: 9.85 },
    ],
    [MARRIED]: [
      { min: 0, max: 48700, rate: 5.35 },
      { min: 48700, max: 193480, rate: 6.8 },
      { min: 193480, max: 337930, rate: 7.85 },
      { min: 337930, max: INFINITY, rate: 9.85 },
    ],
    [MARRIED_SEPARATELY]: [
      { min: 0, max: 24350, rate: 5.35 },
      { min: 24350, max: 96740, rate: 6.8 },
      { min: 96740, max: 168965, rate: 7.85 },
      { min: 168965, max: INFINITY, rate: 9.85 },
    ],
    [HEAD_OF_HOUSEHOLD]: [
      { min: 0, max: 41010, rate: 5.35 },
      { min: 41010, max: 164800, rate: 6.8 },
      { min: 164800, max: 270060, rate: 7.85 },
      { min: 270060, max: INFINITY, rate: 9.85 },
    ],
  },
} as TaxData;
