import { getTaxDataByYear } from "@/get-tax-data";
import Home from "@/components/Home";
import path from "path";

type StaticParams = {
  year: string;
  state: string;
  city: string;
};

type CityProps = {
  params: StaticParams;
};

export default async function City({ params }: CityProps) {
  const { year, state, city } = params;

  const dataDirectory = path.join(process.cwd(), "src", "data");
  const { years, taxDataByYear, statesAndCitiesForYear } =
    await getTaxDataByYear(dataDirectory);

  const federalTaxes = taxDataByYear[year]?.federal || {};
  const stateTaxes = taxDataByYear[year]?.[params.state] || {};
  const availableStatesAndCities = statesAndCitiesForYear[year] || {};

  return (
    <Home
      availableYears={years}
      availableStatesAndCities={availableStatesAndCities}
      defaultFederalTaxes={federalTaxes}
      defaultStateTaxes={stateTaxes}
      defaultYear={year}
      defaultUSAState={state}
      defaultUSACity={city}
    />
  );
}

export async function generateStaticParams(): Promise<StaticParams[]> {
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
