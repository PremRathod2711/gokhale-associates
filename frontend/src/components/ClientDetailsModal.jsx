import { useEffect, useState } from "react";
import api from "../api/axios";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Button,
  Grid,
  Divider,
} from "@mui/material";

// ---------- STATUS BADGE ----------
const StatusBadge = ({ status }) => {
  const map = {
    CLOSED: { color: "#991b1b", bg: "#fee2e2" },
    COMPLETED: { color: "#166534", bg: "#dcfce7" },
    APPROVED: { color: "#1d4ed8", bg: "#dbeafe" },
    PENDING: { color: "#92400e", bg: "#fef3c7" },
  };

  const s = map[status] || {
    color: "#334155",
    bg: "#e5e7eb",
  };

  return (
    <Box
      sx={{
        display: "inline-block",
        px: 1.5,
        py: 0.5,
        borderRadius: 2,
        fontSize: 12,
        fontWeight: 600,
        color: s.color,
        backgroundColor: s.bg,
      }}
    >
      {status}
    </Box>
  );
};

export default function ClientDetailsModal({ clientId, open, onClose }) {
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!clientId || !open) return;

    const fetchClient = async () => {
      setLoading(true);
      const res = await api.get(`/admin/users/clients/${clientId}`);
      setClient(res.data.data);
      setLoading(false);
    };

    fetchClient();
  }, [clientId, open]);

  if (!open) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography fontSize={20} fontWeight={700}>
          Client Details
        </Typography>
        <Typography fontSize={14} color="text.secondary">
          View complete information
        </Typography>
      </DialogTitle>

      <DialogContent dividers>
        {loading || !client ? (
          <Typography>Loading...</Typography>
        ) : (
          <>
            {/* BASIC INFO */}
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">
                  Name
                </Typography>
                <Typography fontWeight={500}>{client.name}</Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">
                  Email
                </Typography>
                <Typography fontWeight={500}>{client.email}</Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">
                  PAN Number
                </Typography>
                <Typography fontWeight={500}>{client.panNumber}</Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">
                  Status
                </Typography>
                <Box mt={0.5}>
                  <StatusBadge status={client.status} />
                </Box>
              </Grid>

              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">
                  Created By
                </Typography>
                <Typography fontWeight={500}>
                  {client.createdBy?.name || "—"}
                </Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">
                  Assigned CA
                </Typography>
                <Typography fontWeight={500}>
                  {client.assignedCA?.name || "—"}
                </Typography>
              </Grid>
            </Grid>

            {/* CLOSED INFO */}
            {client.status === "CLOSED" && (
              <>
                <Divider sx={{ my: 3 }} />

                <Typography fontWeight={600} mb={1}>
                  Closure Details
                </Typography>

                <Typography fontSize={14}>
                  Closed On:{" "}
                  {client.closedAt
                    ? new Date(client.closedAt).toLocaleDateString()
                    : "—"}
                </Typography>
              </>
            )}

            {/* 🔥 REMARKS — SHOWN FOR COMPLETED + CLOSED */}
            {client.remarks?.length > 0 && (
              <>
                <Divider sx={{ my: 3 }} />

                <Typography fontWeight={600} mb={1}>
                  Remarks
                </Typography>

                {client.remarks.map((r, i) => (
                  <Box
                    key={i}
                    mt={1}
                    p={1.5}
                    sx={{
                      borderRadius: 2,
                      backgroundColor:
                        r.byRole === "ADMIN" ? "#fef2f2" : "#f8fafc",
                      border:
                        r.byRole === "ADMIN"
                          ? "1px solid #fecaca"
                          : "1px solid #e5e7eb",
                    }}
                  >
                    <Typography fontSize={14}>{r.remark}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {r.byRole}
                    </Typography>
                  </Box>
                ))}
              </>
            )}
          </>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
