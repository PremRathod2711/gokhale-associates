import { useEffect, useState } from "react";
import api from "../api/axios";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  TextField,
  CircularProgress,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";

export default function SendToCaModal({ clientId, onClose, onSuccess }) {
  const [cas, setCas] = useState([]);
  const [selectedCa, setSelectedCa] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCas = async () => {
      try {
        const res = await api.get("/public/cas");
        setCas(res.data.data);
      } catch {
        setError("Failed to load CA list");
      }
    };

    fetchCas();
  }, []);

  const submit = async () => {
    if (!selectedCa) {
      setError("Please select a CA");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await api.post(`/client-actions/associate/form-filled/${clientId}`, {
        caId: selectedCa,
      });

      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send to CA");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      sx={{ zIndex: 1500 }}
      PaperProps={{
        sx: {
          borderRadius: 3,
        },
      }}
      BackdropProps={{
        sx: {
          backgroundColor: "rgba(0,0,0,0.45)",
        },
      }}
    >
      {/* HEADER */}
      <DialogTitle>
        <Typography component="div" variant="h6" fontWeight={600}>
          Send to CA
        </Typography>
      </DialogTitle>

      {/* BODY */}
      <DialogContent dividers>
        {error && (
          <Typography color="error" variant="body2" mb={2}>
            {error}
          </Typography>
        )}

        <Box>
          <Autocomplete
            options={cas}
            loading={!cas.length}
            isOptionEqualToValue={(option, value) => option._id === value._id}
            getOptionLabel={(option) =>
              option?.name ? `${option.name} (${option.email})` : ""
            }
            value={cas.find((c) => c._id === selectedCa) || null}
            onChange={(_, newValue) => {
              setSelectedCa(newValue ? newValue._id : "");
            }}
            slotProps={{
              popper: {
                sx: {
                  zIndex: 2000,
                },
              },
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select CA"
                fullWidth
                disabled={loading}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {!cas.length && <CircularProgress size={18} />}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
        </Box>
      </DialogContent>

      {/* FOOTER */}
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>

        <Button variant="contained" onClick={submit} disabled={loading}>
          {loading ? <CircularProgress size={22} color="inherit" /> : "Send"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
