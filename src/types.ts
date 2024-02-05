/* eslint-disable no-unused-vars */
import type { FilingStatus } from "./constants/filing-status";
import type { ALL } from "./constants/filing-status";
import type {
  FEDERAL_INCOME,
  MAX_401K_CONTRIBUTION,
  NONE,
  STANDARD_DEDUCTION,
  STATE_INCOME,
} from "./constants/tax_types";
import type { CITIES, EXEMPT, INFINITY } from "./constants";
import type { Dinero } from "dinero.js";
import type { ReactElement } from "react";

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
  [STATE_INCOME]?:
    | {
        [Key in FilingStatus]: Bracket[];
      }
    | typeof NONE;
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

export type AutocompleteOption = {
  title: string;
  firstLetter: string;
  disabled: boolean;
};

export type AvailableStatesAndCities = { [key: string]: { cities: string[] } };

export type NavPage = {
  name: string;
  icon: ReactElement;
  route: string;
  selected: boolean;
};
