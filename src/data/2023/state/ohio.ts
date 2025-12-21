import { INFINITY } from "@/constants";
import { ALL } from "@/constants/filing-status";
import { STATE_INCOME } from "@/constants/tax_types";
import type { TaxData } from "@/types";

export default {
  [STATE_INCOME]: {
    [ALL]: [
      { min: 0, max: 26050, rate: 0 },
      { min: 26050, max: 92150, rate: 2.75 },
      { min: 92150, max: 115300, rate: 3.688 },
      { min: 115300, max: INFINITY, rate: 3.75 },
    ],
  },
} as TaxData;
