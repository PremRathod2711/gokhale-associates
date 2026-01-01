import { useEffect, useState } from "react";
import api from "../api/axios";
import ClientStatusModal from "./ClientStatusModal";

import {
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Button,
  CircularProgress,
} from "@mui/material";
import GlobalSearch from "../components/GlobalSearch";
import AddRemarkModal from "../components/AddRemarkModal";

export default function CAPendingReview() {
  const [clients, setClients] = useState([]);
  const [activeClientId, setActiveClientId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [remarkClientId, setRemarkClientId] = useState(null);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const res = await api.get("/dashboard/ca/section/PENDING_REVIEW", {
        params: { search },
      });
      setClients(res.data.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [search]);

  return (
    <>
      {/* HEADER */}
      <Box mb={3}>
        <Typography variant="h5" fontWeight={600}>
          Pending Review
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Clients waiting for CA approval
        </Typography>
      </Box>

      {/* SEARCH */}
      <Box mb={2}>
        <GlobalSearch
          value={search}
          onChange={setSearch}
          placeholder="Search by name, email, PAN"
        />
      </Box>

      {/* CONTENT */}
      {loading ? (
        <Box display="flex" alignItems="center" gap={2}>
          <CircularProgress size={22} />
          <Typography variant="body2">Loading...</Typography>
        </Box>
      ) : clients.length === 0 ? (
        <Paper sx={{ p: 5, textAlign: "center" }}>
          <Typography variant="h6">No clients pending review</Typography>
          <Typography variant="body2" color="text.secondary">
            Approved clients will move back to Associate
          </Typography>
        </Paper>
      ) : (
        <Paper sx={{ borderRadius: 2, overflow: "hidden" }}>
          <Table>
            <TableHead sx={{ backgroundColor: "#f8fafc" }}>
              <TableRow>
                <TableCell>
                  <b>Name</b>
                </TableCell>
                <TableCell>
                  <b>Email</b>
                </TableCell>
                <TableCell>
                  <b>PAN</b>
                </TableCell>
                <TableCell>
                  <b>Status</b>
                </TableCell>
                <TableCell align="right">
                  <b>Action</b>
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {clients.map((client) => (
                <TableRow
                  key={client._id}
                  hover
                  sx={{ cursor: "pointer" }}
                  onClick={() => setActiveClientId(client._id)}
                >
                  <TableCell>{client.name}</TableCell>
                  <TableCell>{client.email}</TableCell>
                  <TableCell>{client.panNumber}</TableCell>
                  <TableCell>
                    <Chip label={client.status} color="primary" size="small" />
                  </TableCell>

                  <TableCell align="right">
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={(e) => {
                        e.stopPropagation();
                        setRemarkClientId(client._id);
                      }}
                    >
                      Add Remark
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}

      {/* MODAL */}
      {activeClientId && (
        <ClientStatusModal
          clientId={activeClientId}
          onSuccess={() => {
            setActiveClientId(null);
            fetchClients();
          }}
          onClose={() => setActiveClientId(null)}
        />
      )}

      {remarkClientId && (
        <AddRemarkModal
          clientId={remarkClientId}
          onClose={() => setRemarkClientId(null)}
          onSuccess={() => {
            setRemarkClientId(null);
            fetchClients();
          }}
        />
      )}
    </>
  );
}
