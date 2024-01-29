import { INFINITY } from "@/constants";
import { ALL } from "@/constants/filing_status";
import {
  STATE_INCOME,
  NONE,
  WASHINGTON_CARES_FUND,
} from "@/constants/tax_types";
import { TaxData } from "@/types";

export default {
  [STATE_INCOME]: NONE,
  [WASHINGTON_CARES_FUND]: {
    [ALL]: [{ min: 0, max: INFINITY, rate: 0.58 }],
  },
} as TaxData;
