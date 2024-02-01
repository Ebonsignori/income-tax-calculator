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
import {
  capitalizeFirstLetter,
  snakeToTitleCase,
  yearDisplay,
} from "@/utils/string-utils";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import Autocomplete from "@mui/material/Autocomplete";
import { CITIES } from "@/constants";
import {
  MAX_401K_CONTRIBUTION,
  STANDARD_DEDUCTION,
} from "@/constants/tax_types";
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

type HomeProps = {
  availableYears: string[];
  availableStatesAndCities: AvailableStatesAndCities;
  defaultYear: string;
  defaultFederalTaxes: TaxData;
  defaultStateTaxes: TaxData;
  defaultUSAState?: string | undefined;
  defaultUSACity?: string;
};

export default function Home({
  availableYears,
  availableStatesAndCities,
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
  const [exemptTaxes, setExemptTaxes] = useState<string[]>([]);

  const [stateTaxes, setStateTaxes] = useState<TaxData>(defaultStateTaxes);
  const [federalTaxes, setFederalTaxes] =
    useState<TaxData>(defaultFederalTaxes);

  const [federalStandardDeductionMap, setFederalStandardDeductionMap] =
    useState<StandardDeductionMap>(EMPTY_STANDARD_DEDUCTION_MAP);
  const [stateStandardDeductionMap, setStateStandardDeductionMap] =
    useState<StandardDeductionMap>(EMPTY_STANDARD_DEDUCTION_MAP);

  const [max401KContribution, setMax401KContribution] = useState(0);

  const resetTotalStateDeductions = useCallback(() => {
    setTotalStateDeductions(stateStandardDeductionMap[filingStatus]);
  }, [stateStandardDeductionMap, filingStatus]);

  const resetTotalFederalDeductions = useCallback(() => {
    setTotalFederalDeductions(federalStandardDeductionMap[filingStatus]);
  }, [federalStandardDeductionMap, filingStatus]);

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
      const stateBrackets = await import(`@/data/${year}/state/${USAState}.ts`);
      setStateTaxes(stateBrackets.default);
    }
    fetchStateBrackets();
  }, [USAState, year]);

  const taxOptions = useMemo(() => {
    const cities = [] as any;
    const federal = Object.entries(federalTaxes).map(([key, value]) => {
      if (key === STANDARD_DEDUCTION) {
        setFederalStandardDeductionMap(value as StandardDeductionMap);
        return null;
      }
      if (key === MAX_401K_CONTRIBUTION) {
        setMax401KContribution(value as number);
        return null;
      }
      return {
        title: snakeToTitleCase(key),
        value: key,
        disabled: false,
      };
    });
    const state = Object.entries(stateTaxes).map(([key, value]) => {
      if (key === STANDARD_DEDUCTION) {
        setStateStandardDeductionMap(value as StandardDeductionMap);
        return null;
      }
      if (key === CITIES) {
        if (USACity && (value as any)[USACity]) {
          Object.entries((value as any)[USACity]).map(([key, value]) => {
            cities.push({
              title: snakeToTitleCase(`${USACity}_${key}`),
              value: key,
              disabled: false,
            });
          });
        }
        return null;
      }
      return {
        title: snakeToTitleCase(key),
        value: key,
        disabled: false,
      };
    });
    return [...federal, ...state, ...cities].filter((x) => x);
  }, [federalTaxes, stateTaxes, USACity]);

  const handleNumberChange = useCallback(
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
          setterFunction(0);
        }
      };
    },
    [],
  );

  const max401KContributionDisplay = useMemo(() => {
    return totalIRA === max401KContribution ? `Max 401K contribution` : " ";
  }, [totalIRA, max401KContribution]);

  const standardStateDeductionDisplay = useMemo(() => {
    return stateStandardDeductionMap?.[filingStatus] === totalStateDeductions
      ? `Standard deduction for ${yearDisplay(year)}`
      : " ";
  }, [stateStandardDeductionMap, filingStatus, totalStateDeductions, year]);

  const standardFederalDeductionDisplay = useMemo(() => {
    return federalStandardDeductionMap?.[filingStatus] ===
      totalFederalDeductions
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

  return (
    <>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid xs={12} sm={6} md={6}>
          <Box>
            <FormControl fullWidth>
              <InputLabel htmlFor="outlined-adornment-total-income">
                Total Income
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-total-income"
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
                value={Math.cbrt(totalIncome)}
                min={1}
                step={1}
                max={215}
                sx={{ padding: "0 !important", width: "80%", mt: 1.5 }}
                onChange={(event: Event, newValue: number | number[]) => {
                  if (typeof newValue === "number") {
                    setTotalIncome(newValue ** 3);
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
        <Grid xs={12} sm={6} md={4}>
          <StateSelect
            availableStatesAndCities={availableStatesAndCities}
            year={year}
            USAState={USAState}
            setUSAState={setUSAState}
            setUSACity={setUSACity}
          />
        </Grid>
        <Grid xs={12} sm={6} md={4}>
          <CitySelect
            availableStatesAndCities={availableStatesAndCities}
            year={year}
            USACity={USACity}
            USAState={USAState}
            setUSACity={setUSACity}
          />
        </Grid>
        <Grid xs={12} sm={12} md={4}>
          <Autocomplete
            id="exempt-select"
            multiple
            isOptionEqualToValue={(option, value) => {
              return option.value === value.value;
            }}
            options={taxOptions}
            getOptionLabel={(option) =>
              capitalizeFirstLetter(option?.title || "")
            }
            freeSolo={false}
            getOptionDisabled={(option) => option?.disabled}
            value={exemptTaxes}
            onChange={(e, val) => {
              if (val) setExemptTaxes(val);
            }}
            renderInput={(params) => {
              const { key, ...props } = params as any;
              return (
                <TextField
                  key={props.id || key}
                  {...props}
                  label="Tax Exemptions"
                  variant="standard"
                />
              );
            }}
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
                      label="401k/IRA Contributions"
                      aria-label="401k/IRA Contributions"
                      helperText={max401KContributionDisplay}
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
                      label="Total Federal Deductions"
                      aria-label="Total Federal Deductions"
                      helperText={standardFederalDeductionDisplay}
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
                          standardFederalDeductionDisplay === " " ? (
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
                      label="Total State Deductions"
                      aria-label="Total State Deductions"
                      helperText={standardStateDeductionDisplay}
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
                          standardStateDeductionDisplay === " " ? (
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
      <Results
        federalTaxes={federalTaxes}
        stateTaxes={stateTaxes}
        totalIncome={totalIncome}
        filingStatus={filingStatus}
        totalIRA={totalIRA}
        totalFederalDeductions={totalFederalDeductions}
        totalStateDeductions={totalStateDeductions}
        exemptTaxes={exemptTaxes}
        USACity={USACity}
        USAState={USAState}
      />
    </>
  );
}
