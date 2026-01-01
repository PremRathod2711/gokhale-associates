import { useState } from "react";
import { editBilling } from "../api/clientApi";
import { useSnackbar } from "../ui/snackbar";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button
} from "@mui/material";

export default function EditBillingModal({ client, onClose, onSuccess }) {
  const { showSnackbar } = useSnackbar();
  const [amount, setAmount] = useState(client.billingAmount);

  const submit = async () => {
    try {
      await editBilling(client._id, { billingAmount: amount });
      showSnackbar({ message: "Billing updated" });
      onSuccess();
    } catch (err) {
      showSnackbar({
        message: err.response?.data?.message || "Failed",
        severity: "error"
      });
    }
  };

  return (
    <Dialog open onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Edit Billing</DialogTitle>

      <DialogContent>
        <TextField
          type="number"
          fullWidth
          value={amount}
          onChange={e => setAmount(e.target.value)}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={submit}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}
