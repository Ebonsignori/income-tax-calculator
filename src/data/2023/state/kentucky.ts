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
    [SINGLE]: 2980,
    [MARRIED]: 2980,
    [MARRIED_SEPARATELY]: 2980,
    [HEAD_OF_HOUSEHOLD]: 2980,
  },
  [STATE_INCOME]: {
    [SINGLE]: [
      {
        min: 0,
        max: INFINITY,
        rate: 4.5,
      },
    ],
    [MARRIED]: [
      {
        min: 0,
        max: INFINITY,
        rate: 4.5,
      },
    ],
    [MARRIED_SEPARATELY]: [
      {
        min: 0,
        max: INFINITY,
        rate: 4.5,
      },
    ],
    [HEAD_OF_HOUSEHOLD]: [
      {
        min: 0,
        max: INFINITY,
        rate: 4.5,
      },
    ],
  },
  [CITIES]: {
    [LOUISVILLE]: {
      [OCCUPATIONAL_TAX]: {
        [SINGLE]: [{ min: 0, max: INFINITY, rate: 2.2 }],
        [MARRIED]: [{ min: 0, max: INFINITY, rate: 2.2 }],
        [MARRIED_SEPARATELY]: [{ min: 0, max: INFINITY, rate: 2.2 }],
        [HEAD_OF_HOUSEHOLD]: [{ min: 0, max: INFINITY, rate: 2.2 }],
      },
    },
    [LEXINGTON]: {
      [OCCUPATIONAL_TAX]: {
        [SINGLE]: [{ min: 0, max: INFINITY, rate: 2.25 }],
        [MARRIED]: [{ min: 0, max: INFINITY, rate: 2.25 }],
        [MARRIED_SEPARATELY]: [{ min: 0, max: INFINITY, rate: 2.25 }],
        [HEAD_OF_HOUSEHOLD]: [{ min: 0, max: INFINITY, rate: 2.25 }],
      },
    },
    [BOWLING_GREEN]: {
      [OCCUPATIONAL_TAX]: {
        [SINGLE]: [{ min: 0, max: INFINITY, rate: 1.85 }],
        [MARRIED]: [{ min: 0, max: INFINITY, rate: 1.85 }],
        [MARRIED_SEPARATELY]: [{ min: 0, max: INFINITY, rate: 1.85 }],
        [HEAD_OF_HOUSEHOLD]: [{ min: 0, max: INFINITY, rate: 1.85 }],
      },
    },
    [COVINGTON]: {
      [OCCUPATIONAL_TAX]: {
        [SINGLE]: [{ min: 0, max: INFINITY, rate: 2.45 }],
        [MARRIED]: [{ min: 0, max: INFINITY, rate: 2.45 }],
        [MARRIED_SEPARATELY]: [{ min: 0, max: INFINITY, rate: 2.45 }],
        [HEAD_OF_HOUSEHOLD]: [{ min: 0, max: INFINITY, rate: 2.45 }],
      },
    },
    [NEWPORT]: {
      [OCCUPATIONAL_TAX]: {
        [SINGLE]: [{ min: 0, max: INFINITY, rate: 2.5 }],
        [MARRIED]: [{ min: 0, max: INFINITY, rate: 2.5 }],
        [MARRIED_SEPARATELY]: [{ min: 0, max: INFINITY, rate: 2.5 }],
        [HEAD_OF_HOUSEHOLD]: [{ min: 0, max: INFINITY, rate: 2.5 }],
      },
    },
    [OWENSBORO]: {
      [OCCUPATIONAL_TAX]: {
        [SINGLE]: [{ min: 0, max: INFINITY, rate: 1.33 }],
        [MARRIED]: [{ min: 0, max: INFINITY, rate: 1.33 }],
        [MARRIED_SEPARATELY]: [{ min: 0, max: INFINITY, rate: 1.33 }],
        [HEAD_OF_HOUSEHOLD]: [{ min: 0, max: INFINITY, rate: 1.33 }],
      },
    },
    [PADUCAH]: {
      [OCCUPATIONAL_TAX]: {
        [SINGLE]: [{ min: 0, max: INFINITY, rate: 2.0 }],
        [MARRIED]: [{ min: 0, max: INFINITY, rate: 2.0 }],
        [MARRIED_SEPARATELY]: [{ min: 0, max: INFINITY, rate: 2.0 }],
        [HEAD_OF_HOUSEHOLD]: [{ min: 0, max: INFINITY, rate: 2.0 }],
      },
    },
    [FLORENCE]: {
      [OCCUPATIONAL_TAX]: {
        [SINGLE]: [{ min: 0, max: INFINITY, rate: 2.0 }],
        [MARRIED]: [{ min: 0, max: INFINITY, rate: 2.0 }],
        [MARRIED_SEPARATELY]: [{ min: 0, max: INFINITY, rate: 2.0 }],
        [HEAD_OF_HOUSEHOLD]: [{ min: 0, max: INFINITY, rate: 2.0 }],
      },
    },
    [HENDERSON]: {
      [OCCUPATIONAL_TAX]: {
        [SINGLE]: [{ min: 0, max: INFINITY, rate: 1.65 }],
        [MARRIED]: [{ min: 0, max: INFINITY, rate: 1.65 }],
        [MARRIED_SEPARATELY]: [{ min: 0, max: INFINITY, rate: 1.65 }],
        [HEAD_OF_HOUSEHOLD]: [{ min: 0, max: INFINITY, rate: 1.65 }],
      },
    },
    [FRANKFORT]: {
      [OCCUPATIONAL_TAX]: {
        [SINGLE]: [{ min: 0, max: INFINITY, rate: 1.75 }],
        [MARRIED]: [{ min: 0, max: INFINITY, rate: 1.75 }],
        [MARRIED_SEPARATELY]: [{ min: 0, max: INFINITY, rate: 1.75 }],
        [HEAD_OF_HOUSEHOLD]: [{ min: 0, max: INFINITY, rate: 1.75 }],
      },
    },
    [RICHMOND]: {
      [OCCUPATIONAL_TAX]: {
        [SINGLE]: [{ min: 0, max: INFINITY, rate: 2.0 }],
        [MARRIED]: [{ min: 0, max: INFINITY, rate: 2.0 }],
        [MARRIED_SEPARATELY]: [{ min: 0, max: INFINITY, rate: 2.0 }],
        [HEAD_OF_HOUSEHOLD]: [{ min: 0, max: INFINITY, rate: 2.0 }],
      },
    },
    [ELIZABETHTOWN]: {
      [OCCUPATIONAL_TAX]: {
        [SINGLE]: [{ min: 0, max: INFINITY, rate: 1.35 }],
        [MARRIED]: [{ min: 0, max: INFINITY, rate: 1.35 }],
        [MARRIED_SEPARATELY]: [{ min: 0, max: INFINITY, rate: 1.35 }],
        [HEAD_OF_HOUSEHOLD]: [{ min: 0, max: INFINITY, rate: 1.35 }],
      },
    },
  },
} as TaxData;
