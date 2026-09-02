/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useGetTaxOptions } from "@/utils/get-tax-options";
import type { TaxData } from "@/types";
import {
  MAX_401K_CONTRIBUTION,
  STANDARD_DEDUCTION,
  STATE_INCOME,
  FEDERAL_INCOME,
  SOCIAL_SECURITY,
  ART_TAX,
} from "@/constants/tax_types";
import { CITIES } from "@/constants";

const setFederalStandardDeductionMap = vi.fn();
const setStateStandardDeductionMap = vi.fn();
const setMax401KContribution = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
});

function options(
  federalTaxes: TaxData,
  stateTaxes: TaxData,
  USAState = "oregon",
  USACity = "",
) {
  const { result } = renderHook(() =>
    useGetTaxOptions({
      federalTaxes,
      stateTaxes,
      USACity,
      USAState,
      setFederalStandardDeductionMap,
      setStateStandardDeductionMap,
      setMax401KContribution,
    }),
  );
  return result.current;
}

const deductionMap = {
  single: 16100,
  married: 32200,
  married_separately: 16100,
  head_of_household: 24150,
} as TaxData[string];

describe("useGetTaxOptions", () => {
  it("turns each tax type into a selectable option", () => {
    const result = options(
      { [FEDERAL_INCOME]: {}, [SOCIAL_SECURITY]: {} } as TaxData,
      {} as TaxData,
    );
    expect(result).toEqual([
      { title: "Federal Income", value: FEDERAL_INCOME, disabled: false },
      { title: "Social Security", value: SOCIAL_SECURITY, disabled: false },
    ]);
  });

  it("qualifies the state income tax with the state's name", () => {
    const result = options({} as TaxData, { [STATE_INCOME]: {} } as TaxData);
    expect(result).toEqual([
      { title: "Oregon State Income", value: STATE_INCOME, disabled: false },
    ]);
  });

  // The two bookkeeping keys are not taxes. They ride along in the same object
  // and are lifted out into component state rather than offered as options.
  it("lifts the standard deduction out instead of listing it", () => {
    const result = options(
      { [STANDARD_DEDUCTION]: deductionMap } as TaxData,
      { [STANDARD_DEDUCTION]: deductionMap } as TaxData,
    );
    expect(result).toEqual([]);
    expect(setFederalStandardDeductionMap).toHaveBeenCalledWith(deductionMap);
    expect(setStateStandardDeductionMap).toHaveBeenCalledWith(deductionMap);
  });

  it("lifts the 401k limit out instead of listing it", () => {
    const result = options(
      { [MAX_401K_CONTRIBUTION]: 24500 } as TaxData,
      {} as TaxData,
    );
    expect(result).toEqual([]);
    expect(setMax401KContribution).toHaveBeenCalledWith(24500);
  });

  describe("city taxes", () => {
    const stateWithCities = {
      [STATE_INCOME]: {},
      [CITIES]: {
        portland: { [ART_TAX]: {} },
        eugene: { employee_payroll_tax: {} },
      },
    } as unknown as TaxData;

    it("appends only the selected city's taxes, titled with the city", () => {
      const result = options(
        {} as TaxData,
        stateWithCities,
        "oregon",
        "portland",
      );
      expect(result).toEqual([
        { title: "Oregon State Income", value: STATE_INCOME, disabled: false },
        { title: "Portland Art Tax", value: ART_TAX, disabled: false },
      ]);
    });

    it("offers no city taxes when no city is selected", () => {
      const result = options({} as TaxData, stateWithCities, "oregon", "");
      expect(result.map((option) => option.value)).toEqual([STATE_INCOME]);
    });

    // Reachable by hand-editing the URL to a city the state does not tax.
    it("offers no city taxes for a city the state has no data for", () => {
      const result = options({} as TaxData, stateWithCities, "oregon", "salem");
      expect(result.map((option) => option.value)).toEqual([STATE_INCOME]);
    });

    it("keeps city options last, after federal and state", () => {
      const result = options(
        { [FEDERAL_INCOME]: {} } as TaxData,
        stateWithCities,
        "oregon",
        "portland",
      );
      expect(result.map((option) => option.value)).toEqual([
        FEDERAL_INCOME,
        STATE_INCOME,
        ART_TAX,
      ]);
    });
  });

  it("survives missing tax data", () => {
    expect(
      options(undefined as unknown as TaxData, undefined as unknown as TaxData),
    ).toEqual([]);
  });
});
