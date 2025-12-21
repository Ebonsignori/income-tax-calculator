import { INFINITY } from "@/constants";
import {
  AKRON,
  CINCINNATI,
  CITIES,
  CLEVELAND,
  COLUMBUS,
  DAYTON,
  TOLEDO,
} from "@/constants/cities";
import {
  HEAD_OF_HOUSEHOLD,
  MARRIED,
  MARRIED_SEPARATELY,
  SINGLE,
} from "@/constants/filing-status";
import { CITY_INCOME, STATE_INCOME } from "@/constants/tax_types";
import type { TaxData } from "@/types";

export default {
  [STATE_INCOME]: {
    [SINGLE]: [
      { min: 0, max: 26050, rate: 0 },
      { min: 26050, max: 100000, rate: 2.75 },
      { min: 100000, max: INFINITY, rate: 3.5 },
    ],
    [MARRIED]: [
      { min: 0, max: 26050, rate: 0 },
      { min: 26050, max: 100000, rate: 2.75 },
      { min: 100000, max: INFINITY, rate: 3.5 },
    ],
    [MARRIED_SEPARATELY]: [
      { min: 0, max: 26050, rate: 0 },
      { min: 26050, max: 100000, rate: 2.75 },
      { min: 100000, max: INFINITY, rate: 3.5 },
    ],
    [HEAD_OF_HOUSEHOLD]: [
      { min: 0, max: 26050, rate: 0 },
      { min: 26050, max: 100000, rate: 2.75 },
      { min: 100000, max: INFINITY, rate: 3.5 },
    ],
  },
  [CITIES]: {
    [COLUMBUS]: {
      [CITY_INCOME]: {
        [SINGLE]: [{ min: 0, max: INFINITY, rate: 2.5 }],
        [MARRIED]: [{ min: 0, max: INFINITY, rate: 2.5 }],
        [MARRIED_SEPARATELY]: [{ min: 0, max: INFINITY, rate: 2.5 }],
        [HEAD_OF_HOUSEHOLD]: [{ min: 0, max: INFINITY, rate: 2.5 }],
      },
    },
    [CLEVELAND]: {
      [CITY_INCOME]: {
        [SINGLE]: [{ min: 0, max: INFINITY, rate: 2.0 }],
        [MARRIED]: [{ min: 0, max: INFINITY, rate: 2.0 }],
        [MARRIED_SEPARATELY]: [{ min: 0, max: INFINITY, rate: 2.0 }],
        [HEAD_OF_HOUSEHOLD]: [{ min: 0, max: INFINITY, rate: 2.0 }],
      },
    },
    [CINCINNATI]: {
      [CITY_INCOME]: {
        [SINGLE]: [{ min: 0, max: INFINITY, rate: 2.1 }],
        [MARRIED]: [{ min: 0, max: INFINITY, rate: 2.1 }],
        [MARRIED_SEPARATELY]: [{ min: 0, max: INFINITY, rate: 2.1 }],
        [HEAD_OF_HOUSEHOLD]: [{ min: 0, max: INFINITY, rate: 2.1 }],
      },
    },
    [TOLEDO]: {
      [CITY_INCOME]: {
        [SINGLE]: [{ min: 0, max: INFINITY, rate: 2.25 }],
        [MARRIED]: [{ min: 0, max: INFINITY, rate: 2.25 }],
        [MARRIED_SEPARATELY]: [{ min: 0, max: INFINITY, rate: 2.25 }],
        [HEAD_OF_HOUSEHOLD]: [{ min: 0, max: INFINITY, rate: 2.25 }],
      },
    },
    [AKRON]: {
      [CITY_INCOME]: {
        [SINGLE]: [{ min: 0, max: INFINITY, rate: 2.25 }],
        [MARRIED]: [{ min: 0, max: INFINITY, rate: 2.25 }],
        [MARRIED_SEPARATELY]: [{ min: 0, max: INFINITY, rate: 2.25 }],
        [HEAD_OF_HOUSEHOLD]: [{ min: 0, max: INFINITY, rate: 2.25 }],
      },
    },
    [DAYTON]: {
      [CITY_INCOME]: {
        [SINGLE]: [{ min: 0, max: INFINITY, rate: 2.25 }],
        [MARRIED]: [{ min: 0, max: INFINITY, rate: 2.25 }],
        [MARRIED_SEPARATELY]: [{ min: 0, max: INFINITY, rate: 2.25 }],
        [HEAD_OF_HOUSEHOLD]: [{ min: 0, max: INFINITY, rate: 2.25 }],
      },
    },
  },
} as TaxData;
