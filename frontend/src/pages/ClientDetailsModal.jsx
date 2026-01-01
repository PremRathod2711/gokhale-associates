import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Grid,
  Chip,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

export default function ClientDetailsModal({ clientId, onClose }) {
  const { user } = useAuth();
  const [client, setClient] = useState(null);

  useEffect(() => {
    if (!user || !clientId) return;

    const fetchDetails = async () => {
      try {
        let url = "";

        if (user.role === "ASSOCIATE") {
          url = `/dashboard/client/${clientId}`;
        } else if (user.role === "CA") {
          url = `/dashboard/ca/client/${clientId}`;
        } else if (user.role === "ADMIN") {
          url = `/dashboard/admin/client/${clientId}`;
        }

        const res = await api.get(url);
        setClient(res.data.data);
      } catch (err) {
        console.error("Client details fetch failed", err.response?.data);
        onClose();
      }
    };

    fetchDetails();
  }, [clientId, user, onClose]);


  if (!client) return null;

  return (
    <Dialog
      open
      onClose={onClose}
      maxWidth="md"
      fullWidth
      disablePortal
      sx={{ zIndex: 1500 }}
      PaperProps={{
        sx: {
          backgroundColor: "#ffffff",
          borderRadius: 3,
          position: "relative",
          zIndex: 1501,
        },
      }}
      BackdropProps={{
        sx: {
          backgroundColor: "rgba(0,0,0,0.45)",
          zIndex: 1500,
        },
      }}
    >
      {/* HEADER */}
      <DialogTitle>
        <Typography variant="h6" fontWeight={600}>
          Client Details
        </Typography>
      </DialogTitle>

      <DialogContent dividers>
        {/* BASIC INFO */}
        <Grid container spacing={3} mb={1}>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="text.secondary">
              Name
            </Typography>
            <Typography fontWeight={500}>{client.name}</Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="text.secondary">
              Email
            </Typography>
            <Typography fontWeight={500}>{client.email}</Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="text.secondary">
              Phone
            </Typography>
            <Typography fontWeight={500}>{client.phone}</Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="text.secondary">
              PAN
            </Typography>
            <Typography fontWeight={500}>{client.panNumber}</Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* STATUS */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="text.secondary">
              Status
            </Typography>
            <Box mt={0.5}>
              <Chip label={client.status} color="warning" size="small" />
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="text.secondary">
              Assigned CA
            </Typography>
            <Typography fontWeight={500}>
              {client.assignedCA?.name || "—"}
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* DOCUMENTS */}
        <Box mb={3}>
          <Typography variant="subtitle1" fontWeight={600} mb={1}>
            Documents
          </Typography>

          {client.documents.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No documents
            </Typography>
          ) : (
            <List dense>
              {client.documents.map((doc, i) => (
                <ListItem key={i} disablePadding>
                  <ListItemText primary={doc.name} />
                </ListItem>
              ))}
            </List>
          )}
        </Box>

        {/* REMARKS */}
        <Box>
          <Typography variant="subtitle1" fontWeight={600} mb={1}>
            Remarks
          </Typography>

          {client.remarks.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No remarks
            </Typography>
          ) : (
            client.remarks.map((r, i) => (
              <Box
                key={i}
                mb={2}
                p={2}
                sx={{
                  border: "1px solid #e5e7eb",
                  borderRadius: 2,
                }}
              >
                <Typography variant="body2">{r.remark}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {r.byRole}
                </Typography>
              </Box>
            ))
          )}
        </Box>
      </DialogContent>

      {/* FOOTER */}
      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
