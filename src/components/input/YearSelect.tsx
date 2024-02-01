import { yearDisplay } from "@/utils/string-utils";
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
  return (
    <TextField
      fullWidth
      select
      label="Tax Year"
      value={year}
      onChange={(e) => {
        const year = e.target.value;
        let newUrl = `${baseRoute}/${year}`;
        if (USAState) {
          newUrl += `/${USAState}`;
        }
        if (USACity) {
          newUrl += `/${USACity}`;
        }
        window.history.replaceState({}, "", newUrl);
        setYear(e.target.value);
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
