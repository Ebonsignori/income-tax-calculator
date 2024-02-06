export const WEEKLY = "weekly";
export const BIWEEKLY = "biweekly";
export const SEMI_MONTHLY = "semi_monthly";
export const MONTHLY = "monthly";

export const PAYCHECK_FREQUENCIES = [WEEKLY, BIWEEKLY, SEMI_MONTHLY, MONTHLY];

export type PaycheckFrequency =
  | "weekly"
  | "biweekly"
  | "semi_monthly"
  | "monthly";

export const FREQUENCY_TO_PAYCHECKS_PER_YEAR: Record<
  PaycheckFrequency,
  number
> = {
  [WEEKLY]: 52,
  [BIWEEKLY]: 26,
  [SEMI_MONTHLY]: 24,
  [MONTHLY]: 12,
};

export const FREQUENCY_TO_FREQUENCY_LABEL: Record<PaycheckFrequency, string> = {
  [WEEKLY]: "each week",
  [BIWEEKLY]: "every two weeks",
  [SEMI_MONTHLY]: "twice a month",
  [MONTHLY]: "each month",
};
