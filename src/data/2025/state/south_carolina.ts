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
  // SC conforms to the IRC as of 2024-12-31 and adds back the OBBBA
  // standard-deduction increase, so these are the pre-OBBBA 2025 amounts.
  [STANDARD_DEDUCTION]: {
    [SINGLE]: 15000,
    [MARRIED]: 30000,
    [MARRIED_SEPARATELY]: 15000,
    [HEAD_OF_HOUSEHOLD]: 22500,
  },
  [STATE_INCOME]: {
    [ALL]: [
      { min: 0, max: 3460, rate: 0 },
      { min: 3460, max: 17330, rate: 3 },
      { min: 17330, max: INFINITY, rate: 6.2 },
    ],
  },
} as TaxData;
