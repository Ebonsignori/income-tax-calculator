import type { TaxOption } from "@/utils/get-tax-options";
import { EVENTS, sendAnalyticsEvent } from "@/utils/analytics";
import { capitalizeFirstLetter } from "@/utils/string-utils";
import { Autocomplete, TextField } from "@mui/material";

type TaxOptionsSelectProps = {
  label: string;
  taxOptions: TaxOption[];
  selectedTaxOptions: TaxOption[];
  // eslint-disable-next-line no-unused-vars
  setSelectedTaxOptions: (val: TaxOption[]) => void;
  "data-testid"?: string;
};

export function TaxOptionsSelect({
  label,
  taxOptions,
  selectedTaxOptions,
  setSelectedTaxOptions,
  "data-testid": dataTestId,
}: TaxOptionsSelectProps) {
  return (
    <Autocomplete
      data-testid={dataTestId}
      id={`${label.toLowerCase().replace(/\s+/g, "-")}-select`}
      multiple
      disableCloseOnSelect
      isOptionEqualToValue={(option, value) => {
        return option.value === value.value;
      }}
      options={taxOptions}
      getOptionLabel={(option) => capitalizeFirstLetter(option?.title || "")}
      freeSolo={false}
      getOptionDisabled={(option) => option?.disabled}
      value={selectedTaxOptions}
      onChange={(e, val: TaxOption[]) => {
        if (val) {
          setSelectedTaxOptions(val);
          let event = EVENTS.CHANGE_TAX_OPTIONS;
          if (label.includes("exemptions")) {
            event = EVENTS.CHANGE_TAX_EXEMPTIONS;
          }
          sendAnalyticsEvent(
            event,
            val.map((v) => v.value),
          );
        }
      }}
      renderInput={(params) => {
        const { key, ...props } = params as any;
        const newKey = key || props.id || label;
        if (props.key) delete props.key;
        return (
          <TextField key={newKey} {...props} label={label} variant="standard" />
        );
      }}
    />
  );
}
