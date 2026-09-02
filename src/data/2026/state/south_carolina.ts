import { INFINITY } from "@/constants";
import {
  ALL,
  HEAD_OF_HOUSEHOLD,
  MARRIED,
  MARRIED_SEPARATELY,
  SINGLE,
} from "@/constants/filing-status";
import { STANDARD_DEDUCTION, STATE_INCOME } from "@/constants/tax_types";
import type { TaxData } from "@/types";

export default {
  // CARRIED FROM 2025 — depends on whether SC updates its IRC conformity
  // date in the 2026 session. Revisit.
  [STANDARD_DEDUCTION]: {
    [SINGLE]: 15000,
    [MARRIED]: 30000,
    [MARRIED_SEPARATELY]: 15000,
    [HEAD_OF_HOUSEHOLD]: 22500,
  },
  [STATE_INCOME]: {
    [ALL]: [
      { min: 0, max: 30000, rate: 1.99 },
      { min: 30000, max: INFINITY, rate: 5.21 },
    ],
  },
} as TaxData;
