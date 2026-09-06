import { calculate, getPaycheckByFrequency } from "@/utils/calculator";
import { Box, Divider, Grid, Typography, useMediaQuery } from "@mui/material";
import React, { memo, useEffect, useMemo } from "react";
import { useTheme } from "@mui/material/styles";
import type { PaycheckFrequency } from "@/constants/paycheck-frequency";
import { FREQUENCY_TO_FREQUENCY_LABEL } from "@/constants/paycheck-frequency";
import type { TaxData } from "@/types";
import type { FilingStatus } from "@/constants/filing-status";
import type { TaxOption } from "@/utils/get-tax-options";
import { TaxBreakdownBar } from "./TaxBreakdownBar";
import { BracketLadder } from "./BracketLadder";
import { getMarginalRate } from "@/utils/marginal-rate";
import { formatPercent } from "@/utils/format-percent";
import { TableBreakdown } from "./TableBreakdown";
import { formatMoney, toUnit } from "@/utils/money";

/** Kept in sync with the sticky bar's own height so the two cannot drift. */
const STICKY_SUMMARY_HEIGHT = 56;

type ResultsProps = {
  federalTaxes: TaxData;
  stateTaxes: TaxData;
  totalIncome: number;
  filingStatus: FilingStatus;
  totalIRA: number;
  totalFederalDeductions: number;
  totalStateDeductions: number;
  exemptTaxes: TaxOption[];
  USAState: string;
  USACity: string;
  paycheckFrequency: PaycheckFrequency;
};

