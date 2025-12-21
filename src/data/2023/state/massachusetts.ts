import { INFINITY } from "@/constants";
import { ALL } from "@/constants/filing-status";
import { STATE_INCOME } from "@/constants/tax_types";
import type { TaxData } from "@/types";

export default {
  [STATE_INCOME]: {
    [ALL]: [
      { min: 0, max: 1000000, rate: 5 },
      { min: 1000000, max: INFINITY, rate: 9 },
    ],
  },
} as TaxData;
