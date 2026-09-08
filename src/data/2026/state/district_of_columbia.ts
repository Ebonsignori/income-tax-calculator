import { INFINITY } from "@/constants";
import {
  ALL,
  HEAD_OF_HOUSEHOLD,
  MARRIED,
  MARRIED_SEPARATELY,
  SINGLE,
} from "@/constants/filing-status";
import {
  DC_PAID_FAMILY_LEAVE,
  STANDARD_DEDUCTION,
  STATE_INCOME,
} from "@/constants/tax_types";
import type { TaxData } from "@/types";

export default {
  // Congress disapproved DC's decoupling act (H.J.Res. 142, enacted
  // 2026-02-18), so DC is back on the federal standard deduction for 2026.
  // Source: OTR 2026 D-40ES, Line 2b.
  [STANDARD_DEDUCTION]: {
    [SINGLE]: 16100,
    [MARRIED]: 32200,
    [MARRIED_SEPARATELY]: 16100,
    [HEAD_OF_HOUSEHOLD]: 24150,
  },
  [STATE_INCOME]: {
    [ALL]: [
      { min: 0, max: 10000, rate: 4 },
      { min: 10000, max: 40000, rate: 6 },
      { min: 40000, max: 60000, rate: 6.5 },
      { min: 60000, max: 250000, rate: 8.5 },
      { min: 250000, max: 500000, rate: 9.25 },
      { min: 500000, max: 1000000, rate: 9.75 },
      { min: 1000000, max: INFINITY, rate: 10.75 },
    ],
  },
  [DC_PAID_FAMILY_LEAVE]: {
    [ALL]: [{ min: 0, max: INFINITY, rate: 0.75 }],
  },
} as TaxData;
