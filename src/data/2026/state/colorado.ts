import { CITIES, INFINITY } from "@/constants";
import {
  DENVER,
  GLENDALE,
  GREENWOOD_VILLAGE,
  SHERIDAN,
} from "@/constants/cities";
import { ALL } from "@/constants/filing-status";
import {
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
