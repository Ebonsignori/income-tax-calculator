import { describe, it, expect } from "vitest";
import { collectBracketSchedules } from "@/utils/bracket-schedules";
import { SINGLE } from "@/constants/filing-status";
import type { FilingStatus } from "@/constants/filing-status";
import type { TaxData } from "@/types";
import federal2025 from "@/data/2025/federal";
import oregon2025 from "@/data/2025/state/oregon";
import texas2025 from "@/data/2025/state/texas";
import illinois2025 from "@/data/2025/state/illinois";

const collect = (stateTaxes: TaxData, state: string, city: string) =>
  collectBracketSchedules({
    federalTaxes: federal2025 as TaxData,
    stateTaxes,
    USAState: state,
    USACity: city,
    filingStatus: SINGLE as FilingStatus,
    grossIncome: 250_000,
    federalTaxableIncome: 235_000,
    stateTaxableIncome: 247_165,
  });

describe("collectBracketSchedules", () => {
  it("offers every federal schedule, not only income tax", () => {
    const keys = collect(texas2025 as TaxData, "texas", "").map((s) => s.key);
    expect(keys).toContain("federal:federal_income");
    expect(keys).toContain("federal:social_security");
    expect(keys).toContain("federal:medicare");
  });

  it("includes a city's own bracket schedules", () => {
    const found = collect(oregon2025 as TaxData, "oregon", "portland");
    const labels = found.map((s) => s.label);
    // Portland levies these on top of Oregon's income tax.
    expect(labels).toContain("Preschool for All (City)");
    expect(labels).toContain("Supportive Housing Services (City)");
  });

  it("keeps Portland's two preschool bands", () => {
    const preschool = collect(oregon2025 as TaxData, "oregon", "portland").find(
      (s) => s.key === "city:preschool_for_all",
    );
    expect(preschool?.brackets.map((b) => b.rate)).toEqual([1.5, 3]);
    expect(preschool?.brackets[0].min).toBe(125_000);
  });

  it("names the state's income tax after the state", () => {
    const labels = collect(oregon2025 as TaxData, "oregon", "").map(
      (s) => s.label,
    );
    expect(labels).toContain("Oregon State Income");
  });

  it("measures payroll taxes against gross and income taxes against taxable", () => {
    const found = collect(oregon2025 as TaxData, "oregon", "portland");
    // Social Security is levied on wages.
    expect(
      found.find((s) => s.key === "federal:social_security")?.taxableIncome,
    ).toBe(250_000);
    // Federal income tax is levied after federal deductions.
    expect(
      found.find((s) => s.key === "federal:federal_income")?.taxableIncome,
    ).toBe(235_000);
    // The state's own income tax uses the state's deductions.
    expect(
      found.find((s) => s.key === "state:state_income")?.taxableIncome,
    ).toBe(247_165);
  });

  it("leaves out a state with no income tax", () => {
    const keys = collect(texas2025 as TaxData, "texas", "").map((s) => s.key);
    expect(keys.some((key) => key.startsWith("state:"))).toBe(false);
  });

  it("keeps a flat single-band state, which is still a ladder", () => {
    const keys = collect(illinois2025 as TaxData, "illinois", "").map(
      (s) => s.key,
    );
    expect(keys).toContain("state:state_income");
  });

  it("leaves out flat fees, which are not banded", () => {
    // Portland's art tax is a fixed $35, not a rate across bands.
    const keys = collect(oregon2025 as TaxData, "oregon", "portland").map(
      (s) => s.key,
    );
    expect(keys).not.toContain("city:art_tax");
  });

  it("leaves out data that is not a tax", () => {
    const keys = collect(oregon2025 as TaxData, "oregon", "portland").map(
      (s) => s.key,
    );
    expect(keys.some((key) => key.includes("standard_deduction"))).toBe(false);
    expect(keys.some((key) => key.includes("max_401k"))).toBe(false);
    expect(keys.some((key) => key.endsWith(":cities"))).toBe(false);
  });

  it("orders federal, then state, then city", () => {
    const prefixes = collect(oregon2025 as TaxData, "oregon", "portland").map(
      (s) => s.key.split(":")[0],
    );
    const firstState = prefixes.indexOf("state");
    const firstCity = prefixes.indexOf("city");
    expect(prefixes[0]).toBe("federal");
    expect(firstState).toBeLessThan(firstCity);
  });

  it("omits city schedules when no city is selected", () => {
    const keys = collect(oregon2025 as TaxData, "oregon", "").map((s) => s.key);
    expect(keys.some((key) => key.startsWith("city:"))).toBe(false);
  });
});
