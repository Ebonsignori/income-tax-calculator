import { calculate, getPaycheckByFrequency } from "@/utils/calculator";
import { Box, Grid, Typography } from "@mui/material";
import React, { memo, useMemo } from "react";
import { useTheme } from "@mui/material/styles";
import type { PaycheckFrequency } from "@/constants/paycheck-frequency";
import { FREQUENCY_TO_FREQUENCY_LABEL } from "@/constants/paycheck-frequency";
import type { TaxData } from "@/types";
import type { FilingStatus } from "@/constants/filing-status";
import type { TaxOption } from "@/utils/get-tax-options";
import { PieChartBreakdown } from "./PieChartBreakdown";
import { TableBreakdown } from "./TableBreakdown";

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

  return (
    <Box>
      <Grid container>
        <Grid item xs={12} sm={6}>
          <Typography
            variant="h5"
            component="h2"
            textAlign="center"
            color={theme.custom.green}
          >
            Total Take Home
          </Typography>
          <Typography
            variant="body1"
            fontSize="large"
            sx={{ mb: 0, mt: 1 }}
            textAlign="center"
            data-testid="total-take-home-amount"
          >
            {takeHome?.amount?.toFormat()}
          </Typography>
          <Typography variant="body2" textAlign="center">
            or
          </Typography>
          <Typography variant="body1" fontSize="large" textAlign="center">
            {getPaycheckByFrequency(
              takeHome?.amount,
              paycheckFrequency,
            ).toFormat()}
          </Typography>
          <Typography variant="body2" textAlign="center">
            {FREQUENCY_TO_FREQUENCY_LABEL[paycheckFrequency]}
          </Typography>
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
          marginTop={{
            xs: 2,
            sm: 0,
          }}
        >
          <Typography
            variant="h5"
            component="h2"
            textAlign="center"
            color={theme.custom.red}
          >
            Total Taxes
          </Typography>
          <Typography
            variant="body1"
            fontSize="large"
            sx={{ mb: 0, mt: 1 }}
            textAlign="center"
          >
            {totalTaxes.toFormat()}
          </Typography>
          <Typography variant="body2" textAlign="center">
            or
          </Typography>
          <Typography variant="body1" fontSize="large" textAlign="center">
            {getPaycheckByFrequency(totalTaxes, paycheckFrequency).toFormat()}
          </Typography>
          <Typography variant="body2" textAlign="center">
            {FREQUENCY_TO_FREQUENCY_LABEL[paycheckFrequency]}
          </Typography>
        </Grid>
      </Grid>

      {totalTaxes?.toUnit() > 0 ? (
        <>
          <Typography
            variant="h4"
            component="h3"
            textAlign="center"
            sx={{ mt: 4, mb: 1 }}
          >
            Breakdown
          </Typography>
          <Grid container>
            <Grid item xs={12} sm={12} md={7}>
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
            <Grid
              item
              xs={12}
              sm={12}
              md={5}
              display="flex"
              alignContent="center"
              flexDirection="column"
              alignItems="center"
              marginTop={{ xs: 2, md: 0 }}
            >
              <PieChartBreakdown
                federalResults={federalResults}
                stateResults={stateResults}
              />
            </Grid>
          </Grid>
        </>
      ) : null}
    </Box>
  );
});

export default Results;
