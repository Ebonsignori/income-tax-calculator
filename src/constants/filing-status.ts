export const ALL = "all"; // When the tax is applied regardless of filing status
export const SINGLE = "single";
export const MARRIED = "married";
export const MARRIED_SEPARATELY = "married_separately";
export const HEAD_OF_HOUSEHOLD = "head_of_household";

export const FILING_STATUSES = [
  SINGLE,
  MARRIED,
  MARRIED_SEPARATELY,
  HEAD_OF_HOUSEHOLD,
];

export type FilingStatus =
  | "single"
  | "married"
  | "married_separately"
  | "head_of_household";

export const EMPTY_STANDARD_DEDUCTION_MAP = {
  [SINGLE]: 0,
  [MARRIED]: 0,
  [MARRIED_SEPARATELY]: 0,
  [HEAD_OF_HOUSEHOLD]: 0,
};

export type StandardDeductionMap = typeof EMPTY_STANDARD_DEDUCTION_MAP;
