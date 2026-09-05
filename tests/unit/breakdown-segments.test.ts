import { describe, it, expect } from "vitest";
import { toBreakdownSegments } from "@/utils/breakdown-segments";
import { CITIES, EXEMPT } from "@/constants";
import type { TaxResultsWithCities } from "@/types";
import { asCurrency, toUnit } from "@/utils/money";

const federal: TaxResultsWithCities = {
  federal_income: asCurrency(18047),
  social_security: asCurrency(7440),
  medicare: asCurrency(1740),
};

const state: TaxResultsWithCities = {
  state_income: asCurrency(9950.94),
  oregon_transit_tax: asCurrency(120),
  [CITIES]: {
    art_tax: asCurrency(35),
  },
};

describe("toBreakdownSegments", () => {
  it("flattens federal, state and city taxes into one list", () => {
    const segments = toBreakdownSegments(federal, state);
    expect(segments.map((s) => s.id)).toEqual([
      "federal_income",
      "state_income",
      "social_security",
      "medicare",
      "oregon_transit_tax",
      "art_tax",
    ]);
  });

  it("sorts by amount, largest first", () => {
    const amounts = toBreakdownSegments(federal, state).map((s) =>
      toUnit(s.amount),
    );
    expect(amounts).toEqual([...amounts].sort((a, b) => b - a));
  });

  it("marks city taxes and labels them as such", () => {
    const artTax = toBreakdownSegments(federal, state).find(
      (s) => s.id === "art_tax",
    );
    expect(artTax?.isCity).toBe(true);
    expect(artTax?.label).toBe("Art Tax (City)");
  });

  it("does not treat the cities key as a tax of its own", () => {
    expect(
      toBreakdownSegments(federal, state).some((s) => s.id === CITIES),
    ).toBe(false);
  });

  it("omits exempt taxes", () => {
    const segments = toBreakdownSegments(
      { federal_income: asCurrency(100), social_security: EXEMPT },
      {},
    );
    expect(segments.map((s) => s.id)).toEqual(["federal_income"]);
  });

  it("omits taxes that come out to zero", () => {
    const segments = toBreakdownSegments(
      { federal_income: asCurrency(100), medicare: asCurrency(0) },
      {},
    );
    expect(segments.map((s) => s.id)).toEqual(["federal_income"]);
  });

  it("omits exempt and zero city taxes too", () => {
    const segments = toBreakdownSegments(
      {},
      {
        [CITIES]: {
          art_tax: EXEMPT,
          preschool_for_all: asCurrency(0),
          supportive_housing_services: asCurrency(1221.65),
        },
      },
    );
    expect(segments.map((s) => s.id)).toEqual(["supportive_housing_services"]);
  });

  it("lowercases small words in labels", () => {
    const segments = toBreakdownSegments(
      { oregon_paid_family_and_medical_leave: asCurrency(720) },
      {},
    );
    expect(segments[0].label).toBe("Oregon Paid Family and Medical Leave");
  });

  it("returns nothing when there is nothing to show", () => {
    expect(toBreakdownSegments({}, {})).toEqual([]);
  });
});
