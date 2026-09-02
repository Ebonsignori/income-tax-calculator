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
import { snakeToTitleCase } from "@/utils/string-utils";
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
import { useGetTaxData } from "@/utils/use-get-tax-data";
import { PaycheckFrequencySelect } from "./input/PaycheckFrequencySelect";
import type { PaycheckFrequency } from "@/constants/paycheck-frequency";
import { MONTHLY } from "@/constants/paycheck-frequency";
import { updateURL, getQueryParams } from "@/utils/base-path";
import { useUrlSelectionOnPopState } from "@/utils/url-selection";

/** `?income=` is user input; anything not a positive integer is ignored. */
function parseIncomeParam(value: string | null): number | null {
  if (!value) {
    return null;
  }
  const income = parseInt(value, 10);
  return !isNaN(income) && income > 0 ? income : null;
}

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
    const income = parseIncomeParam(getQueryParams().get("income"));
    if (income !== null) {
      setTotalIncome(income);
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

  useGetTaxData({
    year,
    USAState,
    setFederalTaxes,
    setStateTaxes,
    setUSAState,
    setUSACity,
  });

  useUrlSelectionOnPopState({
    year,
    defaultYear,
    setYear,
    USAState,
    setUSAState,
    USACity,
    setUSACity,
    onQueryParams: (params) => {
      const incomeParam = params.get("income");
      if (!incomeParam) {
        setTotalIncome(0);
        return;
      }
      const income = parseIncomeParam(incomeParam);
      if (income !== null) {
        setTotalIncome(income);
      }
    },
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

  const handleNumberChange = useCallback(
    (setterFunction: (value: number) => void) => {
      return (
        event: React.ChangeEvent<HTMLInputElement>,
        newValue?: number | string,
      ) => {
        let value: number | string = event.target.value;
        if (typeof newValue !== "undefined" && newValue !== null) {
          value = newValue;
        }
        if (!value) {
          setterFunction(0);
          return;
        }
        const numberValue =
          typeof value === "number" ? value : parseInt(value, 10);
        if (!isNaN(numberValue)) {
          // Nothing here is meaningful below zero, and a negative income
          // otherwise flows through to a negative take-home figure.
          setterFunction(Math.max(0, numberValue));
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
      ? `Standard deduction for ${year}`
      : " ";
  }, [stateStandardDeductionMap, filingStatus, totalStateDeductions, year]);

  const standardFederalDeductionDisplay = useMemo(() => {
    return federalStandardDeductionMap?.[filingStatus] ===
      totalFederalDeductions &&
      federalStandardDeductionMap?.[filingStatus] !== 0
      ? `Standard deduction for ${year}`
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
                              <Tooltip title={`Set to max allowed for ${year}`}>
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
                                title={`Set to standard deduction for ${year}`}
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
                                title={`Set to standard deduction for ${year}`}
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
