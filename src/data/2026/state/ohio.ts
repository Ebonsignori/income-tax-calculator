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
import { ALL } from "@/constants/filing-status";
import { CITY_INCOME, STATE_INCOME } from "@/constants/tax_types";
import type { TaxData } from "@/types";

export default {
  [STATE_INCOME]: {
    [ALL]: [
      { min: 0, max: 26050, rate: 0 },
      { min: 26050, max: INFINITY, rate: 2.75 },
    ],
  },
  [CITIES]: {
    [COLUMBUS]: {
      [CITY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 2.5 }],
      },
    },
    [CLEVELAND]: {
      [CITY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 2.5 }],
      },
    },
    [CINCINNATI]: {
      [CITY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 1.8 }],
      },
    },
    [TOLEDO]: {
      [CITY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 2.25 }],
      },
    },
    [AKRON]: {
      [CITY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 2.5 }],
      },
    },
    [DAYTON]: {
      [CITY_INCOME]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 2.5 }],
      },
    },
  },
} as TaxData;
