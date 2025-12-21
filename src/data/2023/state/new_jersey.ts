import { INFINITY } from "@/constants";
import { NEWARK, CITIES } from "@/constants/cities";
import {
  HEAD_OF_HOUSEHOLD,
  MARRIED,
  MARRIED_SEPARATELY,
  SINGLE,
} from "@/constants/filing-status";
import {
  STATE_INCOME,
  NJ_DISABILITY_INSURANCE,
  NJ_FAMILY_LEAVE_INSURANCE,
  NJ_UNEMPLOYMENT_INSURANCE,
  NJ_WORKFORCE_DEVELOPMENT,
  CITY_INCOME,
} from "@/constants/tax_types";
import type { TaxData } from "@/types";

export default {
  [STATE_INCOME]: {
    [SINGLE]: [
      { min: 0, max: 20000, rate: 1.4 },
      { min: 20000, max: 35000, rate: 1.75 },
      { min: 35000, max: 40000, rate: 3.5 },
      { min: 40000, max: 75000, rate: 5.525 },
      { min: 75000, max: 500000, rate: 6.37 },
      { min: 500000, max: 1000000, rate: 8.97 },
      { min: 1000000, max: INFINITY, rate: 10.75 },
    ],
    [MARRIED]: [
      { min: 0, max: 20000, rate: 1.4 },
      { min: 20000, max: 50000, rate: 1.75 },
      { min: 50000, max: 70000, rate: 2.45 },
      { min: 70000, max: 80000, rate: 3.5 },
      { min: 80000, max: 150000, rate: 5.525 },
      { min: 150000, max: 500000, rate: 6.37 },
      { min: 500000, max: 1000000, rate: 8.97 },
      { min: 1000000, max: INFINITY, rate: 10.75 },
    ],
    [MARRIED_SEPARATELY]: [
      { min: 0, max: 20000, rate: 1.4 },
      { min: 20000, max: 35000, rate: 1.75 },
      { min: 35000, max: 40000, rate: 3.5 },
      { min: 40000, max: 75000, rate: 5.525 },
      { min: 75000, max: 500000, rate: 6.37 },
      { min: 500000, max: 1000000, rate: 8.97 },
      { min: 1000000, max: INFINITY, rate: 10.75 },
    ],
    [HEAD_OF_HOUSEHOLD]: [
      { min: 0, max: 20000, rate: 1.4 },
      { min: 20000, max: 50000, rate: 1.75 },
      { min: 50000, max: 70000, rate: 2.45 },
      { min: 70000, max: 80000, rate: 3.5 },
      { min: 80000, max: 150000, rate: 5.525 },
      { min: 150000, max: 500000, rate: 6.37 },
      { min: 500000, max: 1000000, rate: 8.97 },
      { min: 1000000, max: INFINITY, rate: 10.75 },
    ],
  },
  [NJ_UNEMPLOYMENT_INSURANCE]: {
    [SINGLE]: [{ min: 0, max: 41100, rate: 0.425 }],
    [MARRIED]: [{ min: 0, max: 41100, rate: 0.425 }],
    [MARRIED_SEPARATELY]: [{ min: 0, max: 41100, rate: 0.425 }],
    [HEAD_OF_HOUSEHOLD]: [{ min: 0, max: 41100, rate: 0.425 }],
  },
  [NJ_WORKFORCE_DEVELOPMENT]: {
    [SINGLE]: [{ min: 0, max: 41100, rate: 0.0425 }],
    [MARRIED]: [{ min: 0, max: 41100, rate: 0.0425 }],
    [MARRIED_SEPARATELY]: [{ min: 0, max: 41100, rate: 0.0425 }],
    [HEAD_OF_HOUSEHOLD]: [{ min: 0, max: 41100, rate: 0.0425 }],
  },
  [NJ_DISABILITY_INSURANCE]: {
    [SINGLE]: [{ min: 0, max: INFINITY, rate: 0 }],
    [MARRIED]: [{ min: 0, max: INFINITY, rate: 0 }],
    [MARRIED_SEPARATELY]: [{ min: 0, max: INFINITY, rate: 0 }],
    [HEAD_OF_HOUSEHOLD]: [{ min: 0, max: INFINITY, rate: 0 }],
  },
  [NJ_FAMILY_LEAVE_INSURANCE]: {
    [SINGLE]: [{ min: 0, max: 156800, rate: 0.06 }],
    [MARRIED]: [{ min: 0, max: 156800, rate: 0.06 }],
    [MARRIED_SEPARATELY]: [{ min: 0, max: 156800, rate: 0.06 }],
    [HEAD_OF_HOUSEHOLD]: [{ min: 0, max: 156800, rate: 0.06 }],
  },
  [CITIES]: {
    [NEWARK]: {
      [CITY_INCOME]: {
        [SINGLE]: [{ min: 0, max: INFINITY, rate: 1 }],
        [MARRIED]: [{ min: 0, max: INFINITY, rate: 1 }],
        [MARRIED_SEPARATELY]: [{ min: 0, max: INFINITY, rate: 1 }],
        [HEAD_OF_HOUSEHOLD]: [{ min: 0, max: INFINITY, rate: 1 }],
      },
    },
  },
} as TaxData;
