import type { FilingStatus } from "../constants/filing-status";
import type { ALL } from "../constants/filing-status";
import type {
  FEDERAL_INCOME,
  MAX_401K_CONTRIBUTION,
  NONE,
  STANDARD_DEDUCTION,
  STATE_INCOME,
} from "../constants/tax_types";
import type { CITIES, EXEMPT, INFINITY } from "../constants";
import type { Dinero } from "dinero.js";
import type { ReactElement } from "react";

export type TaxFrequency =
  | "annually"
  | "monthly"
  | "semi_monthly"
  | "biweekly"
  | "weekly";

// Which income figure a tax is measured against. Defaults per tax type -- see
// grossIncomeTaxes in utils/calculator.ts -- and per bracket where a schedule
// overrides it.
export type IncomeBasis = "gross" | "taxable";

export type RateBracket = {
  min: number;
  max: number | typeof INFINITY;
  rate: number;
  // Employee share of a split payroll tax, e.g. 60 = 60% employee / 40% employer
  percent_of_total?: number;
  // Turns the schedule into a rate lookup rather than a marginal one: min/max
  // select which rate applies, and that rate is charged on the whole income
  // base. Set on every bracket of such a schedule. Eugene's payroll tax only.
  rate_on_total?: true;
  // Overrides the tax type's default income base. Read from the first bracket.
  basis?: IncomeBasis;
};

export type FlatFeeBracket = {
  amount: number;
  // Income at or above which the fee is owed
  min?: number;
  frequency?: TaxFrequency;
  basis?: IncomeBasis;
};

export type Bracket = RateBracket | FlatFeeBracket;

/**
 * One tax's bracket list. Uniform in kind: a schedule is either all rate
 * brackets or all flat fees, never a mix. Modelling it as a union of arrays
 * rather than an array of unions is what lets `isFlatFeeSchedule` narrow it.
 */
export type BracketSchedule = RateBracket[] | FlatFeeBracket[];

export type BracketsByFilingStatus =
  | { [Key in FilingStatus]?: BracketSchedule }
  | { [ALL]?: BracketSchedule };

export interface TaxData {
  [MAX_401K_CONTRIBUTION]?: number;
  [STANDARD_DEDUCTION]?: {
    [Key in FilingStatus]: number;
  };
  [FEDERAL_INCOME]?: BracketsByFilingStatus;
  [STATE_INCOME]?: BracketsByFilingStatus | typeof NONE;
  [CITIES]?: {
    [Key: string]: {
      [Key: string]: BracketsByFilingStatus;
    };
  };
  // Every other tax type (social_security, medicare, oregon_transit_tax, the
  // state payroll taxes, …). Without this the data files can only typecheck
  // behind an `as TaxData` assertion, which suppresses all checking.
  [taxType: string]:
    | number
    | { [Key in FilingStatus]: number }
    | BracketsByFilingStatus
    | TaxData[typeof CITIES]
    | typeof NONE
    | undefined;
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
