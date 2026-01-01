import { useState } from "react";
import api from "../api/axios";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";

export default function UploadXmlModal({ client, onClose, onSuccess }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    if (!file) {
      setError("Please select an XML file");
      return;
    }

    if (!file.name.endsWith(".xml")) {
      setError("Only XML files are allowed");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const endpoint =
        client.status === "PENDING"
          ? `/client-actions/associate/upload-draft/${client._id}`
          : `/client-actions/associate/update-draft/${client._id}`;

      await api.post(endpoint, {
        xmlPath: file.name,
      });

      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  if (!client) return null;

  return (
    <Dialog open onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>
        <Typography variant="h6" fontWeight={600}>
          {client.status === "PENDING"
            ? "Upload XML Draft"
            : "Update XML Draft"}
        </Typography>
      </DialogTitle>

      <DialogContent dividers>
        {error && (
          <Typography color="error" variant="body2" mb={2}>
            {error}
          </Typography>
        )}

        <Box>
          <Button
            variant="outlined"
            component="label"
            fullWidth
            disabled={loading}
          >
            {file ? file.name : "Choose XML File"}
            <input
              type="file"
              hidden
              accept=".xml"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </Button>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>

        <Button variant="contained" onClick={submit} disabled={loading}>
          {loading ? <CircularProgress size={22} /> : "Upload"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
