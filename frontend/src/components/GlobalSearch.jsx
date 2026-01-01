import { TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useState } from "react";

export default function GlobalSearch({
  value = "",
  onChange,
  placeholder = "Search by name, email, PAN",
  debounce = 400,
  fullWidth = true,
}) {
  const [internalValue, setInternalValue] = useState(value);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  useEffect(() => {
    const handler = setTimeout(() => {
      onChange(internalValue.trim());
    }, debounce);

    return () => clearTimeout(handler);
  }, [internalValue, debounce, onChange]);

  return (
    <TextField
      size="small"
      value={internalValue}
      onChange={(e) => setInternalValue(e.target.value)}
      placeholder={placeholder}
      fullWidth={fullWidth}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon color="action" />
          </InputAdornment>
        ),
      }}
    />
  );
}
