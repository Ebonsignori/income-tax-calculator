import { TaxOption } from "@/utils/get-tax-options";
import { capitalizeFirstLetter } from "@/utils/string-utils";
import { Autocomplete, TextField } from "@mui/material";

type TaxOptionsSelectProps = {
  label: string;
  taxOptions: TaxOption[];
  selectedTaxOptions: TaxOption[];
  setSelectedTaxOptions: (val: TaxOption[]) => void;
};

export function TaxOptionsSelect({
  label,
  taxOptions,
  selectedTaxOptions,
  setSelectedTaxOptions,
}: TaxOptionsSelectProps) {
  return (
    <Autocomplete
      id="tax-options-select"
      aria-label="Tax Options Select"
      multiple
      isOptionEqualToValue={(option, value) => {
        return option.value === value.value;
      }}
      options={taxOptions}
      getOptionLabel={(option) => capitalizeFirstLetter(option?.title || "")}
      freeSolo={false}
      getOptionDisabled={(option) => option?.disabled}
      value={selectedTaxOptions}
      onChange={(e, val: TaxOption[]) => {
        if (val) setSelectedTaxOptions(val);
      }}
      renderInput={(params) => {
        const { key, ...props } = params as any;
        const newKey = key || props.id || label;
        if (props.key) delete props.key;
        return (
          <TextField {...props} key={newKey} label={label} variant="standard" />
        );
      }}
    />
  );
}
