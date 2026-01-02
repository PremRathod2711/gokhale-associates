import { useState } from "react";
import api from "../api/axios";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";

export default function AddClientModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    panNumber: "",
    remarks: "",
  });

  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[6-9]\d{9}$/;
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: null }));
    setApiError("");
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files || []);

    if (selectedFiles.length > 5) {
      setApiError("You can upload a maximum of 5 documents");
      return;
    }

    setApiError("");
    setFiles(selectedFiles.map((f) => ({ name: f.name })));
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const validate = () => {
    const err = {};

    if (!form.name.trim()) err.name = "Name is required";
    if (!form.email.trim()) err.email = "Email is required";
    else if (!emailRegex.test(form.email)) err.email = "Invalid email format";

    if (!form.phone.trim()) err.phone = "Phone number is required";
    else if (!phoneRegex.test(form.phone))
      err.phone = "Enter valid 10-digit Indian mobile number";

    if (!form.panNumber.trim()) err.panNumber = "PAN number is required";
    else if (!panRegex.test(form.panNumber.toUpperCase()))
      err.panNumber = "Invalid PAN format (ABCDE1234F)";

    return err;
  };

  const mapApiErrorToField = (message) => {
    if (!message) return null;

    if (message.toLowerCase().includes("email")) return "email";
    if (message.toLowerCase().includes("phone")) return "phone";
    if (message.toLowerCase().includes("pan")) return "panNumber";

    return null;
  };

  const submit = async () => {
    setApiError("");

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);

      await api.post("/client-actions/associate/add-client", {
        ...form,
        panNumber: form.panNumber.toUpperCase(),
        documents: files,
        remarks: form.remarks?.trim() || null,
      });

      onSuccess();
    } catch (err) {
      const message =
          err.response?.data?.message || "Unable to add client. Please try again.";

      const field = mapApiErrorToField(message);

      if (field) {
        setErrors((prev) => ({
          ...prev,
          [field]: message,
        }));
      } else {
        setApiError(message);
      }
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
      disablePortal
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
          Add Client
        </Typography>
      </DialogTitle>

      {/* BODY */}
      <DialogContent dividers>
        {apiError && (
          <Typography color="error" mb={2} variant="body2">
            {apiError}
          </Typography>
        )}

        <TextField
          fullWidth
          margin="dense"
          name="name"
          label="Full Name"
          value={form.name}
          onChange={handleChange}
          error={!!errors.name}
          helperText={errors.name}
          disabled={loading}
        />

        <TextField
          fullWidth
          margin="dense"
          name="email"
          label="Email Address"
          value={form.email}
          onChange={handleChange}
          error={!!errors.email}
          helperText={errors.email}
          disabled={loading}
        />

        <TextField
          fullWidth
          margin="dense"
          name="phone"
          label="Mobile Number"
          value={form.phone}
          onChange={handleChange}
          error={!!errors.phone}
          helperText={errors.phone}
          disabled={loading}
        />

        <TextField
          fullWidth
          margin="dense"
          name="panNumber"
          label="PAN Number"
          value={form.panNumber}
          onChange={handleChange}
          error={!!errors.panNumber}
          helperText={errors.panNumber}
          disabled={loading}
        />

        <Box mt={2}>
          <Button variant="outlined" component="label" disabled={loading}>
            Upload Documents
            <input type="file" hidden multiple onChange={handleFileChange} />
          </Button>
        </Box>

        {files.length > 0 && (
          <Box mt={2}>
            <Typography variant="body2" fontWeight={500} mb={1}>
              Uploaded Files
            </Typography>

            <Box display="flex" flexWrap="wrap" gap={1}>
              {files.map((f, i) => (
                <Box
                  key={i}
                  display="flex"
                  alignItems="center"
                  gap={1}
                  px={1.5}
                  py={0.75}
                  sx={{
                    border: "1px solid #e5e7eb",
                    borderRadius: 1.5,
                    backgroundColor: "#f8fafc",
                    fontSize: 13,
                  }}
                >
                  <Typography variant="body2" noWrap>
                    {f.name}
                  </Typography>

                  <IconButton
                    size="small"
                    onClick={() => removeFile(i)}
                    disabled={loading}
                    sx={{ p: 0.25 }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Box>
              ))}
            </Box>
          </Box>
        )}

        <TextField
          fullWidth
          margin="dense"
          name="remarks"
          label="Remarks (optional)"
          multiline
          rows={3}
          value={form.remarks}
          onChange={handleChange}
          disabled={loading}
        />
      </DialogContent>

      {/* FOOTER */}
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>

        <Button variant="contained" onClick={submit} disabled={loading}>
          {loading ? (
            <CircularProgress size={22} color="inherit" />
          ) : (
            "Save Client"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
