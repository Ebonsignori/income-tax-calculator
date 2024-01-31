import Home from "@/components/Home";
import { getTaxDataByYear } from "@/get-tax-data";
import path from "path";

type YearProps = { params: { year: string } };

export default async function Year({ params }: YearProps) {
  const { year } = params;
  const dataDirectory = path.join(process.cwd(), "src", "data");
  const { years, taxDataByYear, statesAndCitiesForYear } =
    await getTaxDataByYear(dataDirectory);

  const federalTaxes = taxDataByYear[year]?.federal || {};
  const stateTaxes = {};
  const availableStatesAndCities = statesAndCitiesForYear[year] || {};
  return (
    <Home
      availableYears={years}
      availableStatesAndCities={availableStatesAndCities}
      defaultFederalTaxes={federalTaxes}
      defaultStateTaxes={stateTaxes}
      defaultYear={year}
    />
  );
}

export async function generateStaticParams() {
  const dataDirectory = path.join(process.cwd(), "src", "data");
  const { taxDataByYear } = await getTaxDataByYear(dataDirectory);

  return Object.keys(taxDataByYear).map((year) => {
    return { year };
  });
}
