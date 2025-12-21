import { INFINITY } from "@/constants";
import {
  HEAD_OF_HOUSEHOLD,
  MARRIED,
  MARRIED_SEPARATELY,
  SINGLE,
  ALL,
} from "@/constants/filing-status";
import {
  STANDARD_DEDUCTION,
  STATE_INCOME,
  CALIFORNIA_SDI,
} from "@/constants/tax_types";
import type { TaxData } from "@/types";

export default {
  [STANDARD_DEDUCTION]: {
    [SINGLE]: 5540,
    [MARRIED]: 11080,
    [MARRIED_SEPARATELY]: 5540,
    [HEAD_OF_HOUSEHOLD]: 11080,
  },
  [STATE_INCOME]: {
    [SINGLE]: [
      { min: 0, max: 10756, rate: 1 },
      { min: 10756, max: 25499, rate: 2 },
      { min: 25499, max: 40245, rate: 4 },
      { min: 40245, max: 55866, rate: 6 },
      { min: 55866, max: 70606, rate: 8 },
      { min: 70606, max: 360659, rate: 9.3 },
      { min: 360659, max: 432787, rate: 10.3 },
      { min: 432787, max: 721314, rate: 11.3 },
      { min: 721314, max: INFINITY, rate: 12.3 },
    ],
    [MARRIED]: [
      { min: 0, max: 21512, rate: 1 },
      { min: 21512, max: 50998, rate: 2 },
      { min: 50998, max: 80490, rate: 4 },
      { min: 80490, max: 111732, rate: 6 },
      { min: 111732, max: 141212, rate: 8 },
      { min: 141212, max: 721318, rate: 9.3 },
      { min: 721318, max: 865574, rate: 10.3 },
      { min: 865574, max: 1442628, rate: 11.3 },
      { min: 1442628, max: INFINITY, rate: 12.3 },
    ],
    [MARRIED_SEPARATELY]: [
      { min: 0, max: 10756, rate: 1 },
      { min: 10756, max: 25499, rate: 2 },
      { min: 25499, max: 40245, rate: 4 },
      { min: 40245, max: 55866, rate: 6 },
      { min: 55866, max: 70606, rate: 8 },
      { min: 70606, max: 360659, rate: 9.3 },
      { min: 360659, max: 432787, rate: 10.3 },
      { min: 432787, max: 721314, rate: 11.3 },
      { min: 721314, max: INFINITY, rate: 12.3 },
    ],
    [HEAD_OF_HOUSEHOLD]: [
      { min: 0, max: 21527, rate: 1 },
      { min: 21527, max: 51000, rate: 2 },
      { min: 51000, max: 65744, rate: 4 },
      { min: 65744, max: 81364, rate: 6 },
      { min: 81364, max: 96107, rate: 8 },
      { min: 96107, max: 490493, rate: 9.3 },
      { min: 490493, max: 588593, rate: 10.3 },
      { min: 588593, max: 980987, rate: 11.3 },
      { min: 980987, max: INFINITY, rate: 12.3 },
    ],
  },
  [CALIFORNIA_SDI]: {
    [ALL]: [
      {
        min: 0,
        max: INFINITY,
        rate: 1.1,
      },
    ],
  },
} as TaxData;
