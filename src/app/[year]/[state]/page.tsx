import Home from "@/components/Home";
import { getTaxDataByYear } from "@/get-tax-data";
import path from "path";

type StaticParams = {
  year: string;
  state: string;
  city?: string;
};

type StateProps = {
  params: StaticParams;
};

export default async function State({ params }: StateProps) {
  const { year, state } = params;
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
    />
  );
}

export async function generateStaticParams(): Promise<StaticParams[]> {
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
