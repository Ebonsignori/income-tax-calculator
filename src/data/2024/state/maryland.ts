import { INFINITY } from "@/constants";
import {
  ALLEGANY_COUNTY,
  ANNE_ARUNDEL_COUNTY,
  BALTIMORE_CITY,
  BALTIMORE_COUNTY,
  CALVERT_COUNTY,
  CAROLINE_COUNTY,
  CARROLL_COUNTY,
  CECIL_COUNTY,
  CHARLES_COUNTY,
  CITIES,
  DORCHESTER_COUNTY,
  FREDERICK_COUNTY,
  GARRETT_COUNTY,
  HARFORD_COUNTY,
  HOWARD_COUNTY,
  KENT_COUNTY,
  MONTGOMERY_COUNTY,
  PRINCE_GEORGES_COUNTY,
  QUEEN_ANNES_COUNTY,
  SAINT_MARYS_COUNTY,
  SOMERSET_COUNTY,
  TALBOT_COUNTY,
  WASHINGTON_COUNTY,
  WICOMICO_COUNTY,
  WORCESTER_COUNTY,
} from "@/constants/cities";
import {
  HEAD_OF_HOUSEHOLD,
  MARRIED,
  MARRIED_SEPARATELY,
  SINGLE,
} from "@/constants/filing-status";
import {
  COUNTY_INCOME,
  STANDARD_DEDUCTION,
  STATE_INCOME,
} from "@/constants/tax_types";
import type { TaxData } from "@/types";

