import { useState } from "react";
import { editClient } from "../api/clientApi";
import { useSnackbar } from "../ui/snackbar";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Divider,
} from "@mui/material";

const NAME_REGEX = /^[A-Za-z ]{3,}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[6-9]\d{9}$/;
const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

export default function EditClientModal({ client, onClose, onSuccess }) {
  const { showSnackbar } = useSnackbar();

  const [form, setForm] = useState({
    name: client.name || "",
    email: client.email || "",
    phone: client.phone || "",
    panNumber: client.panNumber || "",
  });

  const [errors, setErrors] = useState({});
  const isPending = client.status === "PENDING";

  const validate = () => {
    const e = {};

    if (!NAME_REGEX.test(form.name)) e.name = "Name must be at least 3 letters";

    if (!EMAIL_REGEX.test(form.email)) e.email = "Invalid email address";

    if (!PHONE_REGEX.test(form.phone))
      e.phone = "Enter valid 10-digit mobile number";

    if (!PAN_REGEX.test(form.panNumber))
      e.panNumber = "Invalid PAN format (ABCDE1234F)";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async () => {
    if (!validate()) return;

    try {
      await editClient(client._id, {
        name: form.name,
        email: form.email,
        phone: form.phone,
        panNumber: form.panNumber,
      });

      showSnackbar({
        message: "Client details updated successfully",
        severity: "success",
      });

      onSuccess();
    } catch (err) {
      showSnackbar({
        message: err.response?.data?.message || "Update failed",
        severity: "error",
      });
    }
  };

  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {isPending ? "Edit Client Details" : "Client Details Locked"}
      </DialogTitle>

      <DialogContent>
        {isPending ? (
          <>
            <TextField
              label="Name"
              fullWidth
              margin="normal"
              value={form.name}
              error={!!errors.name}
              helperText={errors.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <TextField
              label="Email"
              fullWidth
              margin="normal"
              value={form.email}
              error={!!errors.email}
              helperText={errors.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />

            <TextField
              label="Phone"
              fullWidth
              margin="normal"
              value={form.phone}
              error={!!errors.phone}
              helperText={errors.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />

            <TextField
              label="PAN Number"
              fullWidth
              margin="normal"
              value={form.panNumber}
              error={!!errors.panNumber}
              helperText={errors.panNumber}
              onChange={(e) =>
                setForm({
                  ...form,
                  panNumber: e.target.value.toUpperCase(),
                })
              }
            />
          </>
        ) : (
          <>
            <Typography variant="body2" color="text.secondary">
              Client details cannot be edited after the form is filed.
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="body2">
              <b>Name:</b> {client.name}
            </Typography>
            <Typography variant="body2">
              <b>Email:</b> {client.email}
            </Typography>
            <Typography variant="body2">
              <b>Phone:</b> {client.phone}
            </Typography>
            <Typography variant="body2">
              <b>PAN:</b> {client.panNumber}
            </Typography>
          </>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>

        {isPending && (
          <Button variant="contained" onClick={submit}>
            Save Changes
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
