import { INFINITY } from "@/constants";
import { ALL } from "@/constants/filing-status";
import { STATE_INCOME } from "@/constants/tax_types";
import type { TaxData } from "@/types";

export default {
  [STATE_INCOME]: {
    [ALL]: [
      { min: 0, max: 1083150, rate: 5 },
      { min: 1083150, max: INFINITY, rate: 9 },
    ],
  },
} as TaxData;
