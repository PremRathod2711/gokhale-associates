import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
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
  Button,
  CircularProgress,
} from "@mui/material";
import GlobalSearch from "../components/GlobalSearch";
import EditBillingModal from "../components/EditBillingModal";

export default function SignedForms() {
  const { user } = useAuth();

  const [clients, setClients] = useState([]);
  const [activeClientId, setActiveClientId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [billingClient, setBillingClient] = useState(null);

  const getEndpoint = () => {
    if (user.role === "ADMIN") return "/dashboard/admin/section/BILLED";
    if (user.role === "CA") return "/dashboard/ca/section/CA_APPROVED";
    return "/dashboard/section/CA_APPROVED";
  };

  useEffect(() => {
    if (!user) return;

    const fetchClients = async () => {
      try {
        setLoading(true);
        const res = await api.get(getEndpoint(), {
          params: { search },
        });
        setClients(res.data.data);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, [user, search]);

  return (
    <>
      {/* PAGE HEADER */}
      <Box mb={4}>
        <Typography variant="h5" fontWeight={600}>
          Signed & Billed Forms
        </Typography>

        <Typography variant="body1" color="text.secondary" mt={1}>
          {user?.role === "ADMIN" ? "Signed Forms" : "Approved by CA"}
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
            No Signed Forms
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={1}>
            Signed cases will appear here
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
                <TableCell sx={{ fontWeight: 600 }}>PAN Number</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="right">
                  Action
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {clients.map((c) => (
                <TableRow
                  key={c._id}
                  hover
                  onClick={() => setActiveClientId(c._id)}
                  sx={{
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor: "#f8fafc",
                    },
                  }}
                >
                  <TableCell>
                    <Typography fontWeight={500}>{c.name}</Typography>
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {c.email}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {c.panNumber}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Chip label={c.status} color="success" size="small" />
                  </TableCell>
                  <TableCell align="right">
                    {user.role === "ADMIN" && c.status === "BILLED" && (
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={(e) => {
                          e.stopPropagation();
                          setBillingClient(c);
                        }}
                      >
                        Edit Billing
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* MODAL */}
      {activeClientId && (
        <ClientStatusModal
          clientId={activeClientId}
          onClose={() => setActiveClientId(null)}
          onSuccess={() => {
            setActiveClientId(null);
            setLoading(true);
            api
              .get(getEndpoint(), { params: { search } })
              .then((res) => setClients(res.data.data))
              .finally(() => setLoading(false));
          }}
        />
      )}

      {billingClient && (
        <EditBillingModal
          client={billingClient}
          onClose={() => setBillingClient(null)}
          onSuccess={() => {
            setBillingClient(null);
            setLoading(true);
            api
              .get(getEndpoint(), { params: { search } })
              .then((res) => setClients(res.data.data))
              .finally(() => setLoading(false));
          }}
        />
      )}
    </>
  );
}
