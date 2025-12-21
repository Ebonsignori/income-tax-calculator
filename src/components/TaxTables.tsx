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
import { useEffect, useMemo, useState, useRef } from "react";
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
import {
  dashToSnakeCase,
  snakeToDashCase,
  snakeToTitleCase,
  toSnakeCase,
} from "@/utils/string-utils";
import { useGetTaxData } from "@/utils/get-tax-data";
import { asCurrency, formatNoZeros } from "@/utils/calculator";
import { NONE, STATE_INCOME } from "@/constants/tax_types";
import type { TaxDataSelectOption } from "./input/TaxDataSelect";
import { TaxDataSelect } from "./input/TaxDataSelect";
import { initEventTracking } from "@/utils/analytics";
import { getQueryParams, updateURL } from "@/utils/base-path";

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

  // Track if we've initialized from URL to prevent circular updates
  const isInitializedFromURL = useRef(false);
  // Track if we're currently updating from initialization to skip URL push
  const isUpdatingFromInit = useRef(false);
  // Track previous state and city to detect actual changes (initialize as undefined)
  const prevUSAState = useRef<string | undefined>(undefined);
  const prevUSACity = useRef<string | undefined>(undefined);

  const availableStatesAndCities = useMemo(() => {
    return statesAndCitiesForYear[year];
  }, [statesAndCitiesForYear, year]);

  useGetTaxData({
    year,
    USAState,
    setFederalTaxes,
    setStateTaxes,
    setUSAState,
    setUSACity,
    baseRoute: TAX_TABLES.route,
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

  // Handle browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      // Parse the current URL to extract year, state, and city
      const path = window.location.pathname;
      const basePath = (window as any).__NEXT_DATA__?.basePath || "";
      const relativePath = basePath ? path.replace(basePath, "") : path;

      // Remove /tax-tables prefix if present
      const pathWithoutBase = relativePath.startsWith("/tax-tables")
        ? relativePath.substring("/tax-tables".length)
        : relativePath;

      const segments = pathWithoutBase.split("/").filter(Boolean);

      // Update state based on URL segments
      if (segments.length >= 1 && segments[0] !== year) {
        setYear(segments[0]);
      } else if (segments.length === 0 && year !== defaultYear) {
        // If at root path (/tax-tables), set to current year
        setYear(defaultYear);
      }
      if (segments.length >= 2) {
        const stateFromUrl = segments[1].replace(/-/g, "_");
        if (stateFromUrl !== USAState) {
          setUSAState(stateFromUrl);
        }
      } else if (USAState) {
        setUSAState("");
      }
      if (segments.length >= 3) {
        const cityFromUrl = segments[2].replace(/-/g, "_");
        if (cityFromUrl !== USACity) {
          setUSACity(cityFromUrl);
        }
      } else if (USACity) {
        setUSACity("");
      }

      // Parse and restore selectedTaxes from query params
      const queryParams = getQueryParams();
      const tablesParam = queryParams.get("tables");
      if (tablesParam && taxOptions.length > 0) {
        // Convert dash-case query params to snake_case for matching
        const tableValues = tablesParam
          .split(",")
          .map((v) => dashToSnakeCase(v.trim()));
        const matchingTaxes = taxOptions.filter((option) =>
          tableValues.includes(option.value),
        );
        if (matchingTaxes.length > 0) {
          // Mark that we're updating from navigation (similar to initialization)
          isUpdatingFromInit.current = true;
          setSelectedTaxes(matchingTaxes);
        }
      } else {
        // If no tables param, clear selectedTaxes
        isUpdatingFromInit.current = true;
        setSelectedTaxes([]);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [year, USAState, USACity, defaultYear, taxOptions]);

  // Initialize selectedTaxes from URL query param on mount
  useEffect(() => {
    const queryParams = getQueryParams();
    const tablesParam = queryParams.get("tables");
    if (tablesParam && taxOptions.length > 0) {
      // Parse comma-separated tax table values and convert from dash-case to snake_case
      const tableValues = tablesParam
        .split(",")
        .map((v) => dashToSnakeCase(v.trim()));
      // Find matching TaxOption objects from taxOptions
      const matchingTaxes = taxOptions.filter((option) =>
        tableValues.includes(option.value),
      );
      if (matchingTaxes.length > 0) {
        // Mark that we're updating from initialization
        isUpdatingFromInit.current = true;
        setSelectedTaxes(matchingTaxes);
      }
    }
    // Mark as initialized and set initial ref values
    isInitializedFromURL.current = true;
    prevUSAState.current = USAState;
    prevUSACity.current = USACity;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taxOptions.length]);

  // Validate and filter selected taxes when taxOptions change (e.g., when state/city changes)
  useEffect(() => {
    if (isInitializedFromURL.current && taxOptions.length > 0) {
      // Filter out any selected taxes that are no longer valid
      const validSelectedTaxes = selectedTaxes.filter((selectedTax) =>
        taxOptions.some((option) => option.value === selectedTax.value),
      );

      // Only update if something was filtered out
      if (validSelectedTaxes.length !== selectedTaxes.length) {
        isUpdatingFromInit.current = true;
        setSelectedTaxes(validSelectedTaxes);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taxOptions]);

  // Clear selected taxes when state or city changes
  useEffect(() => {
    if (isInitializedFromURL.current) {
      // Only clear if state or city actually changed (not on initial mount)
      const stateChanged =
        prevUSAState.current !== undefined && prevUSAState.current !== USAState;
      const cityChanged =
        prevUSACity.current !== undefined && prevUSACity.current !== USACity;

      if (stateChanged || cityChanged) {
        // Don't push state when clearing due to navigation
        isUpdatingFromInit.current = true;
        setSelectedTaxes([]);
      }
    }

    // Always update refs for next comparison
    prevUSAState.current = USAState;
    prevUSACity.current = USACity;
  }, [USAState, USACity]);

  // Update URL when selectedTaxes changes (but not during initialization)
  useEffect(() => {
    // Skip URL update if we haven't initialized yet
    if (!isInitializedFromURL.current) {
      return;
    }

    // Skip URL update if this change is from initialization
    if (isUpdatingFromInit.current) {
      isUpdatingFromInit.current = false;
      return;
    }

    // Build the path based on current year, state, and city
    let path = `${TAX_TABLES.route}/${year}`;
    if (USAState) {
      path += `/${USAState.replace(/_/g, "-")}`;
      if (USACity) {
        path += `/${USACity.replace(/_/g, "-")}`;
      }
    }

    if (selectedTaxes.length > 0) {
      // Create comma-separated list of tax table values (convert to dash-case for URL)
      const tablesValue = selectedTaxes
        .map((tax) => snakeToDashCase(tax.value))
        .join(",");
      updateURL(path, { tables: tablesValue });
    } else {
      // If no tables selected, update URL without the tables param
      updateURL(path);
    }
  }, [selectedTaxes, year, USAState, USACity]);

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
      <Grid item xs={13} sm={6.5}>
        <TaxOptionsSelect
          label="Tax Tables to Display"
          taxOptions={taxOptions}
          selectedTaxOptions={selectedTaxes}
          setSelectedTaxOptions={setSelectedTaxes}
        />
      </Grid>
      <Grid item xs={13} sm={6.5}>
        <TaxDataSelect
          label="Tax Data to Display"
          taxData={taxDataOptions}
          selectedTaxData={selectedTaxData}
          setSelectedTaxData={setSelectedTaxData}
        />
      </Grid>
      <Grid container spacing={2} columns={12} sx={{ mt: 3 }}>
        {tables.map((table, index) => (
          <Grid item xs={12} key={index}>
            {RenderTable(table)}
          </Grid>
        ))}
      </Grid>
    </Grid>
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
