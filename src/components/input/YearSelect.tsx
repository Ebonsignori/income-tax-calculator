import { preserveQueryParams, updateURL } from "@/utils/base-path";
import { snakeToDashCase } from "@/utils/string-utils";
import { MenuItem, TextField } from "@mui/material";

type YearSelectProps = {
  availableYears: string[];
  year: string;
  USAState: string;
  USACity: string;
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
  // `availableYears` is sorted newest-first by readTaxDataFromDisk. Use it rather
  // than the calendar year: on January 1st those disagree, and the mismatch
  // routes the newest data year to /{year} while / still serves it, producing
  // two URLs with identical content.
  const latestDataYear = availableYears[0];

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

        const params = preserveQueryParams();

        // If selecting the newest data year and no state/city, go to homepage
        const isCurrentYear = selectedYear === latestDataYear;
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
      }}
      variant="standard"
    >
      {availableYears.map((option: string) => (
        <MenuItem key={option} value={option}>
          {option}
        </MenuItem>
      ))}
    </TextField>
  );
}
