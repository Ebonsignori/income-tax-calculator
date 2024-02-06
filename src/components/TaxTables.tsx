"use client";

import {
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { YearSelect } from "./input/YearSelect";
import { StateSelect } from "./input/StateSelect";
import { CitySelect } from "./input/CitySelect";
import type { AvailableStatesAndCities, TaxData } from "@/types";
import { useMemo, useState } from "react";
import { TAX_TABLES } from "@/constants/pages";
import { TaxOptionsSelect } from "./input/TaxOptionsSelect";
import type { StandardDeductionMap } from "@/constants/filing-status";
import {
  ALL,
  EMPTY_STANDARD_DEDUCTION_MAP,
  FILING_STATUSES,
} from "@/constants/filing-status";
import { CITIES, INFINITY } from "@/constants";
import type { TaxOption } from "@/utils/get-tax-options";
import { useGetTaxOptions } from "@/utils/get-tax-options";
import { snakeToTitleCase, toSnakeCase } from "@/utils/string-utils";
import { useGetTaxData } from "@/utils/get-tax-data";
import { asCurrency, formatNoZeros } from "@/utils/calculator";
import { NONE, STATE_INCOME } from "@/constants/tax_types";
import type { TaxDataSelectOption } from "./input/TaxDataSelect";
import { TaxDataSelect } from "./input/TaxDataSelect";
import { initEventTracking } from "@/utils/analytics";

type TaxTableProps = {
  availableYears: string[];
  statesAndCitiesForYear: { [year: string]: AvailableStatesAndCities };
  defaultYear: string;
  defaultFederalTaxes: TaxData;
  defaultStateTaxes: TaxData;
  defaultUSAState?: string | undefined;
  defaultUSACity?: string;
};

const taxDataMap = {
  standardFederalDeductions: () => "Standard Federal Deductions",
  standardStateDeductions: (state: string) =>
    `Standard ${snakeToTitleCase(state)} Deductions`,
  max401kContributions: () => "Max 401(k) Contributions",
};

export default function TaxTables({
  availableYears,
  statesAndCitiesForYear,
  defaultFederalTaxes,
  defaultStateTaxes,
  defaultYear,
  defaultUSAState,
  defaultUSACity,
}: TaxTableProps) {
  const [year, setYear] = useState(defaultYear);
  const [USAState, setUSAState] = useState(defaultUSAState || "");
  const [USACity, setUSACity] = useState(defaultUSACity || "");

  const [stateTaxes, setStateTaxes] = useState<TaxData>(defaultStateTaxes);
  const [federalTaxes, setFederalTaxes] =
    useState<TaxData>(defaultFederalTaxes);

  const [selectedTaxes, setSelectedTaxes] = useState<TaxOption[]>(
    [] as TaxOption[],
  );

  const [selectedTaxData, setSelectedTaxData] = useState<TaxDataSelectOption[]>(
    [] as TaxDataSelectOption[],
  );

  const [federalStandardDeductionMap, setFederalStandardDeductionMap] =
    useState<StandardDeductionMap>(EMPTY_STANDARD_DEDUCTION_MAP);
  const [stateStandardDeductionMap, setStateStandardDeductionMap] =
    useState<StandardDeductionMap>(EMPTY_STANDARD_DEDUCTION_MAP);

  const [max401KContribution, setMax401KContribution] = useState(0);

  const availableStatesAndCities = useMemo(() => {
    return statesAndCitiesForYear[year];
  }, [statesAndCitiesForYear, year]);

  useGetTaxData({
    year,
    USAState,
    setFederalTaxes,
    setStateTaxes,
  });

  const taxOptions = useGetTaxOptions({
    federalTaxes,
    stateTaxes,
    USACity,
    USAState,
    setFederalStandardDeductionMap,
    setStateStandardDeductionMap,
    setMax401KContribution,
  });

  const taxDataOptions = useMemo(() => {
    const taxDataOptions = [] as TaxDataSelectOption[];
    if (federalStandardDeductionMap) {
      taxDataOptions.push({
        title: taxDataMap.standardFederalDeductions(),
      });
    }
    if (stateStandardDeductionMap && USAState) {
      taxDataOptions.push({
        title: taxDataMap.standardStateDeductions(USAState),
      });
    }
    if (max401KContribution) {
      taxDataOptions.push({
        title: taxDataMap.max401kContributions(),
      });
    }
    return taxDataOptions;
  }, [
    federalStandardDeductionMap,
    stateStandardDeductionMap,
    USAState,
    max401KContribution,
  ]);

  const taxTables = useMemo(() => {
    const tables: Table[] = [] as Table[];

    for (const selectedTax of selectedTaxes) {
      const tax = selectedTax.value as keyof TaxData;
      if (federalTaxes[tax]) {
        tables.push(tableDataFromTaxData(tax, federalTaxes[tax]));
      }
      if (stateTaxes[tax]) {
        const name = tax === STATE_INCOME ? `${USAState}_${tax}` : tax;
        tables.push(tableDataFromTaxData(name, stateTaxes[tax]));
      }
      if (stateTaxes?.[CITIES]?.[USACity]?.[tax]) {
        tables.push(
          tableDataFromTaxData(
            `${USACity}_${tax}`,
            stateTaxes[CITIES][USACity][tax],
          ),
        );
      }
    }

    return tables;
  }, [selectedTaxes, stateTaxes, federalTaxes, USACity, USAState]);

  const taxDataTables = useMemo(() => {
    const tables: Table[] = [] as Table[];

    for (const selectedData of selectedTaxData) {
      if (selectedData.title === taxDataMap.standardFederalDeductions()) {
        tables.push(
          standardDeductionMapToTable(
            selectedData.title,
            federalStandardDeductionMap,
          ),
        );
      } else if (
        selectedData.title === taxDataMap.standardStateDeductions(USAState)
      ) {
        tables.push(
          standardDeductionMapToTable(
            selectedData.title,
            stateStandardDeductionMap,
          ),
        );
      } else if (selectedData.title === taxDataMap.max401kContributions()) {
        tables.push({
          name: selectedData.title,
          headers: ["Federal Amount"],
          rows: [[asCurrency(max401KContribution).toFormat(formatNoZeros)]],
        });
      }
    }

    return tables;
  }, [
    selectedTaxData,
    federalStandardDeductionMap,
    stateStandardDeductionMap,
    max401KContribution,
    USAState,
  ]);

  const tables = useMemo(() => {
    return taxTables.concat(taxDataTables);
  }, [taxTables, taxDataTables]);

  initEventTracking({
    selected_year: year,
    selected_state: USAState,
    selected_city: USACity,
  });

  return (
    <>
      <Grid container spacing={2} columns={13}>
        <Grid item xs={13} sm={3}>
          <YearSelect
            availableYears={availableYears}
            year={year}
            USACity={USACity}
            USAState={USAState}
            setYear={setYear}
            baseRoute={TAX_TABLES.route}
          />
        </Grid>
        <Grid item xs={13} sm={5}>
          <StateSelect
            availableStatesAndCities={availableStatesAndCities}
            year={year}
            USAState={USAState}
            setUSAState={setUSAState}
            setUSACity={setUSACity}
            baseRoute={TAX_TABLES.route}
          />
        </Grid>
        <Grid item xs={13} sm={5}>
          <CitySelect
            availableStatesAndCities={availableStatesAndCities}
            year={year}
            USACity={USACity}
            USAState={USAState}
            setUSACity={setUSACity}
            baseRoute={TAX_TABLES.route}
          />
        </Grid>
      </Grid>
      <Grid container spacing={2} columns={12}>
        <Grid item xs={12} sm={6}>
          <TaxOptionsSelect
            label="Tax Tables to Display"
            taxOptions={taxOptions}
            selectedTaxOptions={selectedTaxes}
            setSelectedTaxOptions={setSelectedTaxes}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TaxDataSelect
            label="Tax Data to Display"
            taxData={taxDataOptions}
            selectedTaxData={selectedTaxData}
            setSelectedTaxData={setSelectedTaxData}
          />
        </Grid>
      </Grid>
      <Grid container spacing={2} columns={12} sx={{ mt: 4 }}>
        {tables.map((table, index) => (
          <Grid item xs={12} key={index}>
            {RenderTable(table)}
          </Grid>
        ))}
      </Grid>
    </>
  );
}

type Table = {
  name: string;
  headers: string[];
  rows: (string | number)[][];
};

function RenderTable(table: Table) {
  const { name, headers, rows } = table;

  return (
    <>
      <Typography component="h2" variant="h5">
        {snakeToTitleCase(name)}
      </Typography>
      <TableContainer component={Paper} sx={{ border: 1, mt: 1, mb: 1 }}>
        <Table id={name}>
          <TableHead>
            <TableRow>
              {headers.map((header) => (
                <TableCell key={header}>{header}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => {
              return (
                <TableRow key={index} id={`${name}_row_${index}`}>
                  {row.map((cell, index) => (
                    <TableCell key={`${cell}-${index}`}>{cell}</TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

function tableDataFromTaxData(name: string, taxData: any): Table {
  if (taxData === NONE) {
    return {
      name,
      headers: ["No Taxes"],
      rows: [],
    };
  }

  let headers: string[] = [] as string[];
  let rows = [] as (string | number)[][];
  for (const [key, bracket] of Object.entries(taxData)) {
    if (key === ALL) {
      for (const status of FILING_STATUSES) {
        for (let i = 0; i < (bracket as any).length; i++) {
          if (!rows?.[i]) {
            rows.push([] as (string | number)[]);
          }
          const bracketItem = (bracket as any)[i];
          rows[i].push(...bracketItemToRow(bracketItem, i, headers, rows[i]));
        }
        headers.push(snakeToTitleCase(status));
      }
    } else {
      for (let i = 0; i < (bracket as any).length; i++) {
        if (!rows?.[i]) {
          rows.push([] as (string | number)[]);
        }
        const bracketItem = (bracket as any)[i];
        rows[i].push(...bracketItemToRow(bracketItem, i, headers, rows[i]));
      }
      headers.push(snakeToTitleCase(key));
    }
  }

  return {
    name,
    headers,
    rows,
  };
}

function bracketItemToRow(
  bracketItem: any,
  columnIndex: number,
  headers: string[],
  row: (string | number)[] = [] as (string | number)[],
): (string | number)[] {
  if (bracketItem?.amount) {
    return [`Fixed ${asCurrency(bracketItem.amount).toFormat(formatNoZeros)}`];
  } else if (bracketItem?.rate) {
    let newRow = [];
    if (!headers.length) {
      if (bracketItem?.percent_of_total) {
        headers.push("Employee Portion");
      }
      headers.push("Rate");
    }
    if (!row.length) {
      if (bracketItem?.percent_of_total) {
        newRow.push(`${bracketItem.percent_of_total}%`);
      }
      newRow.push(`${bracketItem.rate}%`);
    }
    const minValue = asCurrency(
      bracketItem.min + (columnIndex === 0 ? 0 : 1),
    ).toFormat(formatNoZeros);
    let range = `${minValue}+`;
    if (bracketItem.max !== INFINITY) {
      range = `${minValue} - ${asCurrency(bracketItem.max).toFormat(formatNoZeros)}`;
    }
    return [...newRow, range];
  }
  return [""];
}

function standardDeductionMapToTable(
  name: string,
  standardDeductionMap: StandardDeductionMap,
): Table {
  const rows = [] as (string | number)[][];
  const headers = ["Filing Status", "Amount"];
  for (const [filingStatus, amount] of Object.entries(standardDeductionMap)) {
    rows.push([
      snakeToTitleCase(filingStatus),
      asCurrency(amount).toFormat(formatNoZeros),
    ]);
  }

  return {
    name: toSnakeCase(name),
    headers,
    rows,
  };
}
