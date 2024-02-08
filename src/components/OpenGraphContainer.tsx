"use client";

// Component used to generate Open Graph images

import { calculate } from "@/utils/calculator";
import {
  OG_DEFAULT_FEDERAL_DEDUCTIONS,
  OG_DEFAULT_STATE_DEDUCTIONS,
  OG_FILING_STATUS,
  OG_INCOME,
  OG_IRA,
  OG_SCREEN_HEIGHT,
  OG_SCREEN_WIDTH,
} from "../constants/open-graph";
import { PieChartBreakdown } from "@/components/PieChartBreakdown";
import type { TaxData } from "@/types";
import { Box } from "@mui/material";

type OGComponentProps = {
  defaultFederalTaxes: TaxData;
  defaultStateTaxes: TaxData;
  defaultUSAState?: string;
  defaultUSACity?: string;
};

export function OGComponent({
  defaultFederalTaxes,
  defaultStateTaxes,
  defaultUSAState,
  defaultUSACity,
}: OGComponentProps) {
  const { federalResults, stateResults } = calculate(
    defaultFederalTaxes,
    defaultStateTaxes,
    OG_INCOME,
    OG_FILING_STATUS,
    OG_IRA,
    OG_DEFAULT_FEDERAL_DEDUCTIONS,
    OG_DEFAULT_STATE_DEDUCTIONS,
    [],
    defaultUSAState || "",
    defaultUSACity || "",
  );

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{
        mt: `${Math.round(OG_SCREEN_HEIGHT * 0.05)}px`,
      }}
    >
      <PieChartBreakdown
        federalResults={federalResults}
        stateResults={stateResults}
        width={Math.round(OG_SCREEN_WIDTH * 0.8)}
        height={Math.round(OG_SCREEN_HEIGHT * 0.9)}
        mbBase={50}
        mbModifier={25}
        mbNumberOfKeysPerRow={3}
      />
    </Box>
  );
}
