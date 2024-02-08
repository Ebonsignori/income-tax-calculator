import { EVENTS, sendAnalyticsEvent } from "@/utils/analytics";
import { snakeToDashCase, yearDisplay } from "@/utils/string-utils";
import { MenuItem, TextField } from "@mui/material";

type YearSelectProps = {
  availableYears: string[];
  year: string;
  USAState: string;
  USACity: string;
  // eslint-disable-next-line no-unused-vars
  setYear: (val: string) => void;
  baseRoute?: string;
};

export function YearSelect({
  availableYears,
  year,
  USAState,
  USACity,
  setYear,
  baseRoute = "",
}: YearSelectProps) {
  return (
    <TextField
      fullWidth
      select
      label="Tax Year"
      id="tax-year-select"
      aria-label="Tax Year Select"
      data-testid="tax-year-select"
      value={year}
      onChange={(e) => {
        const year = e.target.value;
        let newUrl = `${baseRoute}/${year}`;
        if (USAState) {
          newUrl += `/${snakeToDashCase(USAState)}`;
        }
        if (USACity) {
          newUrl += `/${snakeToDashCase(USACity)}`;
        }
        window.history.replaceState({}, "", newUrl);
        setYear(e.target.value);
        sendAnalyticsEvent(EVENTS.CHANGE_YEAR, year);
      }}
      variant="standard"
    >
      {availableYears.map((option: string) => (
        <MenuItem key={option} value={option}>
          {yearDisplay(option)}
        </MenuItem>
      ))}
    </TextField>
  );
}
