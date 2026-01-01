import { useState } from "react";
import { addCARemark } from "../api/clientApi";
import { useSnackbar } from "../ui/snackbar";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button
} from "@mui/material";

export default function AddRemarkModal({ clientId, onClose, onSuccess }) {
  const { showSnackbar } = useSnackbar();
  const [remark, setRemark] = useState("");

  const submit = async () => {
    try {
      await addCARemark(clientId, { remark });
      showSnackbar({ message: "Remark added" });
      onSuccess();
    } catch (err) {
      showSnackbar({
        message: err.response?.data?.message || "Failed",
        severity: "error"
      });
    }
  };

  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add Remark</DialogTitle>

      <DialogContent>
        <TextField
          multiline
          rows={4}
          fullWidth
          value={remark}
          onChange={e => setRemark(e.target.value)}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={submit}>Submit</Button>
      </DialogActions>
    </Dialog>
  );
}
