import { INFINITY } from "@/constants";
import { CITIES, PORTLAND } from "@/constants/cities";
import {
  HEAD_OF_HOUSEHOLD,
  MARRIED,
  MARRIED_SEPARATELY,
  SINGLE,
} from "@/constants/filing-status";
import {
  STATE_INCOME,
  PRESCHOOL_FOR_ALL,
  STANDARD_DEDUCTION,
} from "@/constants/tax_types";
import { TaxData } from "@/types";

export default {
  [STANDARD_DEDUCTION]: {
    // TODO
    [SINGLE]: 0,
    [MARRIED]: 0,
    [MARRIED_SEPARATELY]: 0,
    [HEAD_OF_HOUSEHOLD]: 0,
  },
  [CITIES]: {
    [PORTLAND]: {
      [PRESCHOOL_FOR_ALL]: {
        [SINGLE]: [
          { min: 125000, max: 250000, rate: 1.5 },
          { min: 250000, max: INFINITY, rate: 3.0 },
        ],
        [MARRIED_SEPARATELY]: [
          { min: 125000, max: 250000, rate: 1.5 },
          { min: 250000, max: INFINITY, rate: 3.0 },
        ],
        [MARRIED]: [
          { min: 250000, max: 400000, rate: 1.5 },
          { min: 400000, max: INFINITY, rate: 3.0 },
        ],
        [HEAD_OF_HOUSEHOLD]: [
          { min: 125000, max: 250000, rate: 1.5 },
          { min: 250000, max: INFINITY, rate: 3.0 },
        ],
      },
    },
  },
} as TaxData;
