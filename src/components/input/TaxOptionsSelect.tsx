import type { TaxOption } from "@/utils/get-tax-options";
import { capitalizeFirstLetter } from "@/utils/string-utils";
import { Autocomplete, Chip, TextField } from "@mui/material";

type TaxOptionsSelectProps = {
  label: string;
  /** Explicit so a label rename cannot silently change the DOM id. */
  id: string;
  taxOptions: TaxOption[];
  selectedTaxOptions: TaxOption[];
  setSelectedTaxOptions: (val: TaxOption[]) => void;
  "data-testid"?: string;
};

export function TaxOptionsSelect({
  label,
  id,
  taxOptions,
  selectedTaxOptions,
  setSelectedTaxOptions,
  "data-testid": dataTestId,
}: TaxOptionsSelectProps) {
  return (
    <Autocomplete
      data-testid={dataTestId}
      id={id}
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
        }
      }}
      renderTags={(tagValue, getTagProps) =>
        tagValue.map((option, index) => {
          const { key, ...tagProps } = getTagProps({ index }) as any;
          return (
            <Chip
              key={key}
              label={capitalizeFirstLetter(option?.title || "")}
              {...tagProps}
            />
          );
        })
      }
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