const Results = memo(function Results({
  federalTaxes,
  stateTaxes,
  totalIncome,
  filingStatus,
  totalIRA,
  totalFederalDeductions,
  totalStateDeductions,
  exemptTaxes,
  USAState,
  USACity,
  paycheckFrequency,
}: ResultsProps) {
  const theme = useTheme();
  const {
    takeHome,
    totalTaxes,
    totalFederal,
    totalState,
    totalCity,
    totalFica,
    federalResults,
    stateResults,
    stateTaxableIncome,
    federalTaxableIncome,
  } = useMemo(
    () =>
      calculate(
        federalTaxes,
        stateTaxes,
        totalIncome,
        filingStatus,
        totalIRA,
        totalFederalDeductions,
        totalStateDeductions,
        exemptTaxes,
        USAState,
        USACity,
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      totalIncome,
      filingStatus,
      totalIRA,
      totalFederalDeductions,
      totalStateDeductions,
      exemptTaxes,
      federalTaxes,
      stateTaxes,
      USACity,
    ],
  );

  // Against gross income, deliberately. `calculate` reports every `percent`
  // field against income minus retirement contributions, which is not what an
  // effective rate means.
  const effectiveRate = useMemo(() => {
    if (!totalIncome) return 0;
    return (toUnit(totalTaxes) / totalIncome) * 100;
  }, [totalTaxes, totalIncome]);

  const marginalRate = useMemo(() => {
    if (!totalIncome) return null;
    const taxAt = (income: number) =>
      toUnit(
        calculate(
          federalTaxes,
          stateTaxes,
          income,
          filingStatus,
          totalIRA,
          totalFederalDeductions,
          totalStateDeductions,
          exemptTaxes,
          USAState,
          USACity,
        ).totalTaxes,
      );
    return getMarginalRate(taxAt, totalIncome);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    totalIncome,
    filingStatus,
    totalIRA,
    totalFederalDeductions,
    totalStateDeductions,
    exemptTaxes,
    federalTaxes,
    stateTaxes,
    USACity,
  ]);

  const frequencyLabel = FREQUENCY_TO_FREQUENCY_LABEL[paycheckFrequency];

  // noSsr: the static export would otherwise render the desktop branch and
  // then flip after hydration.
  const showStickySummary = useMediaQuery(theme.breakpoints.down("md"), {
    noSsr: true,
  });

  useEffect(() => {
    if (!showStickySummary) return;
    const previous = document.body.style.paddingBottom;
    document.body.style.paddingBottom = `${STICKY_SUMMARY_HEIGHT}px`;
    return () => {
      document.body.style.paddingBottom = previous;
    };
  }, [showStickySummary]);

  return (
    <Box>
      <Box
        aria-live="polite"
        sx={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "flex-start",
          justifyContent: "center",
          columnGap: { xs: 3, sm: 6 },
          rowGap: 2,
          textAlign: "center",
        }}
      >
        <Box>
          <Typography
            variant="overline"
            component="h2"
            color="text.secondary"
            sx={{ display: "block", lineHeight: 1.6 }}
          >
            Take home
          </Typography>
          <Typography
            variant="h3"
            component="p"
            color={theme.custom.green}
            sx={{ fontWeight: 500, lineHeight: 1.1 }}
            data-testid="total-take-home-amount"
          >
            {formatMoney(takeHome?.amount)}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {formatMoney(
              getPaycheckByFrequency(takeHome?.amount, paycheckFrequency),
            )}{" "}
            {frequencyLabel}
          </Typography>
        </Box>

        <Box>
          <Typography
            variant="overline"
            component="h2"
            color="text.secondary"
            sx={{ display: "block", lineHeight: 1.6 }}
          >
            Total taxes
          </Typography>
          <Typography
            variant="h5"
            component="p"
            color={theme.custom.red}
            sx={{ fontWeight: 500, lineHeight: 1.1, mt: 0.5 }}
          >
            {formatMoney(totalTaxes)}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {formatMoney(getPaycheckByFrequency(totalTaxes, paycheckFrequency))}{" "}
            {frequencyLabel}
          </Typography>
        </Box>

        <Box>
          <Typography
            variant="overline"
            component="h2"
            color="text.secondary"
            sx={{ display: "block", lineHeight: 1.6 }}
          >
            Effective rate
          </Typography>
          <Typography
            variant="h5"
            component="p"
            sx={{ fontWeight: 500, lineHeight: 1.1, mt: 0.5 }}
            data-testid="effective-tax-rate"
          >
            {formatPercent(effectiveRate)}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            of gross income
          </Typography>
        </Box>

        {marginalRate ? (
          <Box>
            <Typography
              variant="overline"
              component="h2"
              color="text.secondary"
              sx={{ display: "block", lineHeight: 1.6 }}
            >
              Next dollar
            </Typography>
            <Typography
              variant="h5"
              component="p"
              sx={{ fontWeight: 500, lineHeight: 1.1, mt: 0.5 }}
              data-testid="marginal-tax-rate"
            >
              {formatPercent(marginalRate.percent)}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {marginalRate.spansRateChange
                ? "averaged over a rate change"
                : "on your next $1 earned"}
            </Typography>
          </Box>
        ) : null}
      </Box>

      {toUnit(totalTaxes) > 0 ? (
        <>
          <Divider sx={{ mt: 4, mb: 3 }} />
          <Grid container spacing={4}>
            <Grid item xs={12} lg={7}>
              <Typography
                variant="h6"
                component="h2"
                sx={{ mb: 2 }}
                color="text.secondary"
              >
                Where each dollar goes
              </Typography>
              <TaxBreakdownBar
                federalResults={federalResults}
                stateResults={stateResults}
                totalIncome={totalIncome}
                takeHome={takeHome?.amount}
                totalIRA={totalIRA}
              />
            </Grid>
            {/*
              Side by side only where there is room for both; below lg they
              stack, which reads better than two cramped columns.
            */}
            <Grid item xs={12} lg={5} sx={{ mt: { xs: 4, lg: 0 } }}>
              <Typography
                variant="h6"
                component="h2"
                sx={{ mb: 2 }}
                color="text.secondary"
              >
                Breakdown by jurisdiction
              </Typography>
              <TableBreakdown
                totalFederal={totalFederal}
                totalState={totalState}
                totalCity={totalCity}
                totalFica={totalFica}
                takeHome={takeHome}
                federalResults={federalResults}
                stateResults={stateResults}
                federalTaxableIncome={federalTaxableIncome}
                stateTaxableIncome={stateTaxableIncome}
              />
            </Grid>
          </Grid>

          <Divider sx={{ mt: 4, mb: 3 }} />
          <Typography
            variant="h6"
            component="h2"
            sx={{ mb: 2 }}
            color="text.secondary"
          >
            Tax brackets
          </Typography>
          <BracketLadder
            federalTaxes={federalTaxes}
            stateTaxes={stateTaxes}
            USAState={USAState}
            filingStatus={filingStatus}
            federalTaxableIncome={toUnit(federalTaxableIncome)}
            stateTaxableIncome={toUnit(stateTaxableIncome)}
          />
        </>
      ) : null}

      {/*
        On a phone the eight stacked inputs fill the viewport, so every result
        is below the fold and typing an income looks like it did nothing. This
        keeps the answer on screen while the inputs are being adjusted, which
        is also what makes the income slider worth dragging.
      */}
      {showStickySummary ? (
        <Box
          aria-hidden
          sx={{
            display: "flex",
            height: STICKY_SUMMARY_HEIGHT,
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: (theme) => theme.zIndex.appBar,
            justifyContent: "space-around",
            alignItems: "center",
            gap: 2,
            px: 2,
            py: 1,
            bgcolor: "background.paper",
            borderTop: 1,
            borderColor: "divider",
            boxShadow: 3,
          }}
        >
          <Box sx={{ textAlign: "center" }}>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "block", lineHeight: 1.2 }}
            >
              Take home
            </Typography>
            <Typography
              variant="subtitle1"
              color={theme.custom.green}
              sx={{ fontWeight: 600, lineHeight: 1.2 }}
            >
              {formatMoney(takeHome?.amount)}
            </Typography>
          </Box>
          <Box sx={{ textAlign: "center" }}>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "block", lineHeight: 1.2 }}
            >
              Effective rate
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 600, lineHeight: 1.2 }}
            >
              {formatPercent(effectiveRate)}
            </Typography>
          </Box>
        </Box>
      ) : null}
    </Box>
  );
});

export default Results;
