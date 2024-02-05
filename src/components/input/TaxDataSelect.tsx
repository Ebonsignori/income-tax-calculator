import { EVENTS, sendAnalyticsEvent } from "@/utils/analytics";
import { capitalizeFirstLetter } from "@/utils/string-utils";
import { Autocomplete, TextField } from "@mui/material";

export type TaxDataSelectOption = {
  title: string;
};

type TaxDataSelectProps = {
  label: string;
  taxData: TaxDataSelectOption[];
  selectedTaxData: TaxDataSelectOption[];
  setSelectedTaxData: (val: TaxDataSelectOption[]) => void;
};

export function TaxDataSelect({
  label,
  taxData,
  selectedTaxData,
  setSelectedTaxData,
}: TaxDataSelectProps) {
  return (
    <Autocomplete
      id="tax-data-select"
      aria-label="Tax Data Select"
      multiple
      isOptionEqualToValue={(option, value) => {
        return option.title === value.title;
      }}
      options={taxData}
      getOptionLabel={(option) => capitalizeFirstLetter(option?.title || "")}
      freeSolo={false}
      value={selectedTaxData}
      onChange={(e, val: TaxDataSelectOption[]) => {
        if (val) {
          setSelectedTaxData(val);
          sendAnalyticsEvent(
            EVENTS.CHANGE_TAX_OPTIONS,
            val.map((v) => v.title?.toLowerCase()),
          );
        }
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
