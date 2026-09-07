"use client";

import {
  Box,
  FormControl,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Slider,
} from "@mui/material";

/**
 * The slider is cube-root scaled so the low end, where most incomes sit, gets
 * most of the travel. 215 cubed is a little under $10M.
 */
const SLIDER_MAX = 215;

export function sliderToIncome(sliderValue: number): number {
  return Math.round(Math.pow(sliderValue, 3));
}

export function incomeToSlider(income: number): number {
  return Math.cbrt(income);
}

const INCOME_SLIDER_MARKS = [50_000, 100_000, 250_000, 1_000_000].map(
  (income) => ({ value: incomeToSlider(income) }),
);

const asDollars = (value: number) =>
  value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });

type IncomeFieldProps = {
  id: string;
  value: number;
  onChange: (income: number) => void;
  label?: string;
};

/**
 * Income entry: a formatted text field plus the cube-root slider.
 *
 * Shared so the calculator and the comparison page cannot drift apart on the
 * scale, the marks, or what the slider announces to a screen reader.
 */
export function IncomeField({
  id,
  value,
  onChange,
  label = "Total Income",
}: IncomeFieldProps) {
  return (
    <Box>
      <FormControl fullWidth>
        <InputLabel htmlFor={id}>{label}</InputLabel>
        <OutlinedInput
          id={id}
          // Not type="number": that forbids the thousands separators every
          // figure this app outputs uses, and makes a stray scroll over a
          // focused field silently change the income.
          type="text"
          inputProps={{ inputMode: "numeric", autoComplete: "off" }}
          placeholder="75,000"
          value={value ? value.toLocaleString("en-US") : ""}
          onChange={(event) => {
            const digits = event.target.value.replace(/[^0-9]/g, "");
            onChange(digits ? Math.max(0, parseInt(digits, 10)) : 0);
          }}
          startAdornment={<InputAdornment position="start">$</InputAdornment>}
          label={label}
        />
      </FormControl>
      <Box display="flex" justifyContent="center">
        <Slider
          aria-label={label}
          value={incomeToSlider(value)}
          min={0}
          step={1}
          max={SLIDER_MAX}
          marks={INCOME_SLIDER_MARKS}
          valueLabelDisplay="auto"
          // Without this the cube-root scale is what gets announced -- "49"
          // for a $120,000 income.
          getAriaValueText={(sliderValue) =>
            asDollars(sliderToIncome(sliderValue))
          }
          valueLabelFormat={(sliderValue) =>
            asDollars(sliderToIncome(sliderValue))
          }
          sx={{ padding: "0 !important", width: "80%", mt: 1.5 }}
          onChange={(event: Event, newValue: number | number[]) => {
            if (typeof newValue === "number") {
              onChange(sliderToIncome(newValue));
            }
          }}
        />
      </Box>
    </Box>
  );
}
