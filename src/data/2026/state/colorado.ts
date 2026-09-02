import { CITIES, INFINITY } from "@/constants";
import {
  DENVER,
  GLENDALE,
  GREENWOOD_VILLAGE,
  SHERIDAN,
} from "@/constants/cities";
import { ALL } from "@/constants/filing-status";
import {
  COLORADO_FAMLI,
  OCCUPATIONAL_PRIVILEGE_TAX,
  STATE_INCOME,
} from "@/constants/tax_types";
import type { TaxData } from "@/types";

export default {
  [STATE_INCOME]: {
    [ALL]: [
      {
        min: 0,
        max: INFINITY,
        rate: 4.4,
      },
    ],
  },
  // Employee half of the FAMLI premium, capped at the Social Security wage
  // base. Total premium is 0.88%, split evenly with the employer.
  [COLORADO_FAMLI]: {
    [ALL]: [
      { min: 0, max: 184500, rate: 0.44 },
      { min: 184500, max: INFINITY, rate: 0 },
    ],
  },
  // Aurora's occupational privilege tax was repealed effective 2025-01-01
  // (Ordinance 2022-77), so it is intentionally absent here.
  [CITIES]: {
    [DENVER]: {
      [OCCUPATIONAL_PRIVILEGE_TAX]: {
        [ALL]: [
          {
            amount: 5.75,
            frequency: "monthly",
            min: 6000,
          },
        ],
      },
    },
    [GLENDALE]: {
      [OCCUPATIONAL_PRIVILEGE_TAX]: {
        [ALL]: [
          {
            amount: 5,
            frequency: "monthly",
            min: 9000,
          },
        ],
      },
    },
    [GREENWOOD_VILLAGE]: {
      [OCCUPATIONAL_PRIVILEGE_TAX]: {
        [ALL]: [
          {
            amount: 2,
            frequency: "monthly",
            min: 3000,
          },
        ],
      },
    },
    [SHERIDAN]: {
      [OCCUPATIONAL_PRIVILEGE_TAX]: {
        [ALL]: [
          {
            amount: 3,
            frequency: "monthly",
          },
        ],
      },
    },
  },
} as TaxData;
