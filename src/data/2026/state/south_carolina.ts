import { INFINITY } from "@/constants";
import { ALL } from "@/constants/filing-status";
import { STATE_INCOME } from "@/constants/tax_types";
import type { TaxData } from "@/types";

export default {
  [STATE_INCOME]: {
    [ALL]: [
      { min: 0, max: 30000, rate: 1.99 },
      { min: 30000, max: INFINITY, rate: 5.21 },
    ],
  },
} as TaxData;
