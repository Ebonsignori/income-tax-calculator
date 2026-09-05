"use client";

import type { Dinero } from "dinero.js";
import { Box, Tooltip, Typography, useTheme } from "@mui/material";
import { useMemo } from "react";
import type { TaxResultsWithCities } from "@/types";
import { asCurrency } from "@/utils/calculator";
import { toBreakdownSegments } from "@/utils/breakdown-segments";
import { formatPercent } from "@/utils/format-percent";
import {
  RETIREMENT_COLOR_DARK,
  RETIREMENT_COLOR_LIGHT,
  TAKE_HOME_COLOR_DARK,
  TAKE_HOME_COLOR_LIGHT,
  getSegmentColor,
} from "@/constants/chart-colors";

type TaxBreakdownBarProps = {
  federalResults: TaxResultsWithCities;
  stateResults: TaxResultsWithCities;
  /** Gross income, before retirement contributions and deductions. */
  totalIncome: number;
  takeHome: Dinero;
  totalIRA: number;
};

type BreakdownRow = {
  id: string;
  label: string;
  amount: Dinero;
  color: string;
  /** Share of gross income, 0-100. */
  share: number;
};

export function TaxBreakdownBar({
  federalResults,
  stateResults,
  totalIncome,
  takeHome,
  totalIRA,
}: TaxBreakdownBarProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const { takeHomeRow, retirementRow, taxRows } = useMemo(() => {
    const grossUnits = asCurrency(totalIncome).toUnit();
    const share = (amount: Dinero) =>
      grossUnits > 0 ? (amount.toUnit() / grossUnits) * 100 : 0;

    const takeHomeRow: BreakdownRow = {
      id: "take_home",
      label: "Take home",
      amount: takeHome,
      color: isDark ? TAKE_HOME_COLOR_DARK : TAKE_HOME_COLOR_LIGHT,
      share: share(takeHome),
    };

    // `takeHome` is computed net of retirement contributions, so without this
    // row the bar would not sum to gross and the money would just vanish.
    let retirementRow: BreakdownRow | null = null;
    if (totalIRA > 0) {
      const amount = asCurrency(totalIRA);
      retirementRow = {
        id: "retirement",
        label: "Retirement contributions",
        amount,
        color: isDark ? RETIREMENT_COLOR_DARK : RETIREMENT_COLOR_LIGHT,
        share: share(amount),
      };
    }

    const taxRows: BreakdownRow[] = toBreakdownSegments(
      federalResults,
      stateResults,
    ).map((segment, index) => ({
      id: segment.id,
      label: segment.label,
      amount: segment.amount,
      color: getSegmentColor(index, isDark),
      share: share(segment.amount),
    }));

    return { takeHomeRow, retirementRow, taxRows };
  }, [federalResults, stateResults, totalIncome, takeHome, totalIRA, isDark]);

  const barRows = useMemo(
    () =>
      [
        takeHomeRow,
        ...(retirementRow ? [retirementRow] : []),
        ...taxRows,
      ].filter((row) => row.share > 0),
    [takeHomeRow, retirementRow, taxRows],
  );

  const listRows = useMemo(
    () => (retirementRow ? [retirementRow, ...taxRows] : taxRows),
    [retirementRow, taxRows],
  );

  const barLabel = `Where each dollar of ${asCurrency(totalIncome).toFormat()} goes: ${barRows
    .map((row) => `${row.label} ${row.share.toFixed(1)} percent`)
    .join(", ")}`;

  return (
    <Box sx={{ width: "100%" }}>
      <Box
        role="img"
        aria-label={barLabel}
        sx={{
          display: "flex",
          width: "100%",
          height: 28,
          borderRadius: 1,
          overflow: "hidden",
        }}
      >
        {barRows.map((row) => (
          <Tooltip
            key={row.id}
            title={`${row.label}: ${row.amount.toFormat()} (${formatPercent(row.share)})`}
          >
            <Box
              sx={{
                width: `${row.share}%`,
                backgroundColor: row.color,
                // Keeps sub-percent slivers visible instead of collapsing them.
                minWidth: "2px",
              }}
            />
          </Tooltip>
        ))}
      </Box>

      <Box
        component="dl"
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr auto auto",
          columnGap: 2,
          rowGap: 0.75,
          alignItems: "baseline",
          mt: 2,
          mb: 0,
        }}
      >
        <LegendRow row={takeHomeRow} emphasized />
        {listRows.map((row) => (
          <LegendRow key={row.id} row={row} />
        ))}
      </Box>
    </Box>
  );
}

function LegendRow({
  row,
  emphasized,
}: {
  row: BreakdownRow;
  emphasized?: boolean;
}) {
  return (
    <>
      <Box
        component="dt"
        sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 0 }}
      >
        <Box
          aria-hidden
          sx={{
            width: 10,
            height: 10,
            borderRadius: "2px",
            backgroundColor: row.color,
            flexShrink: 0,
          }}
        />
        <Typography
          variant="body2"
          fontWeight={emphasized ? "bold" : undefined}
          sx={{ minWidth: 0, overflowWrap: "anywhere" }}
        >
          {row.label}
        </Typography>
      </Box>
      <Typography
        component="dd"
        variant="body2"
        fontWeight={emphasized ? "bold" : undefined}
        sx={{ m: 0, fontVariantNumeric: "tabular-nums" }}
      >
        {row.amount.toFormat()}
      </Typography>
      <Typography
        component="dd"
        variant="body2"
        color="text.secondary"
        sx={{ m: 0, fontVariantNumeric: "tabular-nums" }}
      >
        {formatPercent(row.share)}
      </Typography>
    </>
  );
}
