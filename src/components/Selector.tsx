import { useState } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

type SelectorProps<T extends string> = {
  id: string;
  label: string;
  options: readonly { readonly value: T; readonly label: string }[];
  initialValue: T;
  value?: T;
  disabled?: boolean;
  onChange: (value: T) => void;
};

export const Selector = <T extends string>({
  id,
  label,
  options,
  initialValue,
  value: valueProp,
  disabled,
  onChange,
}: SelectorProps<T>) => {
  const [value, setValue] = useState(initialValue);

  const handleChange = (event: SelectChangeEvent) => {
    const value = event.target.value as T;
    setValue(value);
    onChange(value);
  };

  const labelId = `${id}-label`;

  return (
    <FormControl sx={{ m: 1, minWidth: 120 }} disabled={disabled}>
      <InputLabel id={labelId}>{label}</InputLabel>
      <Select
        labelId={labelId}
        id={id}
        label={label}
        value={valueProp || value}
        onChange={handleChange}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
