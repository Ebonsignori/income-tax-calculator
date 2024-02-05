import { getTaxDataByYear } from "@/get-tax-data";
import type {
  CityPageParams,
  StatePageParams,
  YearPageParams,
} from "@/types/page";
import path from "path";

export async function getYearPageParams(): Promise<YearPageParams[]> {
  const dataDirectory = path.join(process.cwd(), "src", "data");
  const { taxDataByYear } = await getTaxDataByYear(dataDirectory);

  return Object.keys(taxDataByYear).map((year) => {
    return { year };
  });
}

export async function getStatePageParams(): Promise<StatePageParams[]> {
  const dataDirectory = path.join(process.cwd(), "src", "data");
  const { taxDataByYear } = await getTaxDataByYear(dataDirectory);

  const yearsAndStates = [];
  for (const year of Object.keys(taxDataByYear)) {
    for (const state of Object.keys(taxDataByYear[year])) {
      if (state === "federal") {
        continue;
      }
      yearsAndStates.push({ year, state });
    }
  }

  return yearsAndStates;
}

export async function getCityPageParams(): Promise<CityPageParams[]> {
  const dataDirectory = path.join(process.cwd(), "src", "data");
  const { taxDataByYear } = await getTaxDataByYear(dataDirectory);

  const yearsStatesAndCities = [];
  for (const year of Object.keys(taxDataByYear)) {
    for (const state of Object.keys(taxDataByYear[year])) {
      if (state === "federal") {
        continue;
      }
      if (
        typeof taxDataByYear[year][state].cities === "undefined" ||
        Object.keys(taxDataByYear[year][state].cities as {})?.length === 0
      ) {
        continue;
      }
      for (const city of Object.keys(taxDataByYear[year][state].cities as {})) {
        yearsStatesAndCities.push({
          year,
          state,
          city,
        });
      }
    }
  }

  return yearsStatesAndCities;
}
