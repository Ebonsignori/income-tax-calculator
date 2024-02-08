import { getTaxDataByYear } from "@/get-tax-data";
import type { CityPageParams, StatePageParams } from "@/types/page";
import path from "path";
import { toSnakeCase } from "./string-utils";

export async function getLandingPageData() {
  const dataDirectory = path.join(process.cwd(), "src", "data");
  const { years, currentYear, taxDataByYear, statesAndCitiesForYear } =
    await getTaxDataByYear(dataDirectory);

  const federalTaxes = taxDataByYear[currentYear]?.federal || {};
  const stateTaxes = {};

  return {
    availableYears: years,
    statesAndCitiesForYear,
    defaultFederalTaxes: federalTaxes,
    defaultStateTaxes: stateTaxes,
    defaultYear: currentYear,
  };
}

export async function getYearPageData(params: { year: string }) {
  const { year } = params;
  const dataDirectory = path.join(process.cwd(), "src", "data");
  const { years, taxDataByYear, statesAndCitiesForYear } =
    await getTaxDataByYear(dataDirectory);

  const federalTaxes = taxDataByYear[year]?.federal || {};
  const stateTaxes = {};

  return {
    availableYears: years,
    statesAndCitiesForYear,
    defaultFederalTaxes: federalTaxes,
    defaultStateTaxes: stateTaxes,
    defaultYear: year,
  };
}

export async function getStatePageData(params: StatePageParams) {
  const { year } = params;
  const state = toSnakeCase(params.state);
  const dataDirectory = path.join(process.cwd(), "src", "data");
  const { years, taxDataByYear, statesAndCitiesForYear } =
    await getTaxDataByYear(dataDirectory);

  const federalTaxes = taxDataByYear[year]?.federal || {};
  const stateTaxes = taxDataByYear[year]?.[params.state] || {};

  return {
    availableYears: years,
    statesAndCitiesForYear,
    defaultFederalTaxes: federalTaxes,
    defaultStateTaxes: stateTaxes,
    defaultYear: year,
    defaultUSAState: state,
  };
}

export async function getCityPageData(params: CityPageParams) {
  const { year } = params;
  const state = toSnakeCase(params.state);
  const city = toSnakeCase(params.city);

  const dataDirectory = path.join(process.cwd(), "src", "data");
  const { years, taxDataByYear, statesAndCitiesForYear } =
    await getTaxDataByYear(dataDirectory);

  const federalTaxes = taxDataByYear[year]?.federal || {};
  const stateTaxes = taxDataByYear[year]?.[params.state] || {};

  return {
    availableYears: years,
    statesAndCitiesForYear,
    defaultFederalTaxes: federalTaxes,
    defaultStateTaxes: stateTaxes,
    defaultYear: year,
    defaultUSAState: state,
    defaultUSACity: city,
  };
}
