import { INFINITY } from "@/constants";
import {
  CHARLESTON,
  CITIES,
  HUNTINGTON,
  MORGANTOWN,
  PARKERSBURG,
  WEIRTON,
  WHEELING,
} from "@/constants/cities";
import {
  ALL,
  HEAD_OF_HOUSEHOLD,
  MARRIED,
  MARRIED_SEPARATELY,
  SINGLE,
} from "@/constants/filing-status";
import {
  OCCUPATIONAL_PRIVILEGE_TAX,
  STATE_INCOME,
} from "@/constants/tax_types";
import type { TaxData } from "@/types";

export default {
  [STATE_INCOME]: {
    [SINGLE]: [
      { min: 0, max: 10000, rate: 2.11 },
      { min: 10000, max: 25000, rate: 2.81 },
      { min: 25000, max: 40000, rate: 3.16 },
      { min: 40000, max: 60000, rate: 4.22 },
      { min: 60000, max: INFINITY, rate: 4.58 },
    ],
    [MARRIED]: [
      { min: 0, max: 10000, rate: 2.11 },
      { min: 10000, max: 25000, rate: 2.81 },
      { min: 25000, max: 40000, rate: 3.16 },
      { min: 40000, max: 60000, rate: 4.22 },
      { min: 60000, max: INFINITY, rate: 4.58 },
    ],
    [MARRIED_SEPARATELY]: [
      { min: 0, max: 5000, rate: 2.11 },
      { min: 5000, max: 12500, rate: 2.81 },
      { min: 12500, max: 20000, rate: 3.16 },
      { min: 20000, max: 30000, rate: 4.22 },
      { min: 30000, max: INFINITY, rate: 4.58 },
    ],
    [HEAD_OF_HOUSEHOLD]: [
      { min: 0, max: 10000, rate: 2.11 },
      { min: 10000, max: 25000, rate: 2.81 },
      { min: 25000, max: 40000, rate: 3.16 },
      { min: 40000, max: 60000, rate: 4.22 },
      { min: 60000, max: INFINITY, rate: 4.58 },
    ],
  },
  [CITIES]: {
    [CHARLESTON]: {
      [OCCUPATIONAL_PRIVILEGE_TAX]: {
        [ALL]: [
          {
            amount: 3,
            frequency: "weekly",
          },
        ],
      },
    },
    [HUNTINGTON]: {
      [OCCUPATIONAL_PRIVILEGE_TAX]: {
        [ALL]: [
          {
            amount: 5,
            frequency: "weekly",
          },
        ],
      },
    },
    [PARKERSBURG]: {
      [OCCUPATIONAL_PRIVILEGE_TAX]: {
        [ALL]: [
          {
            amount: 2.5,
            frequency: "weekly",
          },
        ],
      },
    },
    [WHEELING]: {
      [OCCUPATIONAL_PRIVILEGE_TAX]: {
        [ALL]: [
          {
            amount: 2,
            frequency: "weekly",
          },
        ],
      },
    },
    [MORGANTOWN]: {
      [OCCUPATIONAL_PRIVILEGE_TAX]: {
        [ALL]: [
          {
            amount: 3,
            frequency: "weekly",
          },
        ],
      },
    },
    [WEIRTON]: {
      [OCCUPATIONAL_PRIVILEGE_TAX]: {
        [ALL]: [
          {
            amount: 2,
            frequency: "weekly",
          },
        ],
      },
    },
  },
} as TaxData;
