import type { FilingStatus } from "./constants/filing_status";
import { ALL } from "./constants/filing_status";
import {
  STATE_INCOME,
  STANDARD_DEDUCTION,
  FEDERAL_INCOME,
  MAX_401K_CONTRIBUTION,
  NONE,
} from "./constants/tax_types";
import { CITIES, EXEMPT, INFINITY } from "./constants";
import { Dinero } from "dinero.js";

export type Bracket =
  | {
      min: number;
      max: number | typeof INFINITY;
      rate: number;
    }
  | {
      amount: number;
    };

export interface TaxData {
  [MAX_401K_CONTRIBUTION]?: number;
  [STANDARD_DEDUCTION]?: {
    [Key in FilingStatus]: number;
  };
  [FEDERAL_INCOME]?: {
    [Key in FilingStatus]: Bracket[];
  };
  [STATE_INCOME]?: {
    [Key in FilingStatus]: Bracket[];
  } | typeof NONE;
  [CITIES]?: {
    [Key: string]: {
      [Key: string]:
        | {
            [Key in FilingStatus]: Bracket[];
          }
        | { [ALL]?: Bracket[] };
    };
  };
}

export type TaxResults = {
  [Key: string]: Dinero | typeof EXEMPT;
};

export type TaxResultsWithCities = {
  [Key: string]: TaxResults | Dinero | typeof EXEMPT;
};
