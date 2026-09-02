import type { Dinero } from "dinero.js";
import type { TaxResults, TaxResultsWithCities } from "@/types";
import { getPercent } from "@/utils/calculator";
import { snakeToTitleCase } from "@/utils/string-utils";
import { useMemo, useState } from "react";
import {
  Box,
  Collapse,
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
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import type { SxProps, Theme } from "@mui/material";
import { CITIES, EXEMPT } from "@/constants";

type TotalTax = {
  percent: number;
  amount: Dinero;
};

/** A row inside an expanded Federal / State section. */
type BreakdownRow = {
  id: string;
  name: string;
  /** Pre-formatted, including the % sign. */
  percent: string;
  amount?: string;
  styles?: {
    name?: SxProps<Theme>;
    percent?: SxProps<Theme>;
  };
};

/** A top-level row; the % sign is appended by the renderer. */
type SummaryRow = {
  id: string;
  name: string;
  percent: number;
  amount?: string;
  breakdown?: BreakdownRow[];
  breakdownTaxableIncome?: string;
};

type TableBreakdownProps = {
  totalFederal: TotalTax;
  totalState: TotalTax;
  totalCity: TotalTax;
  totalFica: TotalTax;
  takeHome: TotalTax;
  federalResults: TaxResultsWithCities;
  stateResults: TaxResultsWithCities;
  federalTaxableIncome: Dinero;
  stateTaxableIncome: Dinero;
};

export function TableBreakdown({
  totalFederal,
  totalState,
  totalCity,
  totalFica,
  takeHome,
  federalResults,
  stateResults,
  federalTaxableIncome,
  stateTaxableIncome,
}: TableBreakdownProps) {
  const { tableRows } = useMemo(() => {
    const tableRows: SummaryRow[] = [
      {
        id: "take_home",
        name: "Take Home",
        percent: takeHome?.percent,
        amount: takeHome?.amount?.toFormat(),
      },
    ];
    if (totalFederal?.amount?.toUnit() > 0) {
      const federalRow: SummaryRow = {
        id: "total_federal",
        name: "Federal Taxes",
        percent: totalFederal?.percent,
        amount: totalFederal?.amount?.toFormat(),
        breakdown: [] as BreakdownRow[],
        breakdownTaxableIncome: federalTaxableIncome?.toFormat(),
      };
      for (const [taxType, taxTotal] of Object.entries(federalResults)) {
        if (taxTotal === EXEMPT) continue;
        federalRow.breakdown!.push({
          id: taxType,
          name: snakeToTitleCase(taxType),
          percent: `${getPercent(taxTotal as Dinero, totalFederal?.amount)}%`,
          amount: (taxTotal as Dinero)?.toFormat(),
        });
      }
      if (totalFica?.amount?.toUnit() > 0) {
        federalRow.breakdown!.push({
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
      const stateRow: SummaryRow = {
        id: "total_state",
        name: "State Taxes",
        percent: totalState?.percent,
        amount: totalState?.amount?.toFormat(),
        breakdown: [] as BreakdownRow[],
        breakdownTaxableIncome: stateTaxableIncome?.toFormat(),
      };
      for (const [taxType, taxTotal] of Object.entries(stateResults)) {
        if (taxType === CITIES) {
          for (const [city, cityValue] of Object.entries(
            taxTotal as TaxResults,
          )) {
            if (cityValue === EXEMPT) continue;
            stateRow.breakdown!.push({
              id: city,
              name: `${snakeToTitleCase(city)} (City)`,
              percent: `${getPercent(cityValue as Dinero, totalState?.amount)}%`,
              amount: (cityValue as Dinero)?.toFormat(),
            });
          }
          stateRow.breakdown!.push({
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
          stateRow.breakdown!.push({
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

    return { tableRows };
  }, [
    federalResults,
    stateResults,
    totalFederal,
    totalState,
    totalCity,
    totalFica,
    takeHome,
    federalTaxableIncome,
    stateTaxableIncome,
  ]);

  return (
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
  );
}

function CollapsibleRow(props: { row: SummaryRow }) {
  const { row } = props;
  const [open, setOpen] = useState(false);

  let dropdownButton = null;
  if (row.breakdown && row.breakdown.length > 0) {
    dropdownButton = (
      <IconButton
        aria-label="expand row"
        size="small"
        onClick={() => {
          setOpen(!open);
        }}
      >
        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
      </IconButton>
    );
  }

  return (
    <>
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
                  {row.breakdown?.length
                    ? row.breakdown.map((breakdownRow) => (
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
    </>
  );
}
