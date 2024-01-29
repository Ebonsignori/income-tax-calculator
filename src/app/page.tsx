"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import NextLink from "next/link";
import Copyright from "@/components/Copyright";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import MenuItem from "@mui/material/MenuItem";
import { CURRENT_YEAR, YEARS, Year } from "@/constants/years";
import {
  EMPTY_STANDARD_DEDUCTION_MAP,
  FILING_STATUSES,
} from "@/constants/filing_status";
import type {
  FilingStatus,
  StandardDeductionMap,
} from "@/constants/filing_status";
import { capitalizeFirstLetter, snakeToTitleCase } from "@/utils/string-utils";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import { STATE_MAP } from "@/constants/states";
import type { State } from "@/constants/states";
import Autocomplete from "@mui/material/Autocomplete";
import { CITIES } from "@/constants";
import {
  MAX_401K_CONTRIBUTION,
  STANDARD_DEDUCTION,
} from "@/constants/tax_types";
import { Box, Slider, useMediaQuery } from "@mui/material";
import theme from "@/theme";
import { City } from "@/constants/cities";
import { TaxData } from "@/types";
import Results from "@/components/Results";

export default function Home() {
  const defaultUSAState = "oregon";
  const defaultUSACity = "portland";

  const [totalIncome, setTotalIncome] = useState(216000); // Evenly cubed to 60
  const [totalIRA, setTotalIRA] = useState(0);
  const [totalFederalDeductions, setTotalFederalDeductions] = useState<
    number | undefined
  >(undefined); // undefined until user input
  const [totalStateDeductions, setTotalStateDeductions] = useState<
    number | undefined
  >(undefined); // undefined until user input
  const [USACity, setUSACity] = useState<string>(defaultUSACity);
  const [USAState, setUSAState] = useState<State>(defaultUSAState);
  const [year, setYear] = useState<Year>(CURRENT_YEAR);
  const [filingStatus, setFilingStatus] = useState<FilingStatus>("single");
  const [exemptTaxes, setExemptTaxes] = useState<string[]>([]);

  const [stateTaxes, setStateTaxes] = useState<TaxData>({} as TaxData);
  const [federalTaxes, setFederalTaxes] = useState<TaxData>({} as TaxData);

  const [federalStandardDeductionMap, setFederalStandardDeductionMap] =
    useState<StandardDeductionMap>(EMPTY_STANDARD_DEDUCTION_MAP);
  const [stateStandardDeductionMap, setStateStandardDeductionMap] =
    useState<StandardDeductionMap>(EMPTY_STANDARD_DEDUCTION_MAP);

  // TODO: Limit max
  const [max401KContribution, setMax401KContribution] = useState(0);

  const resetTotalStateDeductions = useCallback(() => {
    setTotalStateDeductions(stateStandardDeductionMap[filingStatus]);
  }, [stateStandardDeductionMap, filingStatus, year]);

  const resetTotalFederalDeductions = useCallback(() => {
    setTotalFederalDeductions(federalStandardDeductionMap[filingStatus]);
  }, [federalStandardDeductionMap, filingStatus, year]);

  useEffect(() => {
    if (federalStandardDeductionMap[filingStatus]) {
      resetTotalFederalDeductions();
    }
    if (stateStandardDeductionMap[filingStatus]) {
      resetTotalStateDeductions();
    }
  }, [filingStatus, federalStandardDeductionMap, stateStandardDeductionMap]);

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
  }, [stateStandardDeductionMap, federalStandardDeductionMap]);

  const stateOptions = useMemo(() => {
    return Object.entries(STATE_MAP)
      .map(([state, obj]) => {
        const firstLetter = state[0].toUpperCase();
        return {
          firstLetter,
          title: state,
          disabled: obj.supported === false,
        };
      })
      .sort((a, b) => {
        if (a.disabled && !b.disabled) return 1;
        if (!a.disabled && b.disabled) return -1;
        if (a.firstLetter > b.firstLetter) return 1;
        if (a.firstLetter < b.firstLetter) return -1;
        return 0;
      });
  }, []);

  const cityOptions = useMemo(() => {
    const cities = (stateTaxes as any)?.[CITIES] as City[];
    if (typeof cities !== "object" || !Object.keys(cities)?.length) {
      return null;
    }
    return Object.keys(cities).map((name) => {
      return {
        title: name,
      };
    });
  }, [USAState, stateTaxes]);

  useEffect(() => {
    async function fetchFederalBrackets() {
      const federalBrackets = await import(`@/data/${year}/federal.ts`);
      setFederalTaxes(federalBrackets.default);
    }
    fetchFederalBrackets();
  }, [year]);

  useEffect(() => {
    async function fetchStateBrackets() {
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
        if (USACity) {
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

  const isXs = useMediaQuery<typeof theme>((theme) =>
    theme.breakpoints.down("sm")
  );

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
    []
  );

  return (
    <>
      <Container maxWidth="md">
        <Typography
          variant="h3"
          component="h1"
          textAlign="center"
          display="flex"
          justifyContent="center"
          sx={{ mt: 4, mb: 4 }}
        >
          Income Tax Calculator
        </Typography>
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
              <Slider
                value={Math.cbrt(totalIncome)}
                min={1}
                step={1}
                max={215}
                onChange={(event: Event, newValue: number | number[]) => {
                  if (typeof newValue === "number") {
                    setTotalIncome(newValue ** 3);
                  }
                }}
              />
            </Box>
          </Grid>
          <Grid xs={12} sm={2} md={2} display="flex" justifyContent="center">
            <TextField
              fullWidth={isXs}
              select
              label="Tax Year"
              value={year}
              onChange={(e) => setYear(e.target.value as Year)}
              variant="standard"
            >
              {YEARS.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid xs={12} sm={4} md={4}>
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
            <Autocomplete
              id="state-select"
              options={stateOptions}
              groupBy={(option) => option.firstLetter}
              // isOptionEqualToValue={(option, value) => {
              // TODO: Fix this warning

              // }
              //   option.title === value.title
              // }
              getOptionLabel={(option) =>
                capitalizeFirstLetter(option?.title) || ""
              }
              getOptionDisabled={(option) => option.disabled}
              freeSolo={false}
              value={{
                title: USAState,
                firstLetter: (USAState?.[0] || "").toUpperCase(),
                disabled: false,
              }}
              onInputChange={(e, val) => {
                if (val && STATE_MAP[val.toLowerCase() as State]?.supported) {
                  setUSAState(val.toLowerCase() as State);
                  setUSACity("");
                } else if (!val) {
                  setUSAState(USAState || defaultUSAState);
                }
              }}
              renderInput={(params) => {
                const { key, ...props } = params as any;
                return (
                  <TextField
                    key={props.id || key}
                    {...props}
                    label="State"
                    variant="standard"
                  />
                );
              }}
            />
          </Grid>
          <Grid xs={12} sm={6} md={4}>
            {cityOptions ? (
              <Autocomplete
                id="city-select"
                options={cityOptions}
                getOptionLabel={(option) =>
                  capitalizeFirstLetter(option?.title) || ""
                }
                freeSolo={false}
                value={{
                  title: USACity,
                }}
                isOptionEqualToValue={(option, value) =>
                  option.title === value.title
                }
                onInputChange={(e, val) => {
                  if (val) {
                    setUSACity(val.toLowerCase() as City);
                  } else {
                    setUSACity("");
                  }
                }}
                renderInput={(params) => {
                  const { key, ...props } = params as any;
                  return (
                    <TextField
                      key={props.id || key}
                      {...props}
                      label="City"
                      variant="standard"
                    />
                  );
                }}
              />
            ) : (
              <TextField
                fullWidth
                label="City"
                variant="standard"
                disabled={true}
                value="No Specific City Taxes"
              />
            )}
          </Grid>
          <Grid xs={12} sm={6} md={4}>
            <Autocomplete
              id="exempt-select"
              multiple
              isOptionEqualToValue={(option, value) =>
                option.title === value.title
              }
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
          <Grid xs={12} sm={6} md={4}>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel htmlFor="outlined-adornment-total-ira">
                401k/IRA Contributions
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-total-ira"
                value={totalIRA}
                onChange={handleNumberChange(setTotalIRA)}
                onBlur={() => {
                  if (totalIRA > max401KContribution) {
                    setTotalIRA(max401KContribution);
                  }
                }}
                startAdornment={
                  <InputAdornment position="start">$</InputAdornment>
                }
                label="401k/IRA Contributions"
              />
            </FormControl>
          </Grid>
          <Grid xs={12} sm={6} md={4}>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel htmlFor="outlined-adornment-total-federal-deductions">
                Total Federal Deductions
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-total-federal-deductions"
                value={
                  typeof totalFederalDeductions === "undefined"
                    ? 0
                    : totalFederalDeductions
                }
                onChange={handleNumberChange(setTotalFederalDeductions)}
                startAdornment={
                  <InputAdornment position="start">$</InputAdornment>
                }
                label="Total Federal Deductions"
              />
            </FormControl>
          </Grid>
          <Grid xs={12} sm={6} md={4}>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel htmlFor="outlined-adornment-total-state-deductions">
                Total State Deductions
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-total-state-deductions"
                value={
                  typeof totalStateDeductions === "undefined"
                    ? 0
                    : totalStateDeductions
                }
                onChange={handleNumberChange(setTotalStateDeductions)}
                startAdornment={
                  <InputAdornment position="start">$</InputAdornment>
                }
                label="Total State Deductions"
              />
            </FormControl>
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
        />
      </Container>

      <Copyright sx={{ m: 5 }} />
    </>
  );
}
