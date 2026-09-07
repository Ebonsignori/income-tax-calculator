"use client";

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
  Box,
  Button,
  Chip,
  Collapse,
  Divider,
  IconButton,
  InputAdornment,
  MenuItem,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import DeleteOutline from "@mui/icons-material/DeleteOutline";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUp from "@mui/icons-material/KeyboardArrowUp";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ALL_STATES } from "@/constants/states";
import { FILING_STATUSES } from "@/constants/filing-status";
import type { FilingStatus } from "@/constants/filing-status";
import { COMPARE } from "@/constants/pages";
import { MAX_401K_CONTRIBUTION } from "@/constants/tax_types";
import type { AvailableStatesAndCities, TaxData } from "@/types";
import { getSegmentColor } from "@/constants/chart-colors";
import {
  buildComparison,
  citiesForState,
  locationId,
  standardStateDeduction,
} from "@/utils/compare-locations";
import type {
  ComparedLocation,
  ComparisonRow,
} from "@/utils/compare-locations";
import { asCurrency, formatMoney, formatMoneyNoCents } from "@/utils/money";
import { formatPercent } from "@/utils/format-percent";
import { getQueryParams, updateURL } from "@/utils/base-path";
import {
  dashToSnakeCase,
  snakeToDashCase,
  snakeToTitleCase,
} from "@/utils/string-utils";
import { YearSelect } from "./input/YearSelect";
import { IncomeField } from "./input/IncomeField";
import { Contribution401kField } from "./input/Contribution401kField";
import { TaxBreakdownBar } from "./TaxBreakdownBar";

type CompareProps = {
  availableYears: string[];
  defaultYear: string;
  statesAndCitiesForYear: { [year: string]: AvailableStatesAndCities };
  defaultFederalTaxes: TaxData;
  /** Preselected by the statically generated `/a/vs/b` pages. */
  defaultLocations?: ComparedLocation[];
  /**
   * The pretty path a statically generated pair page lives at. While the
   * selection still matches what that page was built for, the URL is left
   * alone -- otherwise landing on /compare/2026/texas/vs/california would
   * immediately rewrite itself to a query string.
   */
  canonicalPath?: string;
};

/** Shown when the compared states do not share one standard deduction. */
const VARIES_BY_STATE = "Varies by state";

/**
 * Holds the helper-text row's height when a field has nothing to say. MUI
 * omits the element entirely for empty text, which makes the field jump.
 */
const HELPER_TEXT_SPACER = (
  <Box
    component="span"
    aria-hidden
    sx={{ display: "block", minHeight: "1.66em" }}
  />
);

/** Serialised into `?locations=` as `oregon-portland,texas`. */
function parseLocations(value: string | null): ComparedLocation[] {
  if (!value) return [];
  return value
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => {
      const [state, city = ""] = entry.split("/");
      return { state: dashToSnakeCase(state), city: dashToSnakeCase(city) };
    })
    .filter((location) => ALL_STATES.includes(location.state));
}

function serialiseLocations(locations: ComparedLocation[]): string {
  return locations
    .map(({ state, city }) =>
      city
        ? `${snakeToDashCase(state)}/${snakeToDashCase(city)}`
        : snakeToDashCase(state),
    )
    .join(",");
}

function labelFor({ state, city }: ComparedLocation): string {
  return city
    ? `${snakeToTitleCase(city)}, ${snakeToTitleCase(state)}`
    : snakeToTitleCase(state);
}

