"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import MenuItem from "@mui/material/MenuItem";
import {
  EMPTY_STANDARD_DEDUCTION_MAP,
  FILING_STATUSES,
} from "@/constants/filing-status";
import type {
  FilingStatus,
  StandardDeductionMap,
} from "@/constants/filing-status";
import { snakeToTitleCase, yearDisplay } from "@/utils/string-utils";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import { Box, IconButton, Slider, Tooltip } from "@mui/material";
import type { AvailableStatesAndCities, TaxData } from "@/types";
import Results from "@/components/Results";
import { KeyboardDoubleArrowUp, RestartAlt } from "@mui/icons-material";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { StateSelect } from "./input/StateSelect";
import { CitySelect } from "./input/CitySelect";
import { YearSelect } from "./input/YearSelect";
import { TaxOptionsSelect } from "./input/TaxOptionsSelect";
import type { TaxOption } from "@/utils/get-tax-options";
import { useGetTaxOptions } from "@/utils/get-tax-options";
import { initEventTracking } from "@/utils/analytics";
import { PaycheckFrequencySelect } from "./input/PaycheckFrequencySelect";
import type { PaycheckFrequency } from "@/constants/paycheck-frequency";
import { MONTHLY } from "@/constants/paycheck-frequency";
import { updateURL, getQueryParams } from "@/utils/base-path";

type HomeProps = {
  availableYears: string[];
  statesAndCitiesForYear: { [year: string]: AvailableStatesAndCities };
  defaultYear: string;
  defaultFederalTaxes: TaxData;
  defaultStateTaxes: TaxData;
  defaultUSAState?: string | undefined;
  defaultUSACity?: string;
};

