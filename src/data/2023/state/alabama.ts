import { INFINITY } from "@/constants";
import {
  BESSEMER,
  BIRMINGHAM,
  CITIES,
  GADSDEN,
  MACON_COUNTY,
  MOBILE,
  MONTGOMERY,
} from "@/constants/cities";
import {
  HEAD_OF_HOUSEHOLD,
  MARRIED,
  MARRIED_SEPARATELY,
  SINGLE,
} from "@/constants/filing-status";
import {
  OCCUPATIONAL_TAX,
  STANDARD_DEDUCTION,
  STATE_INCOME,
} from "@/constants/tax_types";
import type { TaxData } from "@/types";

export default {
  [STANDARD_DEDUCTION]: {
    [SINGLE]: 2500,
    [MARRIED]: 7500,
    [MARRIED_SEPARATELY]: 3750,
    [HEAD_OF_HOUSEHOLD]: 4700,
  },
  [STATE_INCOME]: {
    [SINGLE]: [
      { min: 0, max: 500, rate: 2 },
      { min: 500, max: 3000, rate: 4 },
      { min: 3000, max: INFINITY, rate: 5 },
    ],
    [MARRIED]: [
      { min: 0, max: 1000, rate: 2 },
      { min: 1000, max: 6000, rate: 4 },
      { min: 6000, max: INFINITY, rate: 5 },
    ],
    [MARRIED_SEPARATELY]: [
      { min: 0, max: 500, rate: 2 },
      { min: 500, max: 3000, rate: 4 },
      { min: 3000, max: INFINITY, rate: 5 },
    ],
    [HEAD_OF_HOUSEHOLD]: [
      { min: 0, max: 500, rate: 2 },
      { min: 500, max: 3000, rate: 4 },
      { min: 3000, max: INFINITY, rate: 5 },
    ],
  },
  [CITIES]: {
    [BIRMINGHAM]: {
      [OCCUPATIONAL_TAX]: {
        [SINGLE]: [{ min: 0, max: INFINITY, rate: 1 }],
        [MARRIED]: [{ min: 0, max: INFINITY, rate: 1 }],
        [MARRIED_SEPARATELY]: [{ min: 0, max: INFINITY, rate: 1 }],
        [HEAD_OF_HOUSEHOLD]: [{ min: 0, max: INFINITY, rate: 1 }],
      },
    },
    [BESSEMER]: {
      [OCCUPATIONAL_TAX]: {
        [SINGLE]: [{ min: 0, max: INFINITY, rate: 1 }],
        [MARRIED]: [{ min: 0, max: INFINITY, rate: 1 }],
        [MARRIED_SEPARATELY]: [{ min: 0, max: INFINITY, rate: 1 }],
        [HEAD_OF_HOUSEHOLD]: [{ min: 0, max: INFINITY, rate: 1 }],
      },
    },
    [GADSDEN]: {
      [OCCUPATIONAL_TAX]: {
        [SINGLE]: [{ min: 0, max: INFINITY, rate: 2 }],
        [MARRIED]: [{ min: 0, max: INFINITY, rate: 2 }],
        [MARRIED_SEPARATELY]: [{ min: 0, max: INFINITY, rate: 2 }],
        [HEAD_OF_HOUSEHOLD]: [{ min: 0, max: INFINITY, rate: 2 }],
      },
    },
    [MACON_COUNTY]: {
      [OCCUPATIONAL_TAX]: {
        [SINGLE]: [{ min: 0, max: INFINITY, rate: 2 }],
        [MARRIED]: [{ min: 0, max: INFINITY, rate: 2 }],
        [MARRIED_SEPARATELY]: [{ min: 0, max: INFINITY, rate: 2 }],
        [HEAD_OF_HOUSEHOLD]: [{ min: 0, max: INFINITY, rate: 2 }],
      },
    },
    [MONTGOMERY]: {
      [OCCUPATIONAL_TAX]: {
        [SINGLE]: [{ min: 0, max: INFINITY, rate: 1 }],
        [MARRIED]: [{ min: 0, max: INFINITY, rate: 1 }],
        [MARRIED_SEPARATELY]: [{ min: 0, max: INFINITY, rate: 1 }],
        [HEAD_OF_HOUSEHOLD]: [{ min: 0, max: INFINITY, rate: 1 }],
      },
    },
    [MOBILE]: {
      [OCCUPATIONAL_TAX]: {
        [SINGLE]: [{ min: 0, max: INFINITY, rate: 1 }],
        [MARRIED]: [{ min: 0, max: INFINITY, rate: 1 }],
        [MARRIED_SEPARATELY]: [{ min: 0, max: INFINITY, rate: 1 }],
        [HEAD_OF_HOUSEHOLD]: [{ min: 0, max: INFINITY, rate: 1 }],
      },
    },
  },
} as TaxData;