export default {
  [STANDARD_DEDUCTION]: {
    [SINGLE]: 2600,
    [MARRIED]: 5200,
    [MARRIED_SEPARATELY]: 2600,
    [HEAD_OF_HOUSEHOLD]: 5200,
  },
  [STATE_INCOME]: {
    [SINGLE]: [
      { min: 0, max: 1000, rate: 2 },
      { min: 1000, max: 2000, rate: 3 },
      { min: 2000, max: 3000, rate: 4 },
      { min: 3000, max: 100000, rate: 4.75 },
      { min: 100000, max: 125000, rate: 5 },
      { min: 125000, max: 150000, rate: 5.25 },
      { min: 150000, max: 250000, rate: 5.5 },
      { min: 250000, max: 500000, rate: 5.75 },
      { min: 500000, max: 1000000, rate: 6.25 },
      { min: 1000000, max: INFINITY, rate: 6.5 },
    ],
    [MARRIED]: [
      { min: 0, max: 1000, rate: 2 },
      { min: 1000, max: 2000, rate: 3 },
      { min: 2000, max: 3000, rate: 4 },
      { min: 3000, max: 150000, rate: 4.75 },
      { min: 150000, max: 175000, rate: 5 },
      { min: 175000, max: 225000, rate: 5.25 },
      { min: 225000, max: 300000, rate: 5.5 },
      { min: 300000, max: 600000, rate: 5.75 },
      { min: 600000, max: 1200000, rate: 6.25 },
      { min: 1200000, max: INFINITY, rate: 6.5 },
    ],
    [MARRIED_SEPARATELY]: [
      { min: 0, max: 1000, rate: 2 },
      { min: 1000, max: 2000, rate: 3 },
      { min: 2000, max: 3000, rate: 4 },
      { min: 3000, max: 100000, rate: 4.75 },
      { min: 100000, max: 125000, rate: 5 },
      { min: 125000, max: 150000, rate: 5.25 },
      { min: 150000, max: 250000, rate: 5.5 },
      { min: 250000, max: 500000, rate: 5.75 },
      { min: 500000, max: 1000000, rate: 6.25 },
      { min: 1000000, max: INFINITY, rate: 6.5 },
    ],
    [HEAD_OF_HOUSEHOLD]: [
      { min: 0, max: 1000, rate: 2 },
      { min: 1000, max: 2000, rate: 3 },
      { min: 2000, max: 3000, rate: 4 },
      { min: 3000, max: 150000, rate: 4.75 },
      { min: 150000, max: 175000, rate: 5 },
      { min: 175000, max: 225000, rate: 5.25 },
      { min: 225000, max: 300000, rate: 5.5 },
      { min: 300000, max: 600000, rate: 5.75 },
      { min: 600000, max: 1200000, rate: 6.25 },
      { min: 1200000, max: INFINITY, rate: 6.5 },
    ],
  },
  [CITIES]: {
    [ALLEGANY_COUNTY]: {
      [COUNTY_INCOME]: {
        [SINGLE]: [{ min: 0, max: INFINITY, rate: 3.05 }],
        [MARRIED]: [{ min: 0, max: INFINITY, rate: 3.05 }],
        [MARRIED_SEPARATELY]: [{ min: 0, max: INFINITY, rate: 3.05 }],
        [HEAD_OF_HOUSEHOLD]: [{ min: 0, max: INFINITY, rate: 3.05 }],
      },
    },
    [ANNE_ARUNDEL_COUNTY]: {
      [COUNTY_INCOME]: {
        [SINGLE]: [
          { min: 0, max: 50000, rate: 2.7 },
          { min: 50000, max: 400000, rate: 2.81 },
          { min: 400000, max: INFINITY, rate: 3.2 },
        ],
        [MARRIED]: [
          { min: 0, max: 75000, rate: 2.7 },
          { min: 75000, max: 480000, rate: 2.81 },
          { min: 480000, max: INFINITY, rate: 3.2 },
        ],
        [MARRIED_SEPARATELY]: [
          { min: 0, max: 50000, rate: 2.7 },
          { min: 50000, max: 400000, rate: 2.81 },
          { min: 400000, max: INFINITY, rate: 3.2 },
        ],
        [HEAD_OF_HOUSEHOLD]: [
          { min: 0, max: 75000, rate: 2.7 },
          { min: 75000, max: 480000, rate: 2.81 },
          { min: 480000, max: INFINITY, rate: 3.2 },
        ],
      },
    },
    [BALTIMORE_CITY]: {
      [COUNTY_INCOME]: {
        [SINGLE]: [{ min: 0, max: INFINITY, rate: 3.05 }],
        [MARRIED]: [{ min: 0, max: INFINITY, rate: 3.05 }],
        [MARRIED_SEPARATELY]: [{ min: 0, max: INFINITY, rate: 3.05 }],
        [HEAD_OF_HOUSEHOLD]: [{ min: 0, max: INFINITY, rate: 3.05 }],
      },
    },
    [BALTIMORE_COUNTY]: {
      [COUNTY_INCOME]: {
        [SINGLE]: [{ min: 0, max: INFINITY, rate: 2.83 }],
        [MARRIED]: [{ min: 0, max: INFINITY, rate: 2.83 }],
        [MARRIED_SEPARATELY]: [{ min: 0, max: INFINITY, rate: 2.83 }],
        [HEAD_OF_HOUSEHOLD]: [{ min: 0, max: INFINITY, rate: 2.83 }],
      },
    },
    [CALVERT_COUNTY]: {
      [COUNTY_INCOME]: {
        [SINGLE]: [{ min: 0, max: INFINITY, rate: 2.8 }],
        [MARRIED]: [{ min: 0, max: INFINITY, rate: 2.8 }],
        [MARRIED_SEPARATELY]: [{ min: 0, max: INFINITY, rate: 2.8 }],
        [HEAD_OF_HOUSEHOLD]: [{ min: 0, max: INFINITY, rate: 2.8 }],
      },
    },
    [CAROLINE_COUNTY]: {
      [COUNTY_INCOME]: {
        [SINGLE]: [{ min: 0, max: INFINITY, rate: 2.63 }],
        [MARRIED]: [{ min: 0, max: INFINITY, rate: 2.63 }],
        [MARRIED_SEPARATELY]: [{ min: 0, max: INFINITY, rate: 2.63 }],
        [HEAD_OF_HOUSEHOLD]: [{ min: 0, max: INFINITY, rate: 2.63 }],
      },
    },
    [CARROLL_COUNTY]: {
      [COUNTY_INCOME]: {
        [SINGLE]: [{ min: 0, max: INFINITY, rate: 3.05 }],
        [MARRIED]: [{ min: 0, max: INFINITY, rate: 3.05 }],
        [MARRIED_SEPARATELY]: [{ min: 0, max: INFINITY, rate: 3.05 }],
        [HEAD_OF_HOUSEHOLD]: [{ min: 0, max: INFINITY, rate: 3.05 }],
      },
    },
    [CECIL_COUNTY]: {
      [COUNTY_INCOME]: {
        [SINGLE]: [{ min: 0, max: INFINITY, rate: 2.75 }],
        [MARRIED]: [{ min: 0, max: INFINITY, rate: 2.75 }],
        [MARRIED_SEPARATELY]: [{ min: 0, max: INFINITY, rate: 2.75 }],
        [HEAD_OF_HOUSEHOLD]: [{ min: 0, max: INFINITY, rate: 2.75 }],
      },
    },
    [CHARLES_COUNTY]: {
      [COUNTY_INCOME]: {
        [SINGLE]: [{ min: 0, max: INFINITY, rate: 2.9 }],
        [MARRIED]: [{ min: 0, max: INFINITY, rate: 2.9 }],
        [MARRIED_SEPARATELY]: [{ min: 0, max: INFINITY, rate: 2.9 }],
        [HEAD_OF_HOUSEHOLD]: [{ min: 0, max: INFINITY, rate: 2.9 }],
      },
    },
    [DORCHESTER_COUNTY]: {
      [COUNTY_INCOME]: {
        [SINGLE]: [{ min: 0, max: INFINITY, rate: 2.62 }],
        [MARRIED]: [{ min: 0, max: INFINITY, rate: 2.62 }],
        [MARRIED_SEPARATELY]: [{ min: 0, max: INFINITY, rate: 2.62 }],
        [HEAD_OF_HOUSEHOLD]: [{ min: 0, max: INFINITY, rate: 2.62 }],
      },
    },
    [FREDERICK_COUNTY]: {
      [COUNTY_INCOME]: {
        [SINGLE]: [
          { min: 0, max: 25000, rate: 2.25 },
          { min: 25000, max: 50000, rate: 2.75 },
          { min: 50000, max: 150000, rate: 2.96 },
          { min: 150000, max: INFINITY, rate: 3.2 },
        ],
        [MARRIED]: [
          { min: 0, max: 25000, rate: 2.25 },
          { min: 25000, max: 100000, rate: 2.75 },
          { min: 100000, max: 250000, rate: 2.96 },
          { min: 250000, max: INFINITY, rate: 3.2 },
        ],
        [MARRIED_SEPARATELY]: [
          { min: 0, max: 25000, rate: 2.25 },
          { min: 25000, max: 50000, rate: 2.75 },
          { min: 50000, max: 150000, rate: 2.96 },
          { min: 150000, max: INFINITY, rate: 3.2 },
        ],
        [HEAD_OF_HOUSEHOLD]: [
          { min: 0, max: 25000, rate: 2.25 },
          { min: 25000, max: 100000, rate: 2.75 },
          { min: 100000, max: 250000, rate: 2.96 },
          { min: 250000, max: INFINITY, rate: 3.2 },
        ],
      },
    },
    [GARRETT_COUNTY]: {
      [COUNTY_INCOME]: {
        [SINGLE]: [{ min: 0, max: INFINITY, rate: 2.65 }],
        [MARRIED]: [{ min: 0, max: INFINITY, rate: 2.65 }],
        [MARRIED_SEPARATELY]: [{ min: 0, max: INFINITY, rate: 2.65 }],
        [HEAD_OF_HOUSEHOLD]: [{ min: 0, max: INFINITY, rate: 2.65 }],
      },
    },
    [HARFORD_COUNTY]: {
      [COUNTY_INCOME]: {
        [SINGLE]: [{ min: 0, max: INFINITY, rate: 3.06 }],
        [MARRIED]: [{ min: 0, max: INFINITY, rate: 3.06 }],
        [MARRIED_SEPARATELY]: [{ min: 0, max: INFINITY, rate: 3.06 }],
        [HEAD_OF_HOUSEHOLD]: [{ min: 0, max: INFINITY, rate: 3.06 }],
      },
    },
    [HOWARD_COUNTY]: {
      [COUNTY_INCOME]: {
        [SINGLE]: [{ min: 0, max: INFINITY, rate: 3.2 }],
        [MARRIED]: [{ min: 0, max: INFINITY, rate: 3.2 }],
        [MARRIED_SEPARATELY]: [{ min: 0, max: INFINITY, rate: 3.2 }],
        [HEAD_OF_HOUSEHOLD]: [{ min: 0, max: INFINITY, rate: 3.2 }],
      },
    },
    [KENT_COUNTY]: {
      [COUNTY_INCOME]: {
        [SINGLE]: [{ min: 0, max: INFINITY, rate: 2.85 }],
        [MARRIED]: [{ min: 0, max: INFINITY, rate: 2.85 }],
        [MARRIED_SEPARATELY]: [{ min: 0, max: INFINITY, rate: 2.85 }],
        [HEAD_OF_HOUSEHOLD]: [{ min: 0, max: INFINITY, rate: 2.85 }],
      },
    },
    [MONTGOMERY_COUNTY]: {
      [COUNTY_INCOME]: {
        [SINGLE]: [{ min: 0, max: INFINITY, rate: 3.2 }],
        [MARRIED]: [{ min: 0, max: INFINITY, rate: 3.2 }],
        [MARRIED_SEPARATELY]: [{ min: 0, max: INFINITY, rate: 3.2 }],
        [HEAD_OF_HOUSEHOLD]: [{ min: 0, max: INFINITY, rate: 3.2 }],
      },
    },
    [PRINCE_GEORGES_COUNTY]: {
      [COUNTY_INCOME]: {
        [SINGLE]: [{ min: 0, max: INFINITY, rate: 3.2 }],
        [MARRIED]: [{ min: 0, max: INFINITY, rate: 3.2 }],
        [MARRIED_SEPARATELY]: [{ min: 0, max: INFINITY, rate: 3.2 }],
        [HEAD_OF_HOUSEHOLD]: [{ min: 0, max: INFINITY, rate: 3.2 }],
      },
    },
    [QUEEN_ANNES_COUNTY]: {
      [COUNTY_INCOME]: {
        [SINGLE]: [{ min: 0, max: INFINITY, rate: 2.85 }],
        [MARRIED]: [{ min: 0, max: INFINITY, rate: 2.85 }],
        [MARRIED_SEPARATELY]: [{ min: 0, max: INFINITY, rate: 2.85 }],
        [HEAD_OF_HOUSEHOLD]: [{ min: 0, max: INFINITY, rate: 2.85 }],
      },
    },
    [SAINT_MARYS_COUNTY]: {
      [COUNTY_INCOME]: {
        [SINGLE]: [{ min: 0, max: INFINITY, rate: 3.0 }],
        [MARRIED]: [{ min: 0, max: INFINITY, rate: 3.0 }],
        [MARRIED_SEPARATELY]: [{ min: 0, max: INFINITY, rate: 3.0 }],
        [HEAD_OF_HOUSEHOLD]: [{ min: 0, max: INFINITY, rate: 3.0 }],
      },
    },
    [SOMERSET_COUNTY]: {
      [COUNTY_INCOME]: {
        [SINGLE]: [{ min: 0, max: INFINITY, rate: 3.15 }],
        [MARRIED]: [{ min: 0, max: INFINITY, rate: 3.15 }],
        [MARRIED_SEPARATELY]: [{ min: 0, max: INFINITY, rate: 3.15 }],
        [HEAD_OF_HOUSEHOLD]: [{ min: 0, max: INFINITY, rate: 3.15 }],
      },
    },
    [TALBOT_COUNTY]: {
      [COUNTY_INCOME]: {
        [SINGLE]: [{ min: 0, max: INFINITY, rate: 2.25 }],
        [MARRIED]: [{ min: 0, max: INFINITY, rate: 2.25 }],
        [MARRIED_SEPARATELY]: [{ min: 0, max: INFINITY, rate: 2.25 }],
        [HEAD_OF_HOUSEHOLD]: [{ min: 0, max: INFINITY, rate: 2.25 }],
      },
    },
    [WASHINGTON_COUNTY]: {
      [COUNTY_INCOME]: {
        [SINGLE]: [{ min: 0, max: INFINITY, rate: 2.8 }],
        [MARRIED]: [{ min: 0, max: INFINITY, rate: 2.8 }],
        [MARRIED_SEPARATELY]: [{ min: 0, max: INFINITY, rate: 2.8 }],
        [HEAD_OF_HOUSEHOLD]: [{ min: 0, max: INFINITY, rate: 2.8 }],
      },
    },
    [WICOMICO_COUNTY]: {
      [COUNTY_INCOME]: {
        [SINGLE]: [{ min: 0, max: INFINITY, rate: 3.1 }],
        [MARRIED]: [{ min: 0, max: INFINITY, rate: 3.1 }],
        [MARRIED_SEPARATELY]: [{ min: 0, max: INFINITY, rate: 3.1 }],
        [HEAD_OF_HOUSEHOLD]: [{ min: 0, max: INFINITY, rate: 3.1 }],
      },
    },
    [WORCESTER_COUNTY]: {
      [COUNTY_INCOME]: {
        [SINGLE]: [{ min: 0, max: INFINITY, rate: 1.25 }],
        [MARRIED]: [{ min: 0, max: INFINITY, rate: 1.25 }],
        [MARRIED_SEPARATELY]: [{ min: 0, max: INFINITY, rate: 1.25 }],
        [HEAD_OF_HOUSEHOLD]: [{ min: 0, max: INFINITY, rate: 1.25 }],
      },
    },
  },
} as TaxData;
