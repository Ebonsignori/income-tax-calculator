import { EVENTS, sendAnalyticsEvent } from "@/utils/analytics";
import { updateURL, getQueryParams } from "@/utils/base-path";
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
  const currentYear = new Date().getFullYear().toString();

  return (
    <TextField
      fullWidth
      select
      label="Tax Year"
      id="tax-year-select"
      data-testid="tax-year-select"
      value={year}
      onChange={(e) => {
        const selectedYear = e.target.value;

        // Preserve income query param if it exists
        const queryParams = getQueryParams();
        const income = queryParams.get("income");
        const params = income ? { income } : undefined;

        // If selecting current year and no state/city, go to homepage
        const isCurrentYear = selectedYear === currentYear;
        const hasStateOrCity = USAState || USACity;

        let newUrl: string;
        if (isCurrentYear && !hasStateOrCity) {
          newUrl = baseRoute || "/";
        } else {
          newUrl = `${baseRoute}/${selectedYear}`;
          if (USAState) {
            newUrl += `/${snakeToDashCase(USAState)}`;
          }
          if (USACity) {
            newUrl += `/${snakeToDashCase(USACity)}`;
          }
        }

        updateURL(newUrl, params);
        setYear(selectedYear);
        sendAnalyticsEvent(EVENTS.CHANGE_YEAR, selectedYear);
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
