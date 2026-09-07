"use client";

import { IconButton, InputAdornment, TextField, Tooltip } from "@mui/material";
import { KeyboardDoubleArrowUp } from "@mui/icons-material";
import type { ReactNode } from "react";

type Contribution401kFieldProps = {
  id: string;
  value: number;
  onChange: (amount: number) => void;
  /** The year's federal cap. Zero or undefined hides the max control. */
  max: number;
  year: string;
  /** Keeps the helper row's height when there is nothing to say. */
  helperSpacer: ReactNode;
  variant?: "standard" | "outlined";
};

/**
 * 401(k)/IRA entry, with a control to jump to the year's federal maximum and
 * a clamp back down on blur.
 *
 * Shared so the calculator and the comparison page enforce the same cap; a
 * second copy would be free to disagree about what the maximum is.
 */
export function Contribution401kField({
  id,
  value,
  onChange,
  max,
  year,
  helperSpacer,
  variant = "outlined",
}: Contribution401kFieldProps) {
  const atMax = max > 0 && value === max;
  const note = atMax ? `Max 401(k) contribution for ${year}` : null;
  const helperId = `${id}-helper-text`;

  return (
    <TextField
      id={id}
      label="401(k) / IRA Contributions"
      type="text"
      variant={variant}
      helperText={note ?? helperSpacer}
      FormHelperTextProps={{ id: helperId }}
      inputProps={{
        inputMode: "numeric",
        autoComplete: "off",
        "aria-describedby": note ? helperId : undefined,
      }}
      value={value ? value.toLocaleString("en-US") : ""}
      onChange={(event) => {
        const digits = event.target.value.replace(/[^0-9]/g, "");
        onChange(digits ? Math.max(0, parseInt(digits, 10)) : 0);
      }}
      onBlur={() => {
        if (max > 0 && value > max) onChange(max);
      }}
      InputProps={{
        startAdornment: <InputAdornment position="start">$</InputAdornment>,
        endAdornment:
          !atMax && max > 0 ? (
            <InputAdornment position="end">
              <Tooltip title={`Set to max allowed for ${year}`}>
                <IconButton
                  aria-label="Set to max allowed for year"
                  onClick={() => onChange(max)}
                  edge="end"
                >
                  <KeyboardDoubleArrowUp />
                </IconButton>
              </Tooltip>
            </InputAdornment>
          ) : null,
      }}
    />
  );
}
