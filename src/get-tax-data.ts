// Read every file in the data directory and parse the data into a JSON object

import { promises as fs } from "fs";
import path from "path";

import type { TaxData } from "./types";

const yearPattern = /^\d{4}$/;

type TaxDataByYear = {
  [year: string]: { federal: TaxData; [state: string]: TaxData };
};
const taxDataByYear: TaxDataByYear = {} as TaxDataByYear;

type StatesAndCitiesForYear = {
  [year: string]: { [state: string]: { cities: string[] } };
};

export async function getTaxDataByYear(dataDirectory: string): Promise<{
  taxDataByYear: TaxDataByYear;
  statesAndCitiesForYear: StatesAndCitiesForYear;
  years: string[];
  currentYear: string;
}> {
  const yearFiles = (await fs.readdir(dataDirectory))
    .filter((yearFile: string) => yearPattern.test(yearFile))
    .sort((a, b) => (parseInt(a, 10) > parseInt(b, 10) ? -1 : 1));
  const years = [];
  const statesAndCitiesForYear: StatesAndCitiesForYear = {};

  for (const year of yearFiles) {
    const files = await fs.readdir(path.join(dataDirectory, year));
    if (files.includes("federal.ts")) {
      years.push(year);
      taxDataByYear[year] = {} as TaxDataByYear[typeof year];
      const federalTaxData = await import(`./data/${year}/federal.ts`);
      taxDataByYear[year]["federal"] = federalTaxData.default;
      if (files.includes("state")) {
        const states = await fs.readdir(
          path.join(dataDirectory, year, "state"),
        );
        for (const state of states) {
          const stateTaxData = await import(`./data/${year}/state/${state}`);
          const stateName = state.replace(".ts", "");
          taxDataByYear[year][stateName] = stateTaxData.default;
          if (!statesAndCitiesForYear[year]) {
            statesAndCitiesForYear[year] = {};
          }
          statesAndCitiesForYear[year][stateName] = { cities: [] };
          if (
            typeof taxDataByYear[year][stateName]?.cities === "undefined" ||
            !Object.keys(taxDataByYear[year][stateName].cities as {})?.length
          ) {
            continue;
          }
          for (const city of Object.keys(
            taxDataByYear[year][stateName].cities as {},
          )) {
            if (city) {
              statesAndCitiesForYear[year][stateName].cities.push(city);
            }
          }
        }
      }
    }
  }

  const currentYear = years[0];

  return { taxDataByYear, statesAndCitiesForYear, years, currentYear };
}
