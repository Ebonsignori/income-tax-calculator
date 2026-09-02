import { INFINITY } from "@/constants";
import {
  ATTALLA,
  AUBURN,
  BEAR_CREEK,
  BESSEMER,
  BIRMINGHAM,
  BRILLIANT,
  CITIES,
  FAIRFIELD,
  GADSDEN,
  GLENCOE,
  GOODWATER,
  GUIN,
  HACKLEBURG,
  HALEYVILLE,
  HAMILTON,
  IRONDALE,
  LEEDS,
  LYNN,
  MACON_COUNTY,
  MIDFIELD,
  MOSSES,
  OPELIKA,
  RAINBOW_CITY,
  RED_BAY,
  SHORTER,
  SOUTHSIDE,
  SULLIGENT,
  TUSKEGEE,
} from "@/constants/cities";
import {
  ALL,
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
    [ATTALLA]: {
      [OCCUPATIONAL_TAX]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 2 }],
      },
    },
    [AUBURN]: {
      [OCCUPATIONAL_TAX]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 1 }],
      },
    },
    [BEAR_CREEK]: {
      [OCCUPATIONAL_TAX]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 1 }],
      },
    },
    [BESSEMER]: {
      [OCCUPATIONAL_TAX]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 1 }],
      },
    },
    [BIRMINGHAM]: {
      [OCCUPATIONAL_TAX]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 1 }],
      },
    },
    [BRILLIANT]: {
      [OCCUPATIONAL_TAX]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 1 }],
      },
    },
    [FAIRFIELD]: {
      [OCCUPATIONAL_TAX]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 1 }],
      },
    },
    [GADSDEN]: {
      [OCCUPATIONAL_TAX]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 2 }],
      },
    },
    [GLENCOE]: {
      [OCCUPATIONAL_TAX]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 2 }],
      },
    },
    [GOODWATER]: {
      [OCCUPATIONAL_TAX]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 0.75 }],
      },
    },
    [GUIN]: {
      [OCCUPATIONAL_TAX]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 1 }],
      },
    },
    [HACKLEBURG]: {
      [OCCUPATIONAL_TAX]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 1 }],
      },
    },
    [HALEYVILLE]: {
      [OCCUPATIONAL_TAX]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 1 }],
      },
    },
    [HAMILTON]: {
      [OCCUPATIONAL_TAX]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 1 }],
      },
    },
    [IRONDALE]: {
      // Ordinance 2022-14 cut the fee from 1% to 0.75% on 2022-07-19.
      [OCCUPATIONAL_TAX]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 0.75 }],
      },
    },
    [LEEDS]: {
      [OCCUPATIONAL_TAX]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 1 }],
      },
    },
    [LYNN]: {
      [OCCUPATIONAL_TAX]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 1 }],
      },
    },
    [MACON_COUNTY]: {
      [OCCUPATIONAL_TAX]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 1 }],
      },
    },
    [MIDFIELD]: {
      [OCCUPATIONAL_TAX]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 1 }],
      },
    },
    [MOSSES]: {
      [OCCUPATIONAL_TAX]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 1 }],
      },
    },
    // Opelika's rate through 2025-03-31; cut to 1% effective 2025-04-01
    [OPELIKA]: {
      [OCCUPATIONAL_TAX]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 1.5 }],
      },
    },
    [RAINBOW_CITY]: {
      [OCCUPATIONAL_TAX]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 2 }],
      },
    },
    [RED_BAY]: {
      [OCCUPATIONAL_TAX]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 0.5 }],
      },
    },
    [SHORTER]: {
      [OCCUPATIONAL_TAX]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 1 }],
      },
    },
    [SOUTHSIDE]: {
      [OCCUPATIONAL_TAX]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 2 }],
      },
    },
    [SULLIGENT]: {
      [OCCUPATIONAL_TAX]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 1 }],
      },
    },
    [TUSKEGEE]: {
      [OCCUPATIONAL_TAX]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 2 }],
      },
    },
  },
} as TaxData;
