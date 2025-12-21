import { INFINITY } from "@/constants";
import { WILMINGTON, CITIES } from "@/constants/cities";
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
    [SINGLE]: 3250,
    [MARRIED]: 6500,
    [MARRIED_SEPARATELY]: 3250,
    [HEAD_OF_HOUSEHOLD]: 3250,
  },
  [STATE_INCOME]: {
    [ALL]: [
      { min: 0, max: 2000, rate: 0 },
      { min: 2000, max: 5000, rate: 2.2 },
      { min: 5000, max: 10000, rate: 3.9 },
      { min: 10000, max: 20000, rate: 4.8 },
      { min: 20000, max: 25000, rate: 5.2 },
      { min: 25000, max: 60000, rate: 5.55 },
      { min: 60000, max: INFINITY, rate: 6.6 },
    ],
  },
  [CITIES]: {
    [WILMINGTON]: {
      [CITY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 1.25 }],
      },
    },
  },
} as TaxData;
