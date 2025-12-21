import { INFINITY } from "@/constants";
import { NEW_YORK_CITY, YONKERS, CITIES } from "@/constants/cities";
import {
  HEAD_OF_HOUSEHOLD,
  MARRIED,
  MARRIED_SEPARATELY,
  SINGLE,
} from "@/constants/filing-status";
import {
  STANDARD_DEDUCTION,
  STATE_INCOME,
  NY_PAID_FAMILY_LEAVE,
  NY_DISABILITY_INSURANCE,
  NYC_INCOME,
  CITY_INCOME,
} from "@/constants/tax_types";
import type { TaxData } from "@/types";

export default {
  [STANDARD_DEDUCTION]: {
    [SINGLE]: 8000,
    [MARRIED]: 16050,
    [MARRIED_SEPARATELY]: 8000,
    [HEAD_OF_HOUSEHOLD]: 11200,
  },
  [STATE_INCOME]: {
    [SINGLE]: [
      { min: 0, max: 8500, rate: 4 },
      { min: 8500, max: 11700, rate: 4.5 },
      { min: 11700, max: 13900, rate: 5.25 },
      { min: 13900, max: 80650, rate: 5.5 },
      { min: 80650, max: 215400, rate: 6 },
      { min: 215400, max: 1077550, rate: 6.85 },
      { min: 1077550, max: 5000000, rate: 9.65 },
      { min: 5000000, max: 25000000, rate: 10.3 },
      { min: 25000000, max: INFINITY, rate: 10.9 },
    ],
    [MARRIED]: [
      { min: 0, max: 17150, rate: 4 },
      { min: 17150, max: 23600, rate: 4.5 },
      { min: 23600, max: 27900, rate: 5.25 },
      { min: 27900, max: 161550, rate: 5.5 },
      { min: 161550, max: 323200, rate: 6 },
      { min: 323200, max: 2155350, rate: 6.85 },
      { min: 2155350, max: 5000000, rate: 9.65 },
      { min: 5000000, max: 25000000, rate: 10.3 },
      { min: 25000000, max: INFINITY, rate: 10.9 },
    ],
    [MARRIED_SEPARATELY]: [
      { min: 0, max: 8500, rate: 4 },
      { min: 8500, max: 11700, rate: 4.5 },
      { min: 11700, max: 13900, rate: 5.25 },
      { min: 13900, max: 80650, rate: 5.5 },
      { min: 80650, max: 215400, rate: 6 },
      { min: 215400, max: 1077550, rate: 6.85 },
      { min: 1077550, max: 5000000, rate: 9.65 },
      { min: 5000000, max: 25000000, rate: 10.3 },
      { min: 25000000, max: INFINITY, rate: 10.9 },
    ],
    [HEAD_OF_HOUSEHOLD]: [
      { min: 0, max: 12800, rate: 4 },
      { min: 12800, max: 17650, rate: 4.5 },
      { min: 17650, max: 20900, rate: 5.25 },
      { min: 20900, max: 107650, rate: 5.5 },
      { min: 107650, max: 269300, rate: 6 },
      { min: 269300, max: 1616450, rate: 6.85 },
      { min: 1616450, max: 5000000, rate: 9.65 },
      { min: 5000000, max: 25000000, rate: 10.3 },
      { min: 25000000, max: INFINITY, rate: 10.9 },
    ],
  },
  [NY_DISABILITY_INSURANCE]: {
    [SINGLE]: [{ min: 0, max: INFINITY, rate: 0.5 }],
    [MARRIED]: [{ min: 0, max: INFINITY, rate: 0.5 }],
    [MARRIED_SEPARATELY]: [{ min: 0, max: INFINITY, rate: 0.5 }],
    [HEAD_OF_HOUSEHOLD]: [{ min: 0, max: INFINITY, rate: 0.5 }],
  },
  [NY_PAID_FAMILY_LEAVE]: {
    [SINGLE]: [{ min: 0, max: INFINITY, rate: 0.455 }],
    [MARRIED]: [{ min: 0, max: INFINITY, rate: 0.455 }],
    [MARRIED_SEPARATELY]: [{ min: 0, max: INFINITY, rate: 0.455 }],
    [HEAD_OF_HOUSEHOLD]: [{ min: 0, max: INFINITY, rate: 0.455 }],
  },
  [CITIES]: {
    [NEW_YORK_CITY]: {
      [NYC_INCOME]: {
        [SINGLE]: [
          { min: 0, max: 12000, rate: 3.078 },
          { min: 12000, max: 25000, rate: 3.762 },
          { min: 25000, max: 50000, rate: 3.819 },
          { min: 50000, max: INFINITY, rate: 3.876 },
        ],
        [MARRIED]: [
          { min: 0, max: 21600, rate: 3.078 },
          { min: 21600, max: 45000, rate: 3.762 },
          { min: 45000, max: 90000, rate: 3.819 },
          { min: 90000, max: INFINITY, rate: 3.876 },
        ],
        [MARRIED_SEPARATELY]: [
          { min: 0, max: 12000, rate: 3.078 },
          { min: 12000, max: 25000, rate: 3.762 },
          { min: 25000, max: 50000, rate: 3.819 },
          { min: 50000, max: INFINITY, rate: 3.876 },
        ],
        [HEAD_OF_HOUSEHOLD]: [
          { min: 0, max: 14400, rate: 3.078 },
          { min: 14400, max: 30000, rate: 3.762 },
          { min: 30000, max: 60000, rate: 3.819 },
          { min: 60000, max: INFINITY, rate: 3.876 },
        ],
      },
    },
    [YONKERS]: {
      [CITY_INCOME]: {
        [SINGLE]: [{ min: 0, max: INFINITY, rate: 0.5 }],
        [MARRIED]: [{ min: 0, max: INFINITY, rate: 0.5 }],
        [MARRIED_SEPARATELY]: [{ min: 0, max: INFINITY, rate: 0.5 }],
        [HEAD_OF_HOUSEHOLD]: [{ min: 0, max: INFINITY, rate: 0.5 }],
      },
    },
  },
} as TaxData;
