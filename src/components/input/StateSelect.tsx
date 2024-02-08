import { ALL_STATES } from "@/constants/states";
import type { AutocompleteOption, AvailableStatesAndCities } from "@/types";
import { EVENTS, sendAnalyticsEvent } from "@/utils/analytics";
import {
  snakeToDashCase,
  snakeToTitleCase,
  toSnakeCase,
} from "@/utils/string-utils";
import { Autocomplete, TextField } from "@mui/material";
import { useMemo } from "react";

type StateSelectProps = {
  availableStatesAndCities: AvailableStatesAndCities;
  year: string;
  USAState: string;
  // eslint-disable-next-line no-unused-vars
  setUSAState: (val: string) => void;
  // eslint-disable-next-line no-unused-vars
  setUSACity: (val: string) => void;
  baseRoute?: string;
};

export function StateSelect({
  availableStatesAndCities,
  year,
  USAState,
  setUSAState,
  setUSACity,
  baseRoute = "",
}: StateSelectProps) {
  const stateOptions = useMemo((): AutocompleteOption[] => {
    return ALL_STATES.map((state) => {
      const firstLetter = state[0].toUpperCase();
      return {
        firstLetter,
        title: snakeToTitleCase(state),
        disabled: typeof availableStatesAndCities[state] === "undefined",
      };
    }).sort((a, b) => {
      if (a.disabled && !b.disabled) return 1;
      if (!a.disabled && b.disabled) return -1;
      if (a.firstLetter > b.firstLetter) return 1;
      if (a.firstLetter < b.firstLetter) return -1;
      return 0;
    });
  }, [availableStatesAndCities]);

  return (
    <Autocomplete
      id="state-select"
      aria-label="State Select"
      options={stateOptions}
      groupBy={(option) => option.firstLetter}
      isOptionEqualToValue={(option, value) => {
        return toSnakeCase(option?.title) === toSnakeCase(value?.title);
      }}
      getOptionLabel={(option) => snakeToTitleCase(option?.title) || ""}
      getOptionDisabled={(option) => option.disabled}
      freeSolo={false}
      value={
        USAState
          ? {
              title: USAState,
              firstLetter: (USAState?.[0] || "").toUpperCase(),
              disabled: false,
            }
          : null
      }
      onInputChange={(e, val) => {
        const state = toSnakeCase(val);
        if (state === USAState) return;
        if (val && ALL_STATES.includes(state)) {
          window.history.replaceState(
            {},
            "",
            `${baseRoute}/${year}/${snakeToDashCase(state)}`,
          );
          sendAnalyticsEvent(EVENTS.CHANGE_STATE, state);
          setUSAState(state);
          setUSACity("");
        } else if (!val) {
          window.history.replaceState({}, "", `${baseRoute}/${year}`);
          setUSAState("");
          setUSACity("");
        }
      }}
      renderInput={(params) => {
        const { key, ...props } = params as any;
        return (
          <TextField
            key={props.id || key}
            {...props}
            label="State"
            variant="standard"
          />
        );
      }}
    />
  );
}
