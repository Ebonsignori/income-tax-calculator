import { INFINITY } from "@/constants";
import { CITIES, KANSAS_CITY, ST_LOUIS } from "@/constants/cities";
import {
  ALL,
  HEAD_OF_HOUSEHOLD,
  MARRIED,
  MARRIED_SEPARATELY,
  SINGLE,
} from "@/constants/filing-status";
import {
  CITY_INCOME,
  STANDARD_DEDUCTION,
  STATE_INCOME,
} from "@/constants/tax_types";
import type { TaxData } from "@/types";

export default {
  [STANDARD_DEDUCTION]: {
    [SINGLE]: 14600,
    [MARRIED]: 29200,
    [MARRIED_SEPARATELY]: 14600,
    [HEAD_OF_HOUSEHOLD]: 21900,
  },
  [STATE_INCOME]: {
    [ALL]: [
      { min: 0, max: 1273, rate: 0 },
      { min: 1273, max: 2546, rate: 2 },
      { min: 2546, max: 3819, rate: 2.5 },
      { min: 3819, max: 5092, rate: 3 },
      { min: 5092, max: 6365, rate: 3.5 },
      { min: 6365, max: 7638, rate: 4 },
      { min: 7638, max: 8911, rate: 4.5 },
      { min: 8911, max: INFINITY, rate: 4.8 },
    ],
  },
  [CITIES]: {
    [KANSAS_CITY]: {
      [CITY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 1 }],
      },
    },
    [ST_LOUIS]: {
      [CITY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 1 }],
      },
    },
  },
} as TaxData;
