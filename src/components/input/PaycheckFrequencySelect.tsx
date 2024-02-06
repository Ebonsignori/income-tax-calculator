import type { PaycheckFrequency } from "@/constants/paycheck-frequency";
import { PAYCHECK_FREQUENCIES } from "@/constants/paycheck-frequency";
import { EVENTS, sendAnalyticsEvent } from "@/utils/analytics";
import { snakeToTitleCase } from "@/utils/string-utils";
import { MenuItem, TextField } from "@mui/material";

type PaycheckFrequencyProps = {
  paycheckFrequency: PaycheckFrequency;
  // eslint-disable-next-line no-unused-vars
  setPaycheckFrequency: (val: PaycheckFrequency) => void;
};

export function PaycheckFrequencySelect({
  paycheckFrequency,
  setPaycheckFrequency,
}: PaycheckFrequencyProps) {
  return (
    <TextField
      select
      label="Paycheck Frequency"
      value={paycheckFrequency}
      onChange={(e) => {
        setPaycheckFrequency(e.target.value as PaycheckFrequency);
        sendAnalyticsEvent(EVENTS.CHANGE_PAYCHECK_FREQUENCY, e.target.value);
      }}
      fullWidth
      variant="standard"
    >
      {PAYCHECK_FREQUENCIES.map((option) => (
        <MenuItem key={option} value={option}>
          {snakeToTitleCase(option)}
        </MenuItem>
      ))}
    </TextField>
  );
}
