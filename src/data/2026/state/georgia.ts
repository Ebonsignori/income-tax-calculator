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
  // The 2026 cut to a flat 4.99% also raised the standard deduction to
  // $15,000 for single, head of household and married filing separately, and
  // $30,000 for married filing jointly. Head of household matching single is
  // Georgia's grouping of the two statuses, not a duplicated single figure.
  // Source: Georgia DOR, "Important Tax Updates", 2026 Income Tax Changes.
  [STANDARD_DEDUCTION]: {
    [SINGLE]: 15000,
    [MARRIED]: 30000,
    [MARRIED_SEPARATELY]: 15000,
    [HEAD_OF_HOUSEHOLD]: 15000,
  },
  [STATE_INCOME]: {
    [ALL]: [{ min: 0, max: INFINITY, rate: 4.99 }],
  },
} as TaxData;
