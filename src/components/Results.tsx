import { calculate, getPercent } from "@/utils/calculator";
import {
  Box,
  Collapse,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React, { memo, useMemo } from "react";
import { useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { PieChart } from "@mui/x-charts/PieChart";
import { snakeToTitleCase } from "@/utils/string-utils";
import { CITIES, EXEMPT } from "@/constants";
import { Dinero } from "dinero.js";
import { useTheme } from "@mui/material/styles";

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
}: any) {
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

  if (!totalIncome) return null;

  const tableRows = [
    {
      id: "take_home",
      name: "Take Home",
      percent: takeHome?.percent,
      amount: takeHome?.amount?.toFormat(),
    },
  ];
  if (totalFederal?.amount?.toUnit() > 0) {
    const federalRow = {
      id: "total_federal",
      name: "Federal Taxes",
      percent: totalFederal?.percent,
      amount: totalFederal?.amount?.toFormat(),
      breakdown: [],
      breakdownTaxableIncome: federalTaxableIncome?.toFormat(),
    } as any;
    for (const [taxType, taxTotal] of Object.entries(federalResults)) {
      if (taxTotal === EXEMPT) continue;
      federalRow.breakdown.push({
        id: taxType,
        name: snakeToTitleCase(taxType),
        percent: `${getPercent(taxTotal as Dinero, totalFederal?.amount)}%`,
        amount: (taxTotal as Dinero)?.toFormat(),
      });
    }
    if (totalFica?.amount?.toUnit() > 0) {
      federalRow.breakdown.push({
        id: "fica",
        name: "Total FICA",
        percent: `${getPercent(totalFica?.amount, totalFederal?.amount)}%`,
        amount: totalFica?.amount?.toFormat(),
        styles: {
          name: { fontWeight: "bold" },
          percent: { fontStyle: "italic" },
        },
      });
    }

    tableRows.push(federalRow);
  }
  if (totalState?.amount?.toUnit() > 0) {
    const stateRow = {
      id: "total_state",
      name: "State Taxes",
      percent: totalState?.percent,
      amount: totalState?.amount?.toFormat(),
      breakdown: [],
      breakdownTaxableIncome: stateTaxableIncome?.toFormat(),
    } as any;
    for (const [taxType, taxTotal] of Object.entries(stateResults)) {
      if (taxType === CITIES) {
        for (const [city, cityValue] of Object.entries(taxTotal)) {
          if (cityValue === EXEMPT) continue;
          stateRow.breakdown.push({
            id: city,
            name: `${snakeToTitleCase(city)} (City)`,
            percent: `${getPercent(cityValue as Dinero, totalState?.amount)}%`,
            amount: (cityValue as Dinero)?.toFormat(),
          });
        }
        stateRow.breakdown.push({
          id: "total_city",
          name: "Total City",
          percent: `${getPercent(totalCity?.amount, totalState?.amount)}%`,
          amount: totalCity?.amount?.toFormat(),
          styles: {
            name: { fontWeight: "bold" },
            percent: { fontStyle: "italic" },
          },
        });
      } else if (taxTotal !== EXEMPT) {
        stateRow.breakdown.push({
          id: taxType,
          name: snakeToTitleCase(taxType),
          percent: `${getPercent(taxTotal as Dinero, totalState?.amount)}%`,
          amount: (taxTotal as Dinero)?.toFormat(),
        });
      }
    }
    if (totalCity?.amount?.toUnit() > 0) {
      stateRow.name = "State + City Taxes";
    }
    tableRows.push(stateRow);
  }

  let pieChartData = [];
  let totalTaxTypes = 0;
  for (const [taxType, value] of Object.entries(federalResults)) {
    totalTaxTypes++;
    if (value === EXEMPT) continue;
    pieChartData.push({
      id: taxType,
      value: (value as Dinero)?.toUnit(),
      label: snakeToTitleCase(taxType),
      tooltipValue: (value as Dinero)?.toFormat(),
    });
  }
  for (const [taxType, taxTotal] of Object.entries(stateResults)) {
    totalTaxTypes++;
    if (taxType === CITIES) {
      for (const [city, cityValue] of Object.entries(taxTotal)) {
        if (cityValue === EXEMPT) continue;
        pieChartData.push({
          id: city,
          value: cityValue?.toUnit(),
          label: snakeToTitleCase(city),
          tooltipValue: (cityValue as Dinero)?.toFormat(),
        });
      }
    } else if (taxTotal !== EXEMPT) {
      pieChartData.push({
        id: taxType,
        value: (taxTotal as Dinero)?.toUnit(),
        label: snakeToTitleCase(taxType),
        tooltipValue: (taxTotal as Dinero)?.toFormat(),
      });
    }
  }

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
          >
            {takeHome?.amount?.toFormat()}
          </Typography>
          <Typography variant="body2" textAlign="center">
            or
          </Typography>
          <Typography variant="body1" fontSize="large" textAlign="center">
            {takeHome?.amount?.divide(12).toFormat()}
          </Typography>
          <Typography variant="body2" textAlign="center">
            per month
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
            {totalTaxes.divide(12).toFormat()}
          </Typography>
          <Typography variant="body2" textAlign="center">
            per month
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
              <TableContainer component={Paper} sx={{ border: 1 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell
                        sx={{
                          width: "8px",
                          padding: "1px",
                        }}
                      />
                      <TableCell>Tax</TableCell>
                      <TableCell align="right">Percent</TableCell>
                      <TableCell align="right">Amount</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {tableRows.map((row) => (
                      <CollapsibleRow key={row.name} row={row} />
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
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
                width={250}
                height={325}
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
                  bottom: 55 + 35 * (totalTaxTypes / 2),
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
            </Grid>
          </Grid>
        </>
      ) : null}
    </Box>
  );
});

export default Results;

function CollapsibleRow(props: { row: any }) {
  const { row } = props;
  const [open, setOpen] = useState(false);

  let dropdownButton = null;
  if (row?.breakdown?.length > 0) {
    dropdownButton = (
      <IconButton
        aria-label="expand row"
        size="small"
        onClick={() => setOpen(!open)}
      >
        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
      </IconButton>
    );
  }

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell
          sx={{
            width: "8px",
            padding: "1px",
          }}
        >
          {dropdownButton}
        </TableCell>
        <TableCell component="th" scope="row">
          {row.name}
        </TableCell>
        <TableCell align="right">{row.percent}%</TableCell>
        <TableCell align="right">{row.amount}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="body2" sx={{ m: 2 }} fontStyle="italic">
                With {row.breakdownTaxableIncome} of taxable income
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Tax</TableCell>
                    <TableCell>Percent of {row.name}</TableCell>
                    <TableCell align="right">Amount</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row?.breakdown?.length
                    ? row.breakdown.map((breakdownRow: any) => (
                        <TableRow key={breakdownRow.name}>
                          <TableCell component="th" scope="row">
                            <Typography
                              variant="body2"
                              sx={breakdownRow?.styles?.name}
                            >
                              {breakdownRow.name}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography
                              variant="body2"
                              sx={breakdownRow?.styles?.percent}
                            >
                              {breakdownRow.percent}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            {breakdownRow.amount}
                          </TableCell>
                        </TableRow>
                      ))
                    : null}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}
