import { INFINITY } from "@/constants";
import {
  BOWLING_GREEN,
  CITIES,
  COVINGTON,
  ELIZABETHTOWN,
  FLORENCE,
  FRANKFORT,
  HENDERSON,
  LEXINGTON,
  LOUISVILLE,
  NEWPORT,
  OWENSBORO,
  PADUCAH,
  RICHMOND,
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
    [SINGLE]: 3160,
    [MARRIED]: 6320,
    [MARRIED_SEPARATELY]: 3160,
    [HEAD_OF_HOUSEHOLD]: 3160,
  },
  [STATE_INCOME]: {
    [SINGLE]: [{ min: 0, max: INFINITY, rate: 4 }],
    [MARRIED]: [{ min: 0, max: INFINITY, rate: 4 }],
    [MARRIED_SEPARATELY]: [{ min: 0, max: INFINITY, rate: 4 }],
    [HEAD_OF_HOUSEHOLD]: [{ min: 0, max: INFINITY, rate: 4 }],
  },
  [CITIES]: {
    [LOUISVILLE]: {
      [OCCUPATIONAL_TAX]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 2.2 }],
      },
    },
    [LEXINGTON]: {
      [OCCUPATIONAL_TAX]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 2.25 }],
      },
    },
    [BOWLING_GREEN]: {
      [OCCUPATIONAL_TAX]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 2.0 }],
      },
    },
    [COVINGTON]: {
      [OCCUPATIONAL_TAX]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 2.45 }],
      },
    },
    [NEWPORT]: {
      [OCCUPATIONAL_TAX]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 2.5 }],
      },
    },
    [OWENSBORO]: {
      [OCCUPATIONAL_TAX]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 1.0 }],
      },
    },
    [PADUCAH]: {
      [OCCUPATIONAL_TAX]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 2.0 }],
      },
    },
    [FLORENCE]: {
      [OCCUPATIONAL_TAX]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 2.0 }],
      },
    },
    [HENDERSON]: {
      [OCCUPATIONAL_TAX]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 1.65 }],
      },
    },
    [FRANKFORT]: {
      [OCCUPATIONAL_TAX]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 1.75 }],
      },
    },
    [RICHMOND]: {
      [OCCUPATIONAL_TAX]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 2.0 }],
      },
    },
    [ELIZABETHTOWN]: {
      [OCCUPATIONAL_TAX]: {
        [ALL]: [{ min: 0, max: INFINITY, rate: 1.95 }],
      },
    },
  },
} as TaxData;
