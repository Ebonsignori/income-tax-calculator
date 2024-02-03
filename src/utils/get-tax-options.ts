import { useMemo } from "react";
import { snakeToTitleCase } from "./string-utils";
import {
  MAX_401K_CONTRIBUTION,
  STANDARD_DEDUCTION,
  STATE_INCOME,
} from "@/constants/tax_types";
import { StandardDeductionMap } from "@/constants/filing-status";
import { CITIES } from "@/constants";
import { TaxData } from "@/types";

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
    const cities = [] as any;
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
        if (USACity && (value as any)[USACity]) {
          Object.entries((value as any)[USACity]).map(([key, value]) => {
            cities.push({
              title: snakeToTitleCase(`${USACity}_${key}`),
              value: key,
              disabled: false,
            });
          });
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
    return [...federal, ...state, ...cities].filter((x) => x);
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
