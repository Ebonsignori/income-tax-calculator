import { INFINITY } from "@/constants";
import {
  ALL,
  HEAD_OF_HOUSEHOLD,
  MARRIED,
  MARRIED_SEPARATELY,
  SINGLE,
} from "@/constants/filing-status";
import { STATE_INCOME, STANDARD_DEDUCTION } from "@/constants/tax_types";
import type { TaxData } from "@/types";

export default {
  // HB 1437's flat tax took effect in 2024 and set one $12,000 deduction for
  // every status except married filing jointly. Single and married filing
  // separately previously carried the pre-flat-tax $7,100. Head of household
  // matching single is Georgia's long-standing grouping, not a copy.
  // Source: 2024 IT-511 booklet, Form 500 instructions, Line 11.
  [STANDARD_DEDUCTION]: {
    [SINGLE]: 12000,
    [MARRIED]: 24000,
    [MARRIED_SEPARATELY]: 12000,
    [HEAD_OF_HOUSEHOLD]: 12000,
  },
  [STATE_INCOME]: {
    [ALL]: [{ min: 0, max: INFINITY, rate: 5.39 }],
  },
} as TaxData;
