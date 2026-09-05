"use client";

import type { TaxResultsWithCities } from "@/types";
import { Typography, useTheme } from "@mui/material";
import { PieChart } from "@mui/x-charts";
import { useMemo } from "react";
import { toBreakdownSegments } from "@/utils/breakdown-segments";
import { getSegmentColor } from "@/constants/chart-colors";

type PieChartBreakdownProps = {
  federalResults: TaxResultsWithCities;
  stateResults: TaxResultsWithCities;
  width?: number;
  height?: number;
  mbBase?: number;
  mbModifier?: number;
  mbNumberOfKeysPerRow?: number;
};

/**
 * Retained for the Open Graph image pipeline only -- OpenGraphContainer renders
 * it and scripts/generate-og-images.ts screenshots the result. The in-app
 * breakdown uses TaxBreakdownBar, which reads without hover and is responsive.
 */
export function PieChartBreakdown({
  federalResults,
  stateResults,
  width = 300,
  height = 325,
  mbBase = 55,
  mbModifier = 35,
  mbNumberOfKeysPerRow = 2,
}: PieChartBreakdownProps) {
  const theme = useTheme();

  const { pieChartData, totalTaxTypes } = useMemo(() => {
    const segments = toBreakdownSegments(federalResults, stateResults);
    return {
      pieChartData: segments.map((segment, index) => ({
        id: segment.id,
        value: segment.amount.toUnit(),
        label: segment.label,
        color: getSegmentColor(index),
        tooltipValue: segment.amount.toFormat(),
      })),
      totalTaxTypes: segments.length,
    };
  }, [federalResults, stateResults]);

  return (
    <PieChart
      series={[
        {
          highlightScope: { faded: "global", highlighted: "item" },
          faded: {
            innerRadius: 30,
            additionalRadius: -30,
            color: "gray",
          },
          data: pieChartData,
        },
      ]}
      width={width}
      height={height}
      tooltip={{
        trigger: "item",
        itemContent: (props) => {
          const dataIndex = props?.itemData?.dataIndex;
          const dataItem = props?.series?.data?.[dataIndex] as any;
          return (
            <table
              style={{
                backgroundColor:
                  theme.palette.mode === "light"
                    ? theme.palette.common.white
                    : theme.palette.common.black,
                color:
                  theme.palette.mode === "light"
                    ? theme.palette.common.black
                    : theme.palette.common.white,
                borderRadius: 4,
                padding: "5px",
                border: `1px solid ${
                  theme.palette.mode === "light"
                    ? theme.palette.common.black
                    : theme.palette.common.white
                }`,
              }}
            >
              <tbody>
                <tr>
                  <td>
                    <Typography variant="body1" fontWeight="bold">
                      {dataItem?.label}:
                    </Typography>
                  </td>
                  <td>
                    <Typography variant="body1">
                      {dataItem?.tooltipValue}
                    </Typography>
                  </td>
                </tr>
              </tbody>
            </table>
          );
        },
      }}
      margin={{
        top: 10,
        right: 10,
        bottom: mbBase + mbModifier * (totalTaxTypes / mbNumberOfKeysPerRow),
        left: 10,
      }}
      slotProps={{
        legend: {
          direction: "row",
          position: { vertical: "bottom", horizontal: "middle" },
          padding: 0,
          itemMarkHeight: 10,
        },
      }}
    />
  );
}
