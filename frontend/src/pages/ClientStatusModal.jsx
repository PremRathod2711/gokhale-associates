import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import SendToCaModal from "./SendToCaModal";
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
  TextField,
  Checkbox,
  FormControlLabel,
  CircularProgress,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { useSnackbar } from "../ui/snackbar";

export default function ClientStatusModal({ clientId, onClose, onSuccess }) {
  const { user } = useAuth();
  const { showSnackbar } = useSnackbar();

  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const [showSendToCa, setShowSendToCa] = useState(false);
  const [remark, setRemark] = useState("");

  const [billingAmount, setBillingAmount] = useState("");
  const [formSigned, setFormSigned] = useState(false);

  const [paymentDate, setPaymentDate] = useState("");

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        let endpoint = `/dashboard/client/${clientId}`;

        if (user?.role === "CA") {
          endpoint = `/dashboard/ca/client/${clientId}`;
        } else if (user?.role === "ADMIN") {
          endpoint = `/dashboard/admin/client/${clientId}`;
        }

        const res = await api.get(endpoint);
        setClient(res.data.data);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchDetails();
  }, [clientId, user]);

  if (loading || !client) return null;

  const statusColor = {
    PENDING: "warning",
    FILED: "info",
    PENDING_REVIEW: "primary",
    CA_APPROVED: "success",
    BILLED: "secondary",
    ADMIN_APPROVED: "dark",
    COMPLETED: "success",
  }[client.status];

  const approveBilling = async () => {
    try {
      setProcessing(true);
      await api.post(`/client-actions/admin/approve-billing/${client._id}`);
      onSuccess();
    } catch (err) {
      showSnackbar({
        message: err.response?.data?.message || "Billing approval failed",
        severity: "error",
      });
    } finally {
      setProcessing(false);
    }
  };

  const markPaymentDone = async () => {
    if (!paymentDate) {
      showSnackbar({
        message: "Please select payment collection date",
        severity: "warning",
      });
      return;
    }

    try {
      setProcessing(true);

      await api.post(`/client-actions/admin/payment-done/${client._id}`, {
        billingAmountCollectedDate: paymentDate, // "YYYY-MM-DD"
      });

      onSuccess();
    } catch (err) {
      showSnackbar({
        message: err.response?.data?.message || "Failed to mark payment",
        severity: "error",
      });
    } finally {
      setProcessing(false);
    }
  };

  const approveByCa = async () => {
    if (!remark.trim()) {
      showSnackbar({
        message: "Approval remark is required",
        severity: "warning",
      });
      return;
    }

    try {
      setProcessing(true);
      await api.post(`/client-actions/ca/approve/${client._id}`, { remark });
      onSuccess();
    } catch (err) {
      showSnackbar({
        message: err.response?.data?.message || "CA approval failed",
        severity: "error",
      });
    } finally {
      setProcessing(false);
    }
  };

  const submitBilling = async () => {
    if (!billingAmount || Number(billingAmount) <= 0) {
      showSnackbar({
        message: "Enter valid billing amount",
        severity: "warning",
      });

      return;
    }

    if (!formSigned) {
      showSnackbar({
        message: "Please confirm form is signed",
        severity: "warning",
      });
      return;
    }

    try {
      setProcessing(true);
      await api.post(`/client-actions/associate/submit-bill/${client._id}`, {
        billingAmount: Number(billingAmount),
        formSigned: true,
      });
      onSuccess();
    } catch (err) {
      showSnackbar({
        message: err.response?.data?.message || "Billing submission failed",
        severity: "error",
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <>
      <Dialog
        open
        onClose={onClose}
        maxWidth="md"
        fullWidth
        disablePortal
        PaperProps={{
          sx: { borderRadius: 3 },
        }}
        BackdropProps={{
          sx: { backgroundColor: "rgba(0,0,0,0.45)" },
        }}
      >
        {/* HEADER */}
        <DialogTitle>
          <Typography component="div" variant="h6" fontWeight={600}>
            Client Details
          </Typography>
        </DialogTitle>

        <DialogContent dividers>
          {/* STATUS */}
          <Box mb={2}>
            <Chip label={client.status} color={statusColor} size="small" />
          </Box>

          {/* BASIC INFO */}
          <Grid container spacing={3} mb={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary">
                Name
              </Typography>
              <Typography>{client.name}</Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary">
                Email
              </Typography>
              <Typography>{client.email}</Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary">
                Phone
              </Typography>
              <Typography>{client.phone}</Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary">
                PAN
              </Typography>
              <Typography>{client.panNumber}</Typography>
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />

          {/* BILLING INFO */}
          {client.billingAmount && (
            <Box mb={2}>
              <Typography fontWeight={600} mb={1}>
                Billing Details
              </Typography>
              <Typography variant="body2">
                Amount: ₹{client.billingAmount}
              </Typography>
              <Typography variant="body2">
                Payment Date:{" "}
                {client.billingAmountCollectedDate
                  ? new Date(
                      client.billingAmountCollectedDate
                    ).toLocaleDateString()
                  : "—"}
              </Typography>
            </Box>
          )}
          
          {/* XML DRAFT */}
          <Box mb={2}>
            <Typography fontWeight={600}>XML Draft</Typography>

            {client.formDraft ? (
              <Box
                mt={1}
                p={1.5}
                sx={{
                  border: "1px solid #e5e7eb",
                  borderRadius: 2,
                  backgroundColor: "#f8fafc",
                }}
              >
                <Typography variant="body2">
                  File: <b>{client.formDraft}</b>
                </Typography>

                {/* Optional hint */}
                {user?.role === "ASSOCIATE" && client.status === "FILED" && (
                  <Typography variant="caption" color="text.secondary">
                    You can replace this XML while status is FILED
                  </Typography>
                )}
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No XML uploaded
              </Typography>
            )}
          </Box>

          {/* DOCUMENTS */}
          <Box mb={2}>
            <Typography fontWeight={600}>Documents</Typography>
            {client.documents.map((d, i) => (
              <Typography key={i} variant="body2">
                • {d.name}
              </Typography>
            ))}
          </Box>

          {/* REMARKS */}
          <Box mb={2}>
            <Typography fontWeight={600}>Remarks</Typography>
            {client.remarks.map((r, i) => (
              <Box
                key={i}
                p={1.5}
                mt={1}
                sx={{ border: "1px solid #e5e7eb", borderRadius: 2 }}
              >
                <Typography variant="body2">{r.remark}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {r.byRole}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* ASSOCIATE → SEND TO CA */}
          {user?.role === "ASSOCIATE" && client.status === "FILED" && (
            <Box display="flex" justifyContent="flex-end">
              <Button
                variant="contained"
                color="success"
                disabled={processing}
                onClick={() => setShowSendToCa(true)}
              >
                Send to CA
              </Button>
            </Box>
          )}

          {/* ADMIN → APPROVE BILLING */}
          {user?.role === "ADMIN" && client.status === "BILLED" && (
            <Box display="flex" justifyContent="flex-end">
              <Button
                variant="contained"
                disabled={processing}
                onClick={approveBilling}
              >
                Approve Billing
              </Button>
            </Box>
          )}

          {/* ADMIN → PAYMENT DONE */}
          {user?.role === "ADMIN" && client.status === "ADMIN_APPROVED" && (
            <Box mt={2}>
              <DatePicker
                label="Payment Collection Date"
                value={paymentDate ? dayjs(paymentDate) : null}
                maxDate={dayjs()}
                onChange={(newValue) =>
                  setPaymentDate(newValue ? newValue.format("YYYY-MM-DD") : "")
                }
                slotProps={{
                  textField: { fullWidth: true },
                }}
              />

              <Box display="flex" justifyContent="flex-end" mt={2}>
                <Button
                  variant="contained"
                  color="success"
                  disabled={processing}
                  onClick={markPaymentDone}
                >
                  Mark Payment Done
                </Button>
              </Box>
            </Box>
          )}

          {/* ASSOCIATE → SUBMIT BILLING */}
          {user?.role === "ASSOCIATE" && client.status === "CA_APPROVED" && (
            <Box mt={2}>
              <TextField
                type="number"
                fullWidth
                label="Billing Amount (₹)"
                value={billingAmount}
                onChange={(e) => setBillingAmount(e.target.value)}
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={formSigned}
                    onChange={(e) => setFormSigned(e.target.checked)}
                  />
                }
                label="Form signed by client"
              />

              <Box display="flex" justifyContent="flex-end">
                <Button
                  variant="contained"
                  color="warning"
                  disabled={processing}
                  onClick={submitBilling}
                >
                  Submit Billing
                </Button>
              </Box>
            </Box>
          )}

          {/* CA → APPROVE */}
          {user?.role === "CA" && client.status === "PENDING_REVIEW" && (
            <Box mt={2}>
              <TextField
                multiline
                rows={3}
                fullWidth
                label="Approval Remark"
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
              />

              <Box display="flex" justifyContent="flex-end" mt={2}>
                <Button
                  variant="contained"
                  color="success"
                  disabled={processing}
                  onClick={approveByCa}
                >
                  Approve Client
                </Button>
              </Box>
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>

      {showSendToCa && (
        <SendToCaModal
          clientId={client._id}
          onClose={() => setShowSendToCa(false)}
          onSuccess={onSuccess}
        />
      )}
    </>
  );
}
