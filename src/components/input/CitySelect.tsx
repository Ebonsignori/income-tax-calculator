import type { AvailableStatesAndCities } from "@/types";
import { EVENTS, sendAnalyticsEvent } from "@/utils/analytics";
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
  // eslint-disable-next-line no-unused-vars
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
    if (typeof availableStatesAndCities[USAState]?.cities === "undefined") {
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
      />
    );
  }
  return (
    <Autocomplete
      id="city-select"
      aria-label="City Select"
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
        if (val && cityOptions.find((c) => c.title?.toLowerCase() === city)) {
          window.history.replaceState(
            {},
            "",
            `${baseRoute}/${year}/${snakeToDashCase(USAState)}/${snakeToDashCase(city)}`,
          );
          setUSACity(city);
          sendAnalyticsEvent(EVENTS.CHANGE_CITY, city);
        } else {
          setUSACity("");
          window.history.replaceState(
            {},
            "",
            `${baseRoute}/${year}/${snakeToDashCase(USAState)}`,
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
