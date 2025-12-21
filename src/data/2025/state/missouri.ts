import { INFINITY } from "@/constants";
import { CITIES, KANSAS_CITY, ST_LOUIS } from "@/constants/cities";
import {
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
    [SINGLE]: 15750,
    [MARRIED]: 31500,
    [MARRIED_SEPARATELY]: 15750,
    [HEAD_OF_HOUSEHOLD]: 23625,
  },
  [STATE_INCOME]: {
    [SINGLE]: [
      { min: 0, max: 1313, rate: 0 },
      { min: 1313, max: 2626, rate: 2 },
      { min: 2626, max: 3939, rate: 2.5 },
      { min: 3939, max: 5252, rate: 3 },
      { min: 5252, max: 6565, rate: 3.5 },
      { min: 6565, max: 7878, rate: 4 },
      { min: 7878, max: 9191, rate: 4.5 },
      { min: 9191, max: INFINITY, rate: 4.7 },
    ],
    [MARRIED]: [
      { min: 0, max: 1313, rate: 0 },
      { min: 1313, max: 2626, rate: 2 },
      { min: 2626, max: 3939, rate: 2.5 },
      { min: 3939, max: 5252, rate: 3 },
      { min: 5252, max: 6565, rate: 3.5 },
      { min: 6565, max: 7878, rate: 4 },
      { min: 7878, max: 9191, rate: 4.5 },
      { min: 9191, max: INFINITY, rate: 4.7 },
    ],
    [MARRIED_SEPARATELY]: [
      { min: 0, max: 1313, rate: 0 },
      { min: 1313, max: 2626, rate: 2 },
      { min: 2626, max: 3939, rate: 2.5 },
      { min: 3939, max: 5252, rate: 3 },
      { min: 5252, max: 6565, rate: 3.5 },
      { min: 6565, max: 7878, rate: 4 },
      { min: 7878, max: 9191, rate: 4.5 },
      { min: 9191, max: INFINITY, rate: 4.7 },
    ],
    [HEAD_OF_HOUSEHOLD]: [
      { min: 0, max: 1313, rate: 0 },
      { min: 1313, max: 2626, rate: 2 },
      { min: 2626, max: 3939, rate: 2.5 },
      { min: 3939, max: 5252, rate: 3 },
      { min: 5252, max: 6565, rate: 3.5 },
      { min: 6565, max: 7878, rate: 4 },
      { min: 7878, max: 9191, rate: 4.5 },
      { min: 9191, max: INFINITY, rate: 4.7 },
    ],
  },
  [CITIES]: {
    [KANSAS_CITY]: {
      [CITY_INCOME]: {
        [SINGLE]: [{ min: 0, max: INFINITY, rate: 1 }],
        [MARRIED]: [{ min: 0, max: INFINITY, rate: 1 }],
        [MARRIED_SEPARATELY]: [{ min: 0, max: INFINITY, rate: 1 }],
        [HEAD_OF_HOUSEHOLD]: [{ min: 0, max: INFINITY, rate: 1 }],
      },
    },
    [ST_LOUIS]: {
      [CITY_INCOME]: {
        [SINGLE]: [{ min: 0, max: INFINITY, rate: 1 }],
        [MARRIED]: [{ min: 0, max: INFINITY, rate: 1 }],
        [MARRIED_SEPARATELY]: [{ min: 0, max: INFINITY, rate: 1 }],
        [HEAD_OF_HOUSEHOLD]: [{ min: 0, max: INFINITY, rate: 1 }],
      },
    },
  },
} as TaxData;
