import type { AvailableStatesAndCities } from "@/types";
import { preserveQueryParams, updateURL } from "@/utils/base-path";
import {
  snakeToDashCase,
  snakeToTitleCase,
  toSnakeCase,
} from "@/utils/string-utils";
import { Autocomplete, TextField } from "@mui/material";
import { useMemo } from "react";

type CitySelectProps = {
  availableStatesAndCities: AvailableStatesAndCities;
  year: string;
  USAState: string;
  USACity: string;
  setUSACity: (val: string) => void;
  baseRoute?: string;
};

export function CitySelect({
  availableStatesAndCities,
  year,
  USAState,
  USACity,
  setUSACity,
  baseRoute = "",
}: CitySelectProps) {
  const cityOptions = useMemo(() => {
    if (
      !availableStatesAndCities ||
      typeof availableStatesAndCities[USAState]?.cities === "undefined"
    ) {
      return null;
    }

    return availableStatesAndCities[USAState]?.cities.map((city: string) => {
      return {
        title: city,
      };
    });
  }, [availableStatesAndCities, USAState]);

  if (!cityOptions) {
    return (
      <TextField
        fullWidth
        label="City"
        variant="standard"
        disabled={true}
        value="No Specific City Taxes"
        inputProps={{
          "aria-label":
            "City - No specific city taxes available for selected state",
        }}
      />
    );
  }
  return (
    <Autocomplete
      id="city-select"
      options={cityOptions}
      getOptionLabel={(option) => snakeToTitleCase(option?.title) || ""}
      freeSolo={false}
      value={
        USACity
          ? {
              title: USACity,
            }
          : null
      }
      isOptionEqualToValue={(option, value) => {
        return toSnakeCase(option?.title) === toSnakeCase(value?.title);
      }}
      onInputChange={(e, val) => {
        const city = toSnakeCase(val);
        if (city === USACity) return;

        const params = preserveQueryParams();

        if (val && cityOptions.find((c) => c.title?.toLowerCase() === city)) {
          updateURL(
            `${baseRoute}/${year}/${snakeToDashCase(USAState)}/${snakeToDashCase(city)}`,
            params,
          );
          setUSACity(city);
        } else {
          setUSACity("");
          updateURL(
            `${baseRoute}/${year}/${snakeToDashCase(USAState)}`,
            params,
          );
        }
      }}
      renderInput={(params) => {
        const { key, ...props } = params as any;
        return (
          <TextField
            key={props.id || key}
            {...props}
            label="City"
            variant="standard"
          />
        );
      }}
    />
  );
}
