"use client";

import { Box, Typography, useTheme } from "@mui/material";
import { useMemo } from "react";
import type { FilingStatus } from "@/constants/filing-status";
import { FEDERAL_INCOME } from "@/constants/tax_types";
import type { RateBracket, TaxData } from "@/types";
import { scheduleForFilingStatus } from "@/utils/calculator";
import { buildBracketLadder } from "@/utils/marginal-rate";
import { asCurrency, formatMoney, formatMoneyNoCents } from "@/utils/money";
import { getSegmentColor } from "@/constants/chart-colors";

type BracketLadderProps = {
  federalTaxes: TaxData;
  filingStatus: FilingStatus;
  /** Income the federal brackets actually apply to, after deductions. */
  federalTaxableIncome: number;
};

/**
 * Shows how taxable income is split across the federal brackets.
 *
 * The point is the one most people get wrong: landing in the 22% bracket does
 * not mean paying 22% on everything, only on the part above that threshold.
 * Saying so is much less convincing than showing the slices.
 */
export function BracketLadder({
  federalTaxes,
  filingStatus,
  federalTaxableIncome,
}: BracketLadderProps) {
  const theme = useTheme();

  const steps = useMemo(() => {
    const schedule = scheduleForFilingStatus(
      federalTaxes[FEDERAL_INCOME],
      filingStatus,
    );
    if (!schedule?.length) return [];
    // Federal income tax is a rate schedule, never a flat-fee one.
    return buildBracketLadder(schedule as RateBracket[], federalTaxableIncome);
  }, [federalTaxes, filingStatus, federalTaxableIncome]);

  if (!steps.length) return null;

  const widest = Math.max(...steps.map((step) => step.amountInBracket), 1);
  // The chart palette's first entry: already checked for contrast against
  // both the light and dark page surfaces.
  const accent = getSegmentColor(0);

  return (
    <Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Only the part of your income inside each band is taxed at that
        band&apos;s rate, on{" "}
        {formatMoneyNoCents(asCurrency(federalTaxableIncome))} of federal
        taxable income.
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
