import { INFINITY } from "@/constants";
import { ALL } from "@/constants/filing-status";
import { STATE_INCOME } from "@/constants/tax_types";
import type { TaxData } from "@/types";

export default {
  [STATE_INCOME]: {
    [ALL]: [
      { min: 0, max: 3460, rate: 0 },
      { min: 3460, max: 17330, rate: 3 },
      { min: 17330, max: INFINITY, rate: 6.2 },
    ],
  },
} as TaxData;
