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
    [SINGLE]: 16100,
    [MARRIED]: 32200,
    [MARRIED_SEPARATELY]: 16100,
    [HEAD_OF_HOUSEHOLD]: 24150,
  },
  [STATE_INCOME]: {
    [SINGLE]: [
      { min: 0, max: 1348, rate: 0 },
      { min: 1348, max: 2696, rate: 2 },
      { min: 2696, max: 4044, rate: 2.5 },
      { min: 4044, max: 5392, rate: 3 },
      { min: 5392, max: 6740, rate: 3.5 },
      { min: 6740, max: 8088, rate: 4 },
      { min: 8088, max: 9436, rate: 4.5 },
      { min: 9436, max: INFINITY, rate: 4.7 },
    ],
    [MARRIED]: [
      { min: 0, max: 1348, rate: 0 },
      { min: 1348, max: 2696, rate: 2 },
      { min: 2696, max: 4044, rate: 2.5 },
      { min: 4044, max: 5392, rate: 3 },
      { min: 5392, max: 6740, rate: 3.5 },
      { min: 6740, max: 8088, rate: 4 },
      { min: 8088, max: 9436, rate: 4.5 },
      { min: 9436, max: INFINITY, rate: 4.7 },
    ],
    [MARRIED_SEPARATELY]: [
      { min: 0, max: 1348, rate: 0 },
      { min: 1348, max: 2696, rate: 2 },
      { min: 2696, max: 4044, rate: 2.5 },
      { min: 4044, max: 5392, rate: 3 },
      { min: 5392, max: 6740, rate: 3.5 },
      { min: 6740, max: 8088, rate: 4 },
      { min: 8088, max: 9436, rate: 4.5 },
      { min: 9436, max: INFINITY, rate: 4.7 },
    ],
    [HEAD_OF_HOUSEHOLD]: [
      { min: 0, max: 1348, rate: 0 },
      { min: 1348, max: 2696, rate: 2 },
      { min: 2696, max: 4044, rate: 2.5 },
      { min: 4044, max: 5392, rate: 3 },
      { min: 5392, max: 6740, rate: 3.5 },
      { min: 6740, max: 8088, rate: 4 },
      { min: 8088, max: 9436, rate: 4.5 },
      { min: 9436, max: INFINITY, rate: 4.7 },
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
