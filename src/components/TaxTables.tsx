"use client";

import { Grid } from "@mui/material";
import { YearSelect } from "./input/YearSelect";
import { StateSelect } from "./input/StateSelect";
import { CitySelect } from "./input/CitySelect";
import { AvailableStatesAndCities, TaxData } from "@/types";
import { useState } from "react";
import { TAX_TABLES } from "@/constants/pages";

type TaxTableProps = {
  availableYears: string[];
  availableStatesAndCities: AvailableStatesAndCities;
  defaultYear: string;
  defaultFederalTaxes: TaxData;
  defaultStateTaxes: TaxData;
  defaultUSAState?: string | undefined;
  defaultUSACity?: string;
};

export default function TaxTables({
  availableYears,
  availableStatesAndCities,
  defaultFederalTaxes,
  defaultStateTaxes,
  defaultYear,
  defaultUSAState,
  defaultUSACity,
}: TaxTableProps) {
  const [USACity, setUSACity] = useState(defaultUSACity || "");
  const [USAState, setUSAState] = useState(defaultUSAState || "");
  const [year, setYear] = useState(defaultYear);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6} md={6}>
        <YearSelect
          availableYears={availableYears}
          year={year}
          USACity={USACity}
          USAState={USAState}
          setYear={setYear}
          baseRoute={TAX_TABLES.route}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <StateSelect
          availableStatesAndCities={availableStatesAndCities}
          year={year}
          USAState={USAState}
          setUSAState={setUSAState}
          setUSACity={setUSACity}
          baseRoute={TAX_TABLES.route}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <CitySelect
          availableStatesAndCities={availableStatesAndCities}
          year={year}
          USACity={USACity}
          USAState={USAState}
          setUSACity={setUSACity}
          baseRoute={TAX_TABLES.route}
        />
      </Grid>
      <Grid item xs={12}>
        <h1>TODO: Tax Tables</h1>
      </Grid>
    </Grid>
  );
}

export async function generateStaticParams() {
  return [];
}
