import { getTaxDataByYear } from "@/get-tax-data";
import { CityPageParams, StatePageParams } from "@/types/page";
import path from "path";

export async function getLandingPageData() {
  const dataDirectory = path.join(process.cwd(), "src", "data");
  const { years, currentYear, taxDataByYear, statesAndCitiesForYear } =
    await getTaxDataByYear(dataDirectory);

  const federalTaxes = taxDataByYear[currentYear]?.federal || {};
  const stateTaxes = {};
  const availableStatesAndCities = statesAndCitiesForYear[currentYear] || {};

  return {
    availableYears: years,
    availableStatesAndCities,
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
  const availableStatesAndCities = statesAndCitiesForYear[year] || {};

  return {
    availableYears: years,
    availableStatesAndCities,
    defaultFederalTaxes: federalTaxes,
    defaultStateTaxes: stateTaxes,
    defaultYear: year,
  };
}

export async function getStatePageData(params: StatePageParams) {
  const { year, state } = params;
  const dataDirectory = path.join(process.cwd(), "src", "data");
  const { years, taxDataByYear, statesAndCitiesForYear } =
    await getTaxDataByYear(dataDirectory);

  const federalTaxes = taxDataByYear[year]?.federal || {};
  const stateTaxes = taxDataByYear[year]?.[params.state] || {};
  const availableStatesAndCities = statesAndCitiesForYear[year] || {};

  return {
    availableYears: years,
    availableStatesAndCities,
    defaultFederalTaxes: federalTaxes,
    defaultStateTaxes: stateTaxes,
    defaultYear: year,
    defaultUSAState: state,
  };
}

export async function getCityPageData(params: CityPageParams) {
  const { year, state, city } = params;

  const dataDirectory = path.join(process.cwd(), "src", "data");
  const { years, taxDataByYear, statesAndCitiesForYear } =
    await getTaxDataByYear(dataDirectory);

  const federalTaxes = taxDataByYear[year]?.federal || {};
  const stateTaxes = taxDataByYear[year]?.[params.state] || {};
  const availableStatesAndCities = statesAndCitiesForYear[year] || {};

  return {
    availableYears: years,
    availableStatesAndCities,
    defaultFederalTaxes: federalTaxes,
    defaultStateTaxes: stateTaxes,
    defaultYear: year,
    defaultUSAState: state,
    defaultUSACity: city,
  };
}
