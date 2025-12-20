import { INFINITY } from "@/constants";
import { ALL } from "@/constants/filing-status";
import { STATE_INCOME } from "@/constants/tax_types";
import type { TaxData } from "@/types";

export default {
  [STATE_INCOME]: {
    [ALL]: [
      { min: 0, max: 26050, rate: 0 },
      { min: 26050, max: 100000, rate: 2.75 },
      { min: 100000, max: INFINITY, rate: 3.125 },
    ],
  },
} as TaxData;
