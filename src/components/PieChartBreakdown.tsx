"use client";

import type { Dinero } from "dinero.js";
import { CITIES, EXEMPT } from "@/constants";
import type { TaxResultsWithCities } from "@/types";
import { snakeToTitleCase } from "@/utils/string-utils";
import { Typography, useTheme } from "@mui/material";
import { PieChart } from "@mui/x-charts";
import { useMemo } from "react";

type PieChartBreakdownProps = {
  federalResults: TaxResultsWithCities;
  stateResults: TaxResultsWithCities;
  width?: number;
  height?: number;
  mbBase?: number;
  mbModifier?: number;
  mbNumberOfKeysPerRow?: number;
};

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
    let pieChartData = [];
    let totalTaxTypes = 0;
    for (const [taxType, value] of Object.entries(federalResults)) {
      if (value === EXEMPT || (value as Dinero)?.toUnit() === 0) continue;
      totalTaxTypes++;
      pieChartData.push({
        id: taxType,
        value: (value as Dinero)?.toUnit(),
        label: snakeToTitleCase(taxType),
        tooltipValue: (value as Dinero)?.toFormat(),
      });
    }
    for (const [taxType, taxTotal] of Object.entries(stateResults)) {
      if (taxType === CITIES) {
        for (const [city, cityValue] of Object.entries(taxTotal)) {
          if (cityValue === EXEMPT || cityValue?.toUnit() === 0) continue;
          totalTaxTypes++;
          pieChartData.push({
            id: city,
            value: cityValue?.toUnit(),
            label: snakeToTitleCase(city),
            tooltipValue: (cityValue as Dinero)?.toFormat(),
          });
        }
      } else if (taxTotal !== EXEMPT && (taxTotal as Dinero)?.toUnit() > 0) {
        totalTaxTypes++;
        pieChartData.push({
          id: taxType,
          value: (taxTotal as Dinero)?.toUnit(),
          label: snakeToTitleCase(taxType),
          tooltipValue: (taxTotal as Dinero)?.toFormat(),
        });
      }
    }
    return { pieChartData, totalTaxTypes };
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
