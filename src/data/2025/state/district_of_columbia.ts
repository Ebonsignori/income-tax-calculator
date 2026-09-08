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
  // DC decoupled from the federal standard deduction for tax years
  // beginning on or after 2025-01-01 and set its own amounts, so these are
  // deliberately NOT the higher post-OBBBA federal figures.
  // Source: OTR 2025 D-40 booklet, "DC Basic Standard Deduction".
  [STANDARD_DEDUCTION]: {
    [SINGLE]: 15000,
    [MARRIED]: 30000,
    [MARRIED_SEPARATELY]: 15000,
    [HEAD_OF_HOUSEHOLD]: 22500,
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