export default function Compare({
  availableYears,
  defaultYear,
  statesAndCitiesForYear,
  defaultFederalTaxes,
  defaultLocations = [],
  canonicalPath,
}: CompareProps) {
  const [year, setYear] = useState(defaultYear);
  const [income, setIncome] = useState(150_000);
  const [filingStatus, setFilingStatus] = useState<FilingStatus>("single");
  const [totalIRA, setTotalIRA] = useState(0);
  // Undefined means "use the federal standard deduction". State deductions are
  // never held here: each location resolves its own, or Oregon's would end up
  // applied to Texas.
  const [federalDeductions, setFederalDeductions] = useState<
    number | undefined
  >(undefined);
  const [locations, setLocations] =
    useState<ComparedLocation[]>(defaultLocations);
  const [stateTaxesByState, setStateTaxesByState] = useState<
    Record<string, TaxData>
  >({});
  const [federalTaxes, setFederalTaxes] =
    useState<TaxData>(defaultFederalTaxes);

  const availableStatesAndCities = statesAndCitiesForYear[year];

  // Set by anything the user changes. Until then the URL is whatever they
  // arrived on, which for a pair page is the path worth keeping.
  const hasEdited = useRef(false);
  // The URL is read once on mount and written on every change. Without a
  // guard the writer runs before the reader has applied what it found -- and
  // under StrictMode's double-invoked effects the reader then re-reads a URL
  // the writer has already flattened, losing whatever was shared. TaxTables
  // guards the same way.
  const initialisedFromUrl = useRef(false);
  const markEdited = useCallback(() => {
    hasEdited.current = true;
  }, []);

  // Read the URL once on mount; the statically generated pair pages supply
  // their locations as props instead.
  useEffect(() => {
    // Once only. StrictMode invokes mount effects twice in development, and
    // the second pass would re-read a URL the writer below has already
    // rewritten from state that had not landed yet -- silently replacing a
    // shared link's income with the default.
    if (initialisedFromUrl.current) return;
    const params = getQueryParams();
    const fromUrl = parseLocations(params.get("locations"));
    if (fromUrl.length) setLocations(fromUrl);
    const urlIncome = parseInt(params.get("income") ?? "", 10);
    if (!isNaN(urlIncome) && urlIncome > 0) setIncome(urlIncome);
    const urlIra = parseInt(params.get("ira") ?? "", 10);
    if (!isNaN(urlIra) && urlIra > 0) setTotalIRA(urlIra);
    const urlDeductions = parseInt(params.get("deductions") ?? "", 10);
    if (!isNaN(urlDeductions) && urlDeductions >= 0) {
      setFederalDeductions(urlDeductions);
    }
    const status = params.get("status");
    if (status && (FILING_STATUSES as string[]).includes(status)) {
      setFilingStatus(status as FilingStatus);
    }
    initialisedFromUrl.current = true;
  }, []);

  // Keep the URL shareable. Replace rather than push: dragging the income
  // field should not fill the back button.
  useEffect(() => {
    if (!initialisedFromUrl.current) return;
    if (canonicalPath && !hasEdited.current) return;
    const path = `${COMPARE.route}/${year}`;
    const params: Record<string, string | number> = {};
    if (locations.length) params.locations = serialiseLocations(locations);
    if (income > 0) params.income = income;
    if (filingStatus !== "single") params.status = filingStatus;
    if (totalIRA > 0) params.ira = totalIRA;
    if (typeof federalDeductions !== "undefined") {
      params.deductions = federalDeductions;
    }
    updateURL(path, params, false, true);
  }, [
    locations,
    income,
    filingStatus,
    year,
    canonicalPath,
    totalIRA,
    federalDeductions,
  ]);

  // Each location needs its own state's schedules. The files are a few KB and
  // code-split per state, so this is a handful of small parallel fetches.
  useEffect(() => {
    let cancelled = false;
    const wanted = Array.from(new Set(locations.map((l) => l.state)));

    async function load() {
      const federal = (await import(`@/data/${year}/federal.ts`)) as {
        default: TaxData;
      };
      const loaded = await Promise.all(
        wanted.map(async (state) => {
          try {
            const mod = (await import(`@/data/${year}/state/${state}.ts`)) as {
              default: TaxData;
            };
            return [state, mod.default] as const;
          } catch {
            return null;
          }
        }),
      );
      if (cancelled) return;
      setFederalTaxes(federal.default);
      setStateTaxesByState(
        Object.fromEntries(loaded.filter(Boolean) as [string, TaxData][]),
      );
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [locations, year]);

  const rows = useMemo(
    () =>
      buildComparison({
        locations,
        stateTaxesByState,
        federalTaxes,
        income,
        filingStatus,
        totalIRA,
        federalDeductions,
      }),
    [
      locations,
      stateTaxesByState,
      federalTaxes,
      income,
      filingStatus,
      totalIRA,
      federalDeductions,
    ],
  );

  const max401KContribution = useMemo(
    () => (federalTaxes?.[MAX_401K_CONTRIBUTION] as number) ?? 0,
    [federalTaxes],
  );

  /**
   * One figure only when every compared state agrees on it. They usually do
   * not -- Oregon's is $2,835 and Texas has none -- and showing a single
   * number would imply it applied to all of them.
   */
  const stateDeductionDisplay = useMemo(() => {
    const values = locations.map((location) => {
      const taxes = stateTaxesByState[location.state];
      return taxes ? standardStateDeduction(taxes, filingStatus) ?? 0 : null;
    });
    const known = values.filter((value): value is number => value !== null);
    if (!known.length) return "";
    const first = known[0];
    return known.every((value) => value === first)
      ? first.toLocaleString("en-US")
      : VARIES_BY_STATE;
  }, [locations, stateTaxesByState, filingStatus]);

  const addLocation = useCallback(
    (location: ComparedLocation) => {
      markEdited();
      setLocations((current) =>
        current.some((l) => locationId(l) === locationId(location))
          ? current
          : [...current, location],
      );
    },
    [markEdited],
  );

  const removeLocation = useCallback(
    (id: string) => {
      markEdited();
      setLocations((current) => current.filter((l) => locationId(l) !== id));
    },
    [markEdited],
  );

  const stateOptions = useMemo(
    () =>
      ALL_STATES.filter((state) => availableStatesAndCities?.[state]).map(
        (state) => ({ state, title: snakeToTitleCase(state) }),
      ),
    [availableStatesAndCities],
  );

  return (
    <Box>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "2fr 1fr 1fr" },
          gap: 2,
          mb: 3,
          maxWidth: 900,
        }}
      >
        <IncomeField
          id="compare-income"
          value={income}
          onChange={(next: number) => {
            markEdited();
            setIncome(next);
          }}
        />

        <YearSelect
          availableYears={availableYears}
          year={year}
          USAState=""
          USACity=""
          setYear={(value: string) => {
            markEdited();
            setYear(value);
          }}
          baseRoute={COMPARE.route}
        />

        <TextField
          id="compare-filing-status"
          select
          label="Filing Status"
          value={filingStatus}
          onChange={(event) => {
            markEdited();
            setFilingStatus(event.target.value as FilingStatus);
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
      </Box>

      <Accordion variant="outlined" disableGutters sx={{ mt: 3, mb: 1 }}>
        <AccordionSummary
          expandIcon={<ArrowDownwardIcon />}
          id="compare-deductions-header"
          aria-controls="compare-deductions-content"
        >
          <Typography>Deductions</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr 1fr" },
              gap: 2,
              maxWidth: 900,
              pt: 1,
            }}
          >
            <Contribution401kField
              id="compare-ira-401k-contributions"
              value={totalIRA}
              onChange={(next: number) => {
                markEdited();
                setTotalIRA(next);
              }}
              max={max401KContribution}
              year={year}
              helperSpacer={HELPER_TEXT_SPACER}
            />

            <TextField
              id="compare-federal-deductions"
              label="Total Federal Deductions"
              type="text"
              variant="outlined"
              placeholder="Standard deduction"
              inputProps={{ inputMode: "numeric", autoComplete: "off" }}
              helperText={
                typeof federalDeductions === "undefined"
                  ? "Using the standard deduction"
                  : " "
              }
              value={
                typeof federalDeductions === "undefined"
                  ? ""
                  : federalDeductions.toLocaleString("en-US")
              }
              onChange={(event) => {
                markEdited();
                const digits = event.target.value.replace(/[^0-9]/g, "");
                setFederalDeductions(digits ? parseInt(digits, 10) : undefined);
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">$</InputAdornment>
                ),
              }}
            />
            <TextField
              id="compare-state-deductions"
              label="Total State Deductions"
              type="text"
              variant="outlined"
              disabled
              value={stateDeductionDisplay}
              helperText="Using each state's own deduction"
              inputProps={{
                "aria-describedby": "compare-state-deductions-helper-text",
              }}
              FormHelperTextProps={{
                id: "compare-state-deductions-helper-text",
              }}
              InputProps={{
                startAdornment:
                  stateDeductionDisplay === VARIES_BY_STATE ? null : (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
              }}
            />
          </Box>
        </AccordionDetails>
      </Accordion>

      <LocationPicker
        stateOptions={stateOptions}
        stateTaxesByState={stateTaxesByState}
        year={year}
        onAdd={addLocation}
      />

      {locations.length ? (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 2 }}>
          {locations.map((location) => (
            <Chip
              key={locationId(location)}
              label={labelFor(location)}
              onDelete={() => removeLocation(locationId(location))}
            />
          ))}
        </Box>
      ) : null}

      <Divider sx={{ my: 4 }} />

      {rows.length < 1 ? (
        <Typography variant="body1" color="text.secondary">
          Add two or more places to compare them.
        </Typography>
      ) : (
        <Box>
          <Typography
            variant="h6"
            component="h2"
            color="text.secondary"
            sx={{ mb: 2 }}
          >
            Take home on {formatMoneyNoCents(asCurrency(income))}
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {rows.map((row, index) => (
              <CompareRow
                key={row.id}
                row={row}
                index={index}
                isLeader={index === 0}
                label={labelFor(row.location)}
                income={income}
                totalIRA={totalIRA}
                onRemove={() => removeLocation(row.id)}
              />
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
}

function CompareRow({
  row,
  index,
  isLeader,
  label,
  income,
  totalIRA,
  onRemove,
}: {
  row: ComparisonRow;
  index: number;
  isLeader: boolean;
  label: string;
  income: number;
  totalIRA: number;
  onRemove: () => void;
}) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <Box
      data-testid="compare-row"
      sx={{
        border: 1,
        borderColor: isLeader ? "divider" : "transparent",
        borderRadius: 1,
        bgcolor: isLeader ? "action.hover" : "transparent",
        px: 1.5,
        py: 1,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "baseline",
          columnGap: 2,
          rowGap: 0.5,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            flexGrow: 1,
            minWidth: 0,
          }}
        >
          <Box
            aria-hidden
            sx={{
              width: 10,
              height: 10,
              borderRadius: "2px",
              flexShrink: 0,
              bgcolor: getSegmentColor(index),
            }}
          />
          <Typography
            variant="body1"
            fontWeight={isLeader ? "bold" : undefined}
            sx={{ overflowWrap: "anywhere" }}
          >
            {label}
          </Typography>
        </Box>

        <Typography
          variant="body1"
          fontWeight={isLeader ? "bold" : undefined}
          sx={{ fontVariantNumeric: "tabular-nums" }}
          data-testid="compare-take-home"
        >
          {formatMoney(row.takeHome)}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontVariantNumeric: "tabular-nums", minWidth: 72 }}
        >
          {formatPercent(row.effectiveRate)} tax
        </Typography>

        <Typography
          variant="body2"
          sx={{
            fontVariantNumeric: "tabular-nums",
            minWidth: 72,
            fontWeight: isLeader ? 600 : undefined,
            color: isLeader ? theme.custom.green : theme.palette.text.secondary,
          }}
          data-testid="compare-delta"
        >
          {isLeader
            ? "best"
            : `\u2212${formatMoneyNoCents(asCurrency(row.behindLeaderBy))}`}
        </Typography>

        <Box sx={{ display: "flex", flexShrink: 0 }}>
          <Tooltip title={open ? "Hide breakdown" : "Show breakdown"}>
            <IconButton
              size="small"
              aria-label={`${open ? "Hide" : "Show"} breakdown for ${label}`}
              aria-expanded={open}
              onClick={() => setOpen((current) => !current)}
            >
              {open ? (
                <KeyboardArrowUp fontSize="small" />
              ) : (
                <KeyboardArrowDown fontSize="small" />
              )}
            </IconButton>
          </Tooltip>
          <Tooltip title={`Remove ${label}`}>
            <IconButton
              size="small"
              aria-label={`Remove ${label}`}
              onClick={onRemove}
            >
              <DeleteOutline fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Collapse in={open} timeout="auto" unmountOnExit>
        <Box sx={{ mt: 2, mb: 1 }}>
          <TaxBreakdownBar
            federalResults={row.federalResults}
            stateResults={row.stateResults}
            totalIncome={income}
            takeHome={row.takeHome}
            totalIRA={totalIRA}
          />
        </Box>
      </Collapse>
    </Box>
  );
}

