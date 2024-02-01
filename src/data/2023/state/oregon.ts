import { INFINITY } from "@/constants";
import { CITIES, PORTLAND } from "@/constants/cities";
import {
  ALL,
  HEAD_OF_HOUSEHOLD,
  MARRIED,
  MARRIED_SEPARATELY,
  SINGLE,
} from "@/constants/filing-status";
import {
  ART_TAX,
  PRESCHOOL_FOR_ALL,
  STANDARD_DEDUCTION,
  STATE_INCOME,
  SUPPORTIVE_HOUSING_SERVICES,
} from "@/constants/tax_types";
import { TaxData } from "@/types";

export default {
  [STANDARD_DEDUCTION]: {
    [SINGLE]: 2605,
    [MARRIED]: 5210,
    [MARRIED_SEPARATELY]: 2605,
    [HEAD_OF_HOUSEHOLD]: 4195,
  },
  [STATE_INCOME]: {
    [SINGLE]: [
      { min: 0, max: 4050, rate: 4.75 },
      { min: 4050, max: 10200, rate: 6.75 },
      { min: 10200, max: 125000, rate: 8.75 },
      { min: 125000, max: INFINITY, rate: 9.9 },
    ],
    [MARRIED]: [
      { min: 0, max: 8100, rate: 4.75 },
      { min: 8100, max: 20400, rate: 6.75 },
      { min: 20400, max: 250000, rate: 8.75 },
      { min: 250000, max: INFINITY, rate: 9.9 },
    ],
    [MARRIED_SEPARATELY]: [
      { min: 0, max: 4050, rate: 4.75 },
      { min: 4050, max: 10200, rate: 6.75 },
      { min: 10200, max: 125000, rate: 8.75 },
      { min: 125000, max: INFINITY, rate: 9.9 },
    ],
    [HEAD_OF_HOUSEHOLD]: [
      { min: 0, max: 8100, rate: 4.75 },
      { min: 8100, max: 20400, rate: 6.75 },
      { min: 20400, max: 250000, rate: 8.75 },
      { min: 250000, max: INFINITY, rate: 9.9 },
    ],
  },
  [CITIES]: {
    [PORTLAND]: {
      [ART_TAX]: {
        [ALL]: [{ amount: 25 }],
      },
      [SUPPORTIVE_HOUSING_SERVICES]: {
        [SINGLE]: [{ min: 125000, max: INFINITY, rate: 1 }],
        [MARRIED]: [{ min: 200000, max: INFINITY, rate: 1 }],
        [MARRIED_SEPARATELY]: [{ min: 125000, max: INFINITY, rate: 1 }],
        [HEAD_OF_HOUSEHOLD]: [{ min: 200000, max: INFINITY, rate: 1 }],
      },
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
