import { useMemo } from "react";
import { cityTaxKey, snakeToTitleCase } from "./string-utils";
import {
  MAX_401K_CONTRIBUTION,
  STANDARD_DEDUCTION,
  STATE_INCOME,
} from "@/constants/tax_types";
import type { StandardDeductionMap } from "@/constants/filing-status";
import { CITIES } from "@/constants";
import type { TaxData } from "@/types";

export type TaxOption = {
  title: string;
  value: string;
  disabled: boolean;
};

type GetTaxOptions = {
  federalTaxes: TaxData;
  stateTaxes: TaxData;
  USACity: string;
  USAState: string;
  setFederalStandardDeductionMap: (value: StandardDeductionMap) => void;
  setStateStandardDeductionMap: (value: StandardDeductionMap) => void;
  setMax401KContribution: (value: number) => void;
};

export function useGetTaxOptions({
  federalTaxes,
  stateTaxes,
  USACity,
  USAState,
  setFederalStandardDeductionMap,
  setStateStandardDeductionMap,
  setMax401KContribution,
}: GetTaxOptions): TaxOption[] {
  return useMemo(() => {
    const cities: TaxOption[] = [];
    const federal = Object.entries(federalTaxes || {}).map(([key, value]) => {
      if (key === STANDARD_DEDUCTION) {
        setFederalStandardDeductionMap(value as StandardDeductionMap);
        return null;
      }
      if (key === MAX_401K_CONTRIBUTION) {
        setMax401KContribution(value as number);
        return null;
      }
      return {
        title: snakeToTitleCase(key),
        value: key,
        disabled: false,
      };
    });
    const state = Object.entries(stateTaxes || {}).map(([key, value]) => {
      if (key === STANDARD_DEDUCTION) {
        setStateStandardDeductionMap(value as StandardDeductionMap);
        return null;
      }
      if (key === CITIES) {
        const cityTaxes = (value as TaxData[typeof CITIES])?.[USACity];
        if (USACity && cityTaxes) {
          for (const cityTaxType of Object.keys(cityTaxes)) {
            cities.push({
              title: snakeToTitleCase(cityTaxKey(USACity, cityTaxType)),
              value: cityTaxType,
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
        disabled: false,
      };
    });
    return [...federal, ...state, ...cities].filter(
      (option): option is TaxOption => option !== null,
    );
  }, [
    federalTaxes,
    stateTaxes,
    USACity,
    USAState,
    setFederalStandardDeductionMap,
    setStateStandardDeductionMap,
    setMax401KContribution,
  ]);
}