function LocationPicker({
  stateOptions,
  stateTaxesByState,
  year,
  onAdd,
}: {
  stateOptions: { state: string; title: string }[];
  stateTaxesByState: Record<string, TaxData>;
  year: string;
  onAdd: (location: ComparedLocation) => void;
}) {
  const [pendingState, setPendingState] = useState<string>("");
  const [pendingCity, setPendingCity] = useState<string>("");
  const [cityOptions, setCityOptions] = useState<string[]>([]);
  const [loadingCities, setLoadingCities] = useState(false);

  // Cities only become known once the state's data is in hand.
  useEffect(() => {
    let cancelled = false;
    setPendingCity("");
    if (!pendingState) {
      setCityOptions([]);
      return;
    }
    const known = stateTaxesByState[pendingState];
    if (known) {
      setCityOptions(citiesForState(known));
      return;
    }
    setLoadingCities(true);
    (async () => {
      try {
        const mod = (await import(
          `@/data/${year}/state/${pendingState}.ts`
        )) as {
          default: TaxData;
        };
        if (!cancelled) setCityOptions(citiesForState(mod.default));
      } catch {
        if (!cancelled) setCityOptions([]);
      } finally {
        if (!cancelled) setLoadingCities(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [pendingState, stateTaxesByState, year]);

  const add = () => {
    if (!pendingState) return;
    onAdd({ state: pendingState, city: pendingCity });
    setPendingState("");
    setPendingCity("");
  };

  const hasCities = cityOptions.length > 0;

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr auto" },
        gap: 2,
        alignItems: "start",
        maxWidth: 700,
      }}
    >
      <Autocomplete
        id="compare-state-select"
        options={stateOptions}
        getOptionLabel={(option) => option.title}
        isOptionEqualToValue={(option, value) => option.state === value.state}
        value={stateOptions.find((o) => o.state === pendingState) ?? null}
        onChange={(event, value) => setPendingState(value?.state ?? "")}
        renderInput={(params) => {
          const { key, ...props } = params as any;
          return (
            <TextField
              key={props.id || key}
              {...props}
              label="Add a state"
              variant="standard"
            />
          );
        }}
      />

      <Autocomplete
        id="compare-city-select"
        options={cityOptions}
        getOptionLabel={(option) => snakeToTitleCase(option)}
        disabled={!pendingState || !hasCities}
        value={pendingCity || null}
        onChange={(event, city) => setPendingCity(city ?? "")}
        renderInput={(params) => {
          const { key, ...props } = params as any;
          return (
            <TextField
              key={props.id || key}
              {...props}
              label={
                !pendingState
                  ? "City"
                  : loadingCities
                    ? "Checking for city taxes…"
                    : hasCities
                      ? "City (optional)"
                      : "No city taxes here"
              }
              variant="standard"
              helperText={
                pendingState && hasCities
                  ? "Leave blank for the state alone"
                  : " "
              }
            />
          );
        }}
      />

      <Button
        variant="outlined"
        onClick={add}
        disabled={!pendingState}
        sx={{ mt: { xs: 0, sm: 2 }, whiteSpace: "nowrap" }}
      >
        Add
      </Button>
    </Box>
  );
}
