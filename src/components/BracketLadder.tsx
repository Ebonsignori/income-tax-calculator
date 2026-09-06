"use client";

import {
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useTheme,
} from "@mui/material";
import { useMemo, useState } from "react";
import type { FilingStatus } from "@/constants/filing-status";
import { FEDERAL_INCOME, STATE_INCOME } from "@/constants/tax_types";
import type { BracketSchedule, RateBracket, TaxData } from "@/types";
import {
  isFlatFeeSchedule,
  isRateLookupSchedule,
  scheduleForFilingStatus,
} from "@/utils/calculator";
import { buildBracketLadder } from "@/utils/marginal-rate";
import { asCurrency, formatMoney, formatMoneyNoCents } from "@/utils/money";
import { getSegmentColor } from "@/constants/chart-colors";
import { snakeToTitleCase } from "@/utils/string-utils";

type Jurisdiction = {
  key: string;
  label: string;
  schedule: BracketSchedule | undefined;
  /** The income these bands actually apply to, after that jurisdiction's own deductions. */
  taxableIncome: number;
};

type BracketLadderProps = {
  federalTaxes: TaxData;
  stateTaxes: TaxData;
  USAState: string;
  filingStatus: FilingStatus;
  federalTaxableIncome: number;
  stateTaxableIncome: number;
};

/**
 * Shows how taxable income is split across a jurisdiction's bands.
 *
 * The point is the one most people get wrong: landing in the 22% bracket does
 * not mean paying 22% on everything, only on the part above that threshold.
 * Saying so is much less convincing than showing the slices.
 */
export function BracketLadder({
  federalTaxes,
  stateTaxes,
  USAState,
  filingStatus,
  federalTaxableIncome,
  stateTaxableIncome,
}: BracketLadderProps) {
  const theme = useTheme();
  const [selected, setSelected] = useState("federal");

  const jurisdictions = useMemo(() => {
    const list: Jurisdiction[] = [
      {
        key: "federal",
        label: "Federal",
        schedule: scheduleForFilingStatus(
          federalTaxes[FEDERAL_INCOME],
          filingStatus,
        ),
        taxableIncome: federalTaxableIncome,
      },
    ];
    if (USAState) {
      list.push({
        key: "state",
        label: snakeToTitleCase(USAState),
        schedule: scheduleForFilingStatus(
          stateTaxes[STATE_INCOME],
          filingStatus,
        ),
        taxableIncome: stateTaxableIncome,
      });
    }
    return list;
  }, [
    federalTaxes,
    stateTaxes,
    USAState,
    filingStatus,
    federalTaxableIncome,
    stateTaxableIncome,
  ]);

  const active =
    jurisdictions.find((j) => j.key === selected) ?? jurisdictions[0];

  const accent = getSegmentColor(0);

  const steps = useMemo(() => {
    const schedule = active?.schedule;
    // A flat fee is a fixed charge, and a rate-lookup schedule taxes the whole
    // income at one rate. Neither slices across bands, so drawing a ladder for
    // them would say something untrue.
    if (
      !schedule?.length ||
      isFlatFeeSchedule(schedule) ||
      isRateLookupSchedule(schedule)
    ) {
      return [];
    }
    return buildBracketLadder(schedule as RateBracket[], active.taxableIncome);
  }, [active]);

  const toggle = jurisdictions.length > 1 && (
    <ToggleButtonGroup
      size="small"
      exclusive
      value={active?.key}
      onChange={(event, value) => {
        if (value) setSelected(value);
      }}
      aria-label="Which brackets to show"
      sx={{ mb: 2 }}
    >
      {jurisdictions.map((jurisdiction) => (
        <ToggleButton
          key={jurisdiction.key}
          value={jurisdiction.key}
          sx={{ textTransform: "none", px: 2 }}
        >
          {jurisdiction.label}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );

  if (!steps.length) {
    return (
      <Box>
        {toggle}
        <Typography variant="body2" color="text.secondary">
          {active?.key === "state"
            ? `${snakeToTitleCase(USAState)} has no graduated income tax bands. Its taxes are in the breakdown above.`
            : "No bracket schedule for this year."}
        </Typography>
      </Box>
    );
  }

  const widest = Math.max(...steps.map((step) => step.amountInBracket), 1);

  return (
    <Box>
      {toggle}

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Only the part of your income inside each band is taxed at that
        band&apos;s rate, on{" "}
        {formatMoneyNoCents(asCurrency(active.taxableIncome))} of{" "}
        {active.key === "state" ? "state" : "federal"} taxable income.
      </Typography>

      <Box
        component="dl"
        sx={{
          display: "grid",
          gridTemplateColumns: "auto 1fr auto",
          columnGap: 2,
          rowGap: 1,
          alignItems: "center",
          m: 0,
        }}
      >
        {steps.map((step) => {
          const used = step.amountInBracket > 0;
          return (
            <Box
              key={step.min}
              sx={{ display: "contents", opacity: used ? 1 : 0.45 }}
            >
              <Box component="dt" sx={{ whiteSpace: "nowrap" }}>
                <Typography
                  variant="body2"
                  component="span"
                  fontWeight={step.isCurrent ? "bold" : 500}
                >
                  {step.rate}%
                </Typography>
                <Typography
                  variant="caption"
                  component="span"
                  color="text.secondary"
                  sx={{ ml: 1 }}
                >
                  {formatMoneyNoCents(asCurrency(step.min))}
                  {step.max === null
                    ? "+"
                    : ` – ${formatMoneyNoCents(asCurrency(step.max))}`}
                </Typography>
                {step.isCurrent ? (
                  <Box
                    component="span"
                    sx={{
                      ml: 1,
                      px: 0.75,
                      py: 0.125,
                      borderRadius: 1,
                      fontSize: "0.6875rem",
                      fontWeight: 600,
                      whiteSpace: "nowrap",
                      color: theme.palette.getContrastText(accent),
                      bgcolor: accent,
                    }}
                  >
                    your top rate
                  </Box>
                ) : null}
              </Box>

              <Box
                aria-hidden
                sx={{
                  height: 10,
                  borderRadius: 1,
                  bgcolor: "action.hover",
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    width: `${(step.amountInBracket / widest) * 100}%`,
                    height: "100%",
                    bgcolor: accent,
                    opacity: step.isCurrent ? 1 : 0.45,
                  }}
                />
              </Box>

              <Typography
                component="dd"
                variant="body2"
                sx={{ m: 0, fontVariantNumeric: "tabular-nums" }}
              >
                {used ? formatMoney(asCurrency(step.taxFromBracket)) : "—"}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
