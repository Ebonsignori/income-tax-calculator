import { INFINITY } from "@/constants";
import {
  ALL,
  HEAD_OF_HOUSEHOLD,
  MARRIED,
  MARRIED_SEPARATELY,
  SINGLE,
} from "@/constants/filing-status";
import {
  HI_TEMPORARY_DISABILITY_INSURANCE,
  STANDARD_DEDUCTION,
  STATE_INCOME,
} from "@/constants/tax_types";
import type { TaxData } from "@/types";

export default {
  [STANDARD_DEDUCTION]: {
    [SINGLE]: 4400,
    [MARRIED]: 8800,
    [MARRIED_SEPARATELY]: 4400,
    [HEAD_OF_HOUSEHOLD]: 6424,
  },
  [STATE_INCOME]: {
    [SINGLE]: [
      { min: 0, max: 2400, rate: 1.4 },
      { min: 2400, max: 4800, rate: 3.2 },
      { min: 4800, max: 9600, rate: 5.5 },
      { min: 9600, max: 14400, rate: 6.4 },
      { min: 14400, max: 19200, rate: 6.8 },
      { min: 19200, max: 24000, rate: 7.2 },
      { min: 24000, max: 36000, rate: 7.6 },
      { min: 36000, max: 48000, rate: 7.9 },
      { min: 48000, max: 150000, rate: 8.25 },
      { min: 150000, max: 175000, rate: 9 },
      { min: 175000, max: 200000, rate: 10 },
      { min: 200000, max: INFINITY, rate: 11 },
    ],
    [MARRIED]: [
      { min: 0, max: 4800, rate: 1.4 },
      { min: 4800, max: 9600, rate: 3.2 },
      { min: 9600, max: 19200, rate: 5.5 },
      { min: 19200, max: 28800, rate: 6.4 },
      { min: 28800, max: 38400, rate: 6.8 },
      { min: 38400, max: 48000, rate: 7.2 },
      { min: 48000, max: 72000, rate: 7.6 },
      { min: 72000, max: 96000, rate: 7.9 },
      { min: 96000, max: 300000, rate: 8.25 },
      { min: 300000, max: 350000, rate: 9 },
      { min: 350000, max: 400000, rate: 10 },
      { min: 400000, max: INFINITY, rate: 11 },
    ],
    [MARRIED_SEPARATELY]: [
      { min: 0, max: 2400, rate: 1.4 },
      { min: 2400, max: 4800, rate: 3.2 },
      { min: 4800, max: 9600, rate: 5.5 },
      { min: 9600, max: 14400, rate: 6.4 },
      { min: 14400, max: 19200, rate: 6.8 },
      { min: 19200, max: 24000, rate: 7.2 },
      { min: 24000, max: 36000, rate: 7.6 },
      { min: 36000, max: 48000, rate: 7.9 },
      { min: 48000, max: 150000, rate: 8.25 },
      { min: 150000, max: 175000, rate: 9 },
      { min: 175000, max: 200000, rate: 10 },
      { min: 200000, max: INFINITY, rate: 11 },
    ],
    [HEAD_OF_HOUSEHOLD]: [
      { min: 0, max: 14400, rate: 1.4 },
      { min: 14400, max: 21600, rate: 3.2 },
      { min: 21600, max: 28800, rate: 5.5 },
      { min: 28800, max: 36000, rate: 6.4 },
      { min: 36000, max: 54000, rate: 6.8 },
      { min: 54000, max: 72000, rate: 7.2 },
      { min: 72000, max: 187500, rate: 7.6 },
      { min: 187500, max: 262500, rate: 7.9 },
      { min: 262500, max: 337500, rate: 8.25 },
      { min: 337500, max: 412500, rate: 9 },
      { min: 412500, max: 487500, rate: 10 },
      { min: 487500, max: INFINITY, rate: 11 },
    ],
  },
  [HI_TEMPORARY_DISABILITY_INSURANCE]: {
    [ALL]: [
      { min: 0, max: 71488, rate: 0.5 },
      { min: 71488, max: INFINITY, rate: 0 },
    ],
  },
} as TaxData;
