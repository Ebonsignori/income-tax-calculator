import type { TaxData } from "@/types";
import { useEffect } from "react";

type GetTaxData = {
  year: string;
  USAState: string;
  // eslint-disable-next-line no-unused-vars
  setFederalTaxes: (value: TaxData) => void;
  // eslint-disable-next-line no-unused-vars
  setStateTaxes: (value: TaxData) => void;
};

export function useGetTaxData({
  year,
  USAState,
  setFederalTaxes,
  setStateTaxes,
}: GetTaxData) {
  useEffect(() => {
    async function fetchFederalBrackets() {
      const federalBrackets = await import(`@/data/${year}/federal.ts`);
      setFederalTaxes(federalBrackets.default);
    }
    fetchFederalBrackets();
  }, [year, setFederalTaxes, setStateTaxes]);

  useEffect(() => {
    async function fetchStateBrackets() {
      if (!USAState) {
        setStateTaxes({} as TaxData);
        return;
      }
      const stateBrackets = await import(`@/data/${year}/state/${USAState}.ts`);
      setStateTaxes(stateBrackets.default);
    }
    fetchStateBrackets();
  }, [USAState, year, setFederalTaxes, setStateTaxes]);
}
