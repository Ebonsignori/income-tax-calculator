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
  // Employee share is half the premium, capped at 0.5% of the maximum weekly
  // wage base of $1,500.21 (2026), i.e. $78010 a year.
  [HI_TEMPORARY_DISABILITY_INSURANCE]: {
    [ALL]: [
      { min: 0, max: 78010, rate: 0.5 },
      { min: 78010, max: INFINITY, rate: 0 },
    ],
  },
  [STANDARD_DEDUCTION]: {
    [SINGLE]: 8000,
    [MARRIED]: 16000,
    [MARRIED_SEPARATELY]: 8000,
    [HEAD_OF_HOUSEHOLD]: 12000,
  },
  [STATE_INCOME]: {
    [SINGLE]: [
      { min: 0, max: 9600, rate: 1.4 },
      { min: 9600, max: 14400, rate: 3.2 },
      { min: 14400, max: 19200, rate: 5.5 },
      { min: 19200, max: 24000, rate: 6.4 },
      { min: 24000, max: 36000, rate: 6.8 },
      { min: 36000, max: 48000, rate: 7.2 },
      { min: 48000, max: 125000, rate: 7.6 },
      { min: 125000, max: 175000, rate: 7.9 },
      { min: 175000, max: 225000, rate: 8.25 },
      { min: 225000, max: 275000, rate: 9 },
      { min: 275000, max: 325000, rate: 10 },
      { min: 325000, max: INFINITY, rate: 11 },
    ],
    [MARRIED]: [
      { min: 0, max: 19200, rate: 1.4 },
      { min: 19200, max: 28800, rate: 3.2 },
      { min: 28800, max: 38400, rate: 5.5 },
      { min: 38400, max: 48000, rate: 6.4 },
      { min: 48000, max: 72000, rate: 6.8 },
      { min: 72000, max: 96000, rate: 7.2 },
      { min: 96000, max: 250000, rate: 7.6 },
      { min: 250000, max: 350000, rate: 7.9 },
      { min: 350000, max: 450000, rate: 8.25 },
      { min: 450000, max: 550000, rate: 9 },
      { min: 550000, max: 650000, rate: 10 },
      { min: 650000, max: INFINITY, rate: 11 },
    ],
    [MARRIED_SEPARATELY]: [
      { min: 0, max: 9600, rate: 1.4 },
      { min: 9600, max: 14400, rate: 3.2 },
      { min: 14400, max: 19200, rate: 5.5 },
      { min: 19200, max: 24000, rate: 6.4 },
      { min: 24000, max: 36000, rate: 6.8 },
      { min: 36000, max: 48000, rate: 7.2 },
      { min: 48000, max: 125000, rate: 7.6 },
      { min: 125000, max: 175000, rate: 7.9 },
      { min: 175000, max: 225000, rate: 8.25 },
      { min: 225000, max: 275000, rate: 9 },
      { min: 275000, max: 325000, rate: 10 },
      { min: 325000, max: INFINITY, rate: 11 },
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
} as TaxData;