export default function Home({
  availableYears,
  statesAndCitiesForYear,
  defaultFederalTaxes,
  defaultStateTaxes,
  defaultYear,
  defaultUSAState,
  defaultUSACity,
}: HomeProps) {
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalIRA, setTotalIRA] = useState(0);

  const [totalFederalDeductions, setTotalFederalDeductions] = useState<
    number | undefined
  >(undefined); // undefined until user input
  const [totalStateDeductions, setTotalStateDeductions] = useState<
    number | undefined
  >(undefined); // undefined until user input
  const [USACity, setUSACity] = useState<string>(defaultUSACity || "");
  const [USAState, setUSAState] = useState(defaultUSAState || "");
  const [year, setYear] = useState(defaultYear);
  const [filingStatus, setFilingStatus] = useState<FilingStatus>("single");
  const [paycheckFrequency, setPaycheckFrequency] =
    useState<PaycheckFrequency>(MONTHLY);
  const [exemptTaxes, setExemptTaxes] = useState<TaxOption[]>(
    [] as TaxOption[],
  );

  const [stateTaxes, setStateTaxes] = useState<TaxData>(defaultStateTaxes);
  const [federalTaxes, setFederalTaxes] =
    useState<TaxData>(defaultFederalTaxes);

  const [federalStandardDeductionMap, setFederalStandardDeductionMap] =
    useState<StandardDeductionMap>(EMPTY_STANDARD_DEDUCTION_MAP);
  const [stateStandardDeductionMap, setStateStandardDeductionMap] =
    useState<StandardDeductionMap>(EMPTY_STANDARD_DEDUCTION_MAP);

  const [max401KContribution, setMax401KContribution] = useState(0);

  const availableStatesAndCities = useMemo(() => {
    return statesAndCitiesForYear[year];
  }, [statesAndCitiesForYear, year]);

  const resetTotalStateDeductions = useCallback(() => {
    setTotalStateDeductions(stateStandardDeductionMap[filingStatus]);
  }, [stateStandardDeductionMap, filingStatus]);

  const resetTotalFederalDeductions = useCallback(() => {
    setTotalFederalDeductions(federalStandardDeductionMap[filingStatus]);
  }, [federalStandardDeductionMap, filingStatus]);

  // Initialize income from URL query param on mount
  useEffect(() => {
    const queryParams = getQueryParams();
    const incomeParam = queryParams.get("income");
    if (incomeParam) {
      const incomeValue = parseInt(incomeParam, 10);
      if (!isNaN(incomeValue) && incomeValue > 0) {
        setTotalIncome(incomeValue);
      }
    }
  }, []);

  // Update URL when income changes
  useEffect(() => {
    if (totalIncome > 0) {
      // Build the path based on current year, state, and city
      let path = `/${year}`;
      if (USAState) {
        path += `/${USAState.replace(/_/g, "-")}`;
        if (USACity) {
          path += `/${USACity.replace(/_/g, "-")}`;
        }
      }
      // Use replaceHistory=true to avoid adding income changes to browser history
      updateURL(path, { income: totalIncome }, false, true);
    }
  }, [totalIncome, year, USAState, USACity]);

  useEffect(() => {
    if (federalStandardDeductionMap[filingStatus]) {
      resetTotalFederalDeductions();
    }
    if (stateStandardDeductionMap[filingStatus]) {
      resetTotalStateDeductions();
    }
  }, [
    filingStatus,
    federalStandardDeductionMap,
    stateStandardDeductionMap,
    resetTotalFederalDeductions,
    resetTotalStateDeductions,
  ]);

  useEffect(() => {
    if (
      typeof totalFederalDeductions === "undefined" &&
      federalStandardDeductionMap[filingStatus]
    ) {
      resetTotalFederalDeductions();
    }
    if (
      typeof totalStateDeductions === "undefined" &&
      stateStandardDeductionMap[filingStatus]
    ) {
      resetTotalStateDeductions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateStandardDeductionMap, federalStandardDeductionMap]);

  useEffect(() => {
    async function fetchFederalBrackets() {
      const federalBrackets = await import(`@/data/${year}/federal.ts`);
      setFederalTaxes(federalBrackets.default);
    }
    fetchFederalBrackets();
  }, [year]);

  useEffect(() => {
    async function fetchStateBrackets() {
      if (!USAState) {
        setStateTaxes({} as TaxData);
        return;
      }
      try {
        const stateBrackets = await import(
          `@/data/${year}/state/${USAState}.ts`
        );
        setStateTaxes(stateBrackets.default);
      } catch (error) {
        // If the state tax data doesn't exist for this year,
        // clear the state and city selections and update the URL
        console.warn(
          `Tax data not found for state "${USAState}" in year ${year}. Clearing state selection.`,
        );
        setStateTaxes({} as TaxData);
        setUSAState("");
        setUSACity("");
        // Update URL to just show the year without state/city
        updateURL(`/${year}`);
      }
    }
    fetchStateBrackets();
  }, [USAState, year]);

  // Handle browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      // Parse the current URL to extract year, state, and city
      const path = window.location.pathname;
      const basePath = (window as any).__NEXT_DATA__?.basePath || "";
      const relativePath = basePath ? path.replace(basePath, "") : path;
      const segments = relativePath.split("/").filter(Boolean);

      // Update state based on URL segments
      if (segments.length >= 1 && segments[0] !== year) {
        setYear(segments[0]);
      } else if (segments.length === 0 && year !== defaultYear) {
        // If at root path (/), set to current year
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

      // Parse and restore income from query params
      const queryParams = getQueryParams();
      const incomeParam = queryParams.get("income");
      if (incomeParam) {
        const incomeValue = parseInt(incomeParam, 10);
        if (!isNaN(incomeValue) && incomeValue > 0) {
          setTotalIncome(incomeValue);
        }
      } else {
        // If no income param, clear the income
        setTotalIncome(0);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [year, USAState, USACity, defaultYear]);

  const taxOptions = useGetTaxOptions({
    federalTaxes,
    stateTaxes,
    USACity,
    USAState,
    setFederalStandardDeductionMap,
    setStateStandardDeductionMap,
    setMax401KContribution,
  });

  const handleNumberChange = useCallback(
    // eslint-disable-next-line no-unused-vars
    (setterFunction: (...args: any) => void) => {
      return (event: React.ChangeEvent<HTMLInputElement>, newValue?: any) => {
        let value = event.target.value;
        if (newValue) {
          value = newValue;
        }
        const numberValue = parseInt(value, 10);
        if (!isNaN(numberValue)) {
          setterFunction(numberValue);
        } else if (!value) {
          setterFunction("");
        }
      };
    },
    [],
  );

  const max401KContributionDisplay = useMemo(() => {
    return totalIRA === max401KContribution ? `Max 401K contribution` : " ";
  }, [totalIRA, max401KContribution]);

  const standardStateDeductionDisplay = useMemo(() => {
    return stateStandardDeductionMap?.[filingStatus] === totalStateDeductions &&
      stateStandardDeductionMap?.[filingStatus] !== 0
      ? `Standard deduction for ${yearDisplay(year)}`
      : " ";
  }, [stateStandardDeductionMap, filingStatus, totalStateDeductions, year]);

  const standardFederalDeductionDisplay = useMemo(() => {
    return federalStandardDeductionMap?.[filingStatus] ===
      totalFederalDeductions &&
      federalStandardDeductionMap?.[filingStatus] !== 0
      ? `Standard deduction for ${yearDisplay(year)}`
      : " ";
  }, [federalStandardDeductionMap, filingStatus, totalFederalDeductions, year]);

  const validateAll = useCallback(() => {
    if (totalIRA > max401KContribution) {
      setTotalIRA(max401KContribution);
    }
  }, [totalIRA, max401KContribution]);
  useEffect(() => {
    validateAll();
  }, [validateAll]);

  initEventTracking({
    selected_year: year,
    selected_state: USAState,
    selected_city: USACity,
  });

  let resultsRender = null;
  if (totalIncome) {
    resultsRender = (
      <Results
        federalTaxes={federalTaxes}
        stateTaxes={stateTaxes}
        totalIncome={totalIncome}
        filingStatus={filingStatus}
        totalIRA={totalIRA}
        totalFederalDeductions={totalFederalDeductions as number}
        totalStateDeductions={totalStateDeductions as number}
        exemptTaxes={exemptTaxes}
        USACity={USACity}
        USAState={USAState}
        paycheckFrequency={paycheckFrequency}
      />
    );
  }

  return (
    <>
      <Grid container spacing={2} sx={{ mb: 2 }} component="main">
        <Grid xs={12} sm={6} md={6}>
          <Box>
            <FormControl fullWidth>
              <InputLabel htmlFor="total-income">Total Income</InputLabel>
              <OutlinedInput
                id="total-income"
                type="number"
                value={totalIncome}
                onChange={handleNumberChange(setTotalIncome)}
                startAdornment={
                  <InputAdornment position="start">$</InputAdornment>
                }
                label="Total Income"
              />
            </FormControl>
            <Box display="flex" justifyContent="center">
              <Slider
                aria-label="Total Income"
                value={Math.cbrt(totalIncome)}
                min={1}
                step={1}
                max={215}
                sx={{ padding: "0 !important", width: "80%", mt: 1.5 }}
                onChange={(event: Event, newValue: number | number[]) => {
                  if (typeof newValue === "number") {
                    const newIncome = Math.round(Math.pow(newValue, 3));
                    setTotalIncome(newIncome);
                  }
                }}
              />
            </Box>
          </Box>
        </Grid>
        <Grid xs={12} sm={3} md={3} display="flex" justifyContent="center">
          <YearSelect
            availableYears={availableYears}
            USACity={USACity}
            USAState={USAState}
            year={year}
            setYear={setYear}
          />
        </Grid>
        <Grid xs={12} sm={3} md={3}>
          <TextField
            id="filing-status-select"
            select
            label="Filing Status"
            value={filingStatus}
            onChange={(e) => {
              setFilingStatus(e.target.value as FilingStatus);
            }}
            fullWidth
            variant="standard"
          >
            {FILING_STATUSES.map((option) => (
              <MenuItem key={option} value={option}>
                {snakeToTitleCase(option)}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid xs={12} sm={6} md={6}>
          <StateSelect
            availableStatesAndCities={availableStatesAndCities}
            year={year}
            USAState={USAState}
            setUSAState={setUSAState}
            setUSACity={setUSACity}
          />
        </Grid>
        <Grid xs={12} sm={6} md={6}>
          <CitySelect
            availableStatesAndCities={availableStatesAndCities}
            year={year}
            USACity={USACity}
            USAState={USAState}
            setUSACity={setUSACity}
          />
        </Grid>
        <Grid xs={12} sm={6} md={6}>
          <PaycheckFrequencySelect
            paycheckFrequency={paycheckFrequency}
            setPaycheckFrequency={setPaycheckFrequency}
          />
        </Grid>
        <Grid xs={12} sm={6} md={6}>
          <TaxOptionsSelect
            label="Tax Exemptions"
            taxOptions={taxOptions}
            selectedTaxOptions={exemptTaxes}
            setSelectedTaxOptions={setExemptTaxes}
          />
        </Grid>
        <Grid xs={12} sx={{ mt: 2 }}>
          <Accordion sx={{ border: 1 }}>
            <AccordionSummary
              expandIcon={<ArrowDownwardIcon />}
              id="deductions-header"
              aria-controls="deductions-content"
            >
              <Typography>Deductions</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid xs={12} sm={12} md={4}>
                  <FormControl fullWidth sx={{ mt: 2 }}>
                    <TextField
                      id="401k-ira-contributions"
                      label="401k/IRA Contributions"
                      type="number"
                      helperText={max401KContributionDisplay}
                      FormHelperTextProps={{
                        id: "401k-helper-text",
                      }}
                      inputProps={{
                        "aria-describedby": "401k-helper-text",
                      }}
                      value={totalIRA}
                      onChange={handleNumberChange(setTotalIRA)}
                      onBlur={validateAll}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">$</InputAdornment>
                        ),
                        endAdornment:
                          max401KContributionDisplay === " " ? (
                            <InputAdornment position="end">
                              <Tooltip
                                title={`Set to max allowed for ${yearDisplay(
                                  year,
                                )}`}
                              >
                                <IconButton
                                  aria-label="Set to max allowed for year"
                                  onClick={() => {
                                    setTotalIRA(max401KContribution);
                                  }}
                                  edge="end"
                                >
                                  <KeyboardDoubleArrowUp />
                                </IconButton>
                              </Tooltip>
                            </InputAdornment>
                          ) : null,
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid xs={12} sm={6} md={4}>
                  <FormControl fullWidth sx={{ mt: 2 }}>
                    <TextField
                      id="total-federal-deductions"
                      label="Total Federal Deductions"
                      type="number"
                      helperText={standardFederalDeductionDisplay}
                      FormHelperTextProps={{
                        id: "federal-deductions-helper-text",
                      }}
                      inputProps={{
                        "aria-describedby": "federal-deductions-helper-text",
                      }}
                      value={
                        typeof totalFederalDeductions === "undefined"
                          ? 0
                          : totalFederalDeductions
                      }
                      onChange={handleNumberChange(setTotalFederalDeductions)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">$</InputAdornment>
                        ),
                        endAdornment:
                          standardFederalDeductionDisplay === " " &&
                          federalStandardDeductionMap?.[filingStatus] !== 0 &&
                          totalFederalDeductions ? (
                            <InputAdornment position="end">
                              <Tooltip
                                title={`Set to standard deduction for ${yearDisplay(
                                  year,
                                )}`}
                              >
                                <IconButton
                                  aria-label="Reset to standard deduction for year"
                                  onClick={() => {
                                    resetTotalFederalDeductions();
                                  }}
                                  edge="end"
                                >
                                  <RestartAlt />
                                </IconButton>
                              </Tooltip>
                            </InputAdornment>
                          ) : (
                            ""
                          ),
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid xs={12} sm={6} md={4}>
                  <FormControl fullWidth sx={{ mt: 2 }}>
                    <TextField
                      id="total-state-deductions"
                      label="Total State Deductions"
                      type="number"
                      helperText={standardStateDeductionDisplay}
                      FormHelperTextProps={{
                        id: "state-deductions-helper-text",
                      }}
                      inputProps={{
                        "aria-describedby": "state-deductions-helper-text",
                      }}
                      value={
                        typeof totalStateDeductions === "undefined"
                          ? 0
                          : totalStateDeductions
                      }
                      onChange={handleNumberChange(setTotalStateDeductions)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">$</InputAdornment>
                        ),
                        endAdornment:
                          standardStateDeductionDisplay === " " &&
                          stateStandardDeductionMap?.[filingStatus] !== 0 ? (
                            <InputAdornment position="end">
                              <Tooltip
                                title={`Set to standard deduction for ${yearDisplay(
                                  year,
                                )}`}
                              >
                                <IconButton
                                  aria-label="Reset to standard deduction for year"
                                  onClick={() => {
                                    resetTotalStateDeductions();
                                  }}
                                  edge="end"
                                >
                                  <RestartAlt />
                                </IconButton>
                              </Tooltip>
                            </InputAdornment>
                          ) : (
                            ""
                          ),
                      }}
                    />
                  </FormControl>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Grid>
      </Grid>
      {resultsRender}
    </>
  );
}
