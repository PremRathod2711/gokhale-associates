import { useEffect, useState } from "react";
import api from "../api/axios";
import ClientStatusModal from "./ClientStatusModal";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  CircularProgress,
} from "@mui/material";
import GlobalSearch from "../components/GlobalSearch";

export default function CompletedForms() {
  const [clients, setClients] = useState([]);
  const [activeClientId, setActiveClientId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchCompleted = async () => {
      try {
        setLoading(true);
        const res = await api.get("/dashboard/admin/section/COMPLETED", {
          params: { search },
        });
        setClients(res.data.data);
      } finally {
        setLoading(false);
      }
    };

    fetchCompleted();
  }, [search]);

  return (
    <>
      {/* PAGE HEADER */}
      <Box mb={4}>
        <Typography variant="h5" fontWeight={600}>
          Billing & Completed Clients
        </Typography>
        <Typography variant="body1" color="text.secondary" mt={1}>
          Approved and completed billing records
        </Typography>
      </Box>

      {/* SEARCH */}
      <Box mb={3}>
        <GlobalSearch
          value={search}
          onChange={setSearch}
          placeholder="Search by name, email, PAN"
        />
      </Box>

      {/* LOADING */}
      {loading ? (
        <Box display="flex" alignItems="center" gap={2}>
          <CircularProgress size={26} />
          <Typography variant="body1" color="text.secondary">
            Loading records...
          </Typography>
        </Box>
      ) : clients.length === 0 ? (
        /* EMPTY STATE */
        <Paper sx={{ p: 6, textAlign: "center" }}>
          <Typography variant="h6" fontWeight={500}>
            No billing records found
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={1}>
            Completed and approved cases will appear here
          </Typography>
        </Paper>
      ) : (
        /* TABLE */
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 3,
            overflow: "hidden",
          }}
        >
          <Table>
            <TableHead sx={{ backgroundColor: "#f1f5f9" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Client Name</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Amount</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Payment Date</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {clients.map((client) => (
                <TableRow
                  key={client._id}
                  hover
                  onClick={() => setActiveClientId(client._id)}
                  sx={{
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor: "#f8fafc",
                    },
                  }}
                >
                  <TableCell>
                    <Typography fontWeight={500}>{client.name}</Typography>
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {client.email}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    {client.billingAmount ? `₹${client.billingAmount}` : "—"}
                  </TableCell>

                  <TableCell>
                    {client.billingAmountCollectedDate
                      ? new Date(
                          client.billingAmountCollectedDate
                        ).toLocaleDateString()
                      : "—"}
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={
                        client.status === "COMPLETED"
                          ? "COMPLETED"
                          : "PAYMENT PENDING"
                      }
                      color={
                        client.status === "COMPLETED" ? "success" : "default"
                      }
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* READ-ONLY DETAILS MODAL */}
      {activeClientId && (
        <ClientStatusModal
          clientId={activeClientId}
          onClose={() => setActiveClientId(null)}
          onSuccess={() => setActiveClientId(null)}
        />
      )}
    </>
  );
}
