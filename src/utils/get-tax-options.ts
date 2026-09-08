import { useMemo } from "react";
import { cityTaxKey, snakeToTitleCase } from "./string-utils";
import {
  MAX_401K_CONTRIBUTION,
  NON_WAGE_TAX_TYPES,
  STANDARD_DEDUCTION,
  STATE_INCOME,
} from "@/constants/tax_types";
import type { StandardDeductionByFilingStatus } from "@/types";
import { CITIES, CITY_SCOPE, FEDERAL_SCOPE, STATE_SCOPE } from "@/constants";
import type { TaxData } from "@/types";

export type TaxOption = {
  title: string;
  /**
   * The tax-type key, unqualified. `scope` says which jurisdiction it belongs
   * to: federal and state keys share a namespace, city keys do not, and a
   * generic key like `occupational_tax` or `city_income` could otherwise be
   * exempted in one jurisdiction and silently take effect in another.
   */
  value: string;
  scope: TaxScope;
  disabled: boolean;
};

export type TaxScope =
  | typeof FEDERAL_SCOPE
  | typeof STATE_SCOPE
  | typeof CITY_SCOPE;

type GetTaxOptions = {
  federalTaxes: TaxData;
  stateTaxes: TaxData;
  USACity: string;
  USAState: string;
  /**
   * Lifted as declared, not resolved. A phased-out deduction is a schedule
   * rather than a number, and only the caller knows the income to resolve it
   * against.
   */
  setFederalStandardDeductionMap: (
    value: StandardDeductionByFilingStatus,
  ) => void;
  setStateStandardDeductionMap: (
    value: StandardDeductionByFilingStatus,
  ) => void;
  setMax401KContribution: (value: number) => void;
  /**
   * Drop taxes that are not levied on wages. The calculator offers these as
   * exemptions, and there is nothing to exempt from a tax it does not charge;
   * the tax tables list them as reference and keep them.
   */
  excludeNonWageTaxes?: boolean;
};

export function useGetTaxOptions({
  federalTaxes,
  stateTaxes,
  USACity,
  USAState,
  setFederalStandardDeductionMap,
  setStateStandardDeductionMap,
  setMax401KContribution,
  excludeNonWageTaxes = false,
}: GetTaxOptions): TaxOption[] {
  return useMemo(() => {
    const cities: TaxOption[] = [];
    const federal = Object.entries(federalTaxes || {}).map(([key, value]) => {
      if (key === STANDARD_DEDUCTION) {
        setFederalStandardDeductionMap(
          value as StandardDeductionByFilingStatus,
        );
        return null;
      }
      if (key === MAX_401K_CONTRIBUTION) {
        setMax401KContribution(value as number);
        return null;
      }
      return {
        title: snakeToTitleCase(key),
        value: key,
        scope: FEDERAL_SCOPE,
        disabled: false,
      };
    });
    const state = Object.entries(stateTaxes || {}).map(([key, value]) => {
      if (key === STANDARD_DEDUCTION) {
        setStateStandardDeductionMap(value as StandardDeductionByFilingStatus);
        return null;
      }
      if (key === CITIES) {
        const cityTaxes = (value as TaxData[typeof CITIES])?.[USACity];
        if (USACity && cityTaxes) {
          for (const cityTaxType of Object.keys(cityTaxes)) {
            cities.push({
              title: snakeToTitleCase(cityTaxKey(USACity, cityTaxType)),
              value: cityTaxType,
              scope: CITY_SCOPE,
              disabled: false,
            });
          }
        }
        return null;
      }
      return {
        title: snakeToTitleCase(
          key === STATE_INCOME ? `${USAState}_${key}` : key,
        ),
        value: key,
        scope: STATE_SCOPE,
        disabled: false,
      };
    });
    return [...federal, ...state, ...cities].filter(
      (option): option is TaxOption =>
        option !== null &&
        !(excludeNonWageTaxes && NON_WAGE_TAX_TYPES.includes(option.value)),
    );
  }, [
    federalTaxes,
    stateTaxes,
    USACity,
    USAState,
    setFederalStandardDeductionMap,
    setStateStandardDeductionMap,
    setMax401KContribution,
    excludeNonWageTaxes,
  ]);
}
