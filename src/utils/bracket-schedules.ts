import { CITIES, GROSS_INCOME_BASIS } from "@/constants";
import type { FilingStatus } from "@/constants/filing-status";
import { STANDARD_DEDUCTION, STATE_INCOME } from "@/constants/tax_types";
import type { BracketSchedule, RateBracket, TaxData } from "@/types";
import {
  incomeBasisFor,
  isFlatFeeSchedule,
  isRateLookupSchedule,
  scheduleForFilingStatus,
} from "./calculator";
import { snakeToTitleCase } from "./string-utils";

/** One selectable schedule in the bracket ladder. */
export type LadderSchedule = {
  /** Unique across jurisdictions -- `city:art_tax` cannot collide with a state one. */
  key: string;
  label: string;
  brackets: RateBracket[];
  /** The income these bands are measured against. */
  taxableIncome: number;
};

type CollectArgs = {
  federalTaxes: TaxData;
  stateTaxes: TaxData;
  USAState: string;
  USACity: string;
  filingStatus: FilingStatus;
  /** Income after retirement contributions, before deductions. */
  grossIncome: number;
  federalTaxableIncome: number;
  /** Cities are calculated with the state's deductions, so they share this. */
  stateTaxableIncome: number;
};

/** Keys that are data, not a tax with a schedule. */
const NOT_A_TAX = new Set<string>([STANDARD_DEDUCTION, CITIES]);

/**
 * A schedule only makes a ladder if it slices income across rate bands.
 *
 * A flat fee is a fixed charge and a rate-lookup schedule taxes the whole
 * income at a single rate; drawing either as a ladder would say something
 * untrue about how the tax works.
 */
function isRateLadder(schedule: BracketSchedule | undefined): boolean {
  return Boolean(
    schedule?.length &&
      !isFlatFeeSchedule(schedule) &&
      !isRateLookupSchedule(schedule),
  );
}

/**
 * Every bracket schedule that fed into this calculation, in the order they
 * are levied: federal, then state, then city.
 *
 * Each carries the income base the calculation used for it, since they
 * differ -- payroll taxes are on gross wages, income taxes on income after
 * that jurisdiction's deductions -- and drawing a schedule against the wrong
 * one would put the taxpayer in the wrong band.
 */
export function collectBracketSchedules({
  federalTaxes,
  stateTaxes,
  USAState,
  USACity,
  filingStatus,
  grossIncome,
  federalTaxableIncome,
  stateTaxableIncome,
}: CollectArgs): LadderSchedule[] {
  const schedules: LadderSchedule[] = [];

  const add = (
    keyPrefix: string,
    taxType: string,
    taxTypeData: TaxData[string],
    label: string,
    taxableIncome: number,
  ) => {
    if (NOT_A_TAX.has(taxType)) return;
    const schedule = scheduleForFilingStatus(taxTypeData, filingStatus);
    if (!isRateLadder(schedule)) return;
    const basis = incomeBasisFor(taxType, schedule as BracketSchedule);
    schedules.push({
      key: `${keyPrefix}:${taxType}`,
      label,
      brackets: schedule as RateBracket[],
      taxableIncome: basis === GROSS_INCOME_BASIS ? grossIncome : taxableIncome,
    });
  };

  for (const [taxType, taxTypeData] of Object.entries(federalTaxes ?? {})) {
    add(
      "federal",
      taxType,
      taxTypeData,
      snakeToTitleCase(taxType),
      federalTaxableIncome,
    );
  }

  for (const [taxType, taxTypeData] of Object.entries(stateTaxes ?? {})) {
    if (taxType === CITIES) continue;
    // "Oregon State Income" reads better than a bare "State Income" once
    // federal and city schedules sit in the same list.
    const label =
      taxType === STATE_INCOME && USAState
        ? snakeToTitleCase(`${USAState}_${taxType}`)
        : snakeToTitleCase(taxType);
    add("state", taxType, taxTypeData, label, stateTaxableIncome);
  }

  const cityTaxes = USACity ? stateTaxes?.[CITIES]?.[USACity] : undefined;
  for (const [taxType, taxTypeData] of Object.entries(cityTaxes ?? {})) {
    add(
      "city",
      taxType,
      taxTypeData as TaxData[string],
      `${snakeToTitleCase(taxType)} (City)`,
      stateTaxableIncome,
    );
  }

  return schedules;
}
