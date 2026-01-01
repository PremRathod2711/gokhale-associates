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
  Button,
  CircularProgress,
} from "@mui/material";
import GlobalSearch from "../components/GlobalSearch";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import UploadXmlModal from "./UploadXmlModal";

export default function FiledForms() {
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeClientId, setActiveClientId] = useState(null);
  const [uploadClientId, setUploadClientId] = useState(null);

  const fetchFiledClients = async (q = "") => {
    try {
      setLoading(true);
      const res = await api.get("/dashboard/section/FILED", {
        params: { search: q },
      });
      setClients(res.data.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiledClients(search);
  }, [search]);

  return (
    <Box>
      {/* HEADER */}
      <Box mb={4}>
        <Typography variant="h4" fontWeight={600}>
          Filed Forms
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Forms filed and ready to be sent for CA review
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

      {/* CONTENT */}
      {loading ? (
        <Box display="flex" alignItems="center" gap={2}>
          <CircularProgress size={26} />
          <Typography variant="body1" color="text.secondary">
            Loading filed forms...
          </Typography>
        </Box>
      ) : clients.length === 0 ? (
        /* EMPTY STATE */
        <Paper sx={{ p: 6, textAlign: "center" }}>
          <Typography variant="h6" fontWeight={500}>
            No Filed Forms
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={1}>
            Filed forms will appear here once available
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
                <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>PAN</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="right">
                  Action
                </TableCell>
                <TableCell align="right">Update XML</TableCell>
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
                    <Typography variant="body2" color="text.secondary">
                      {client.panNumber}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Chip label={client.status} color="info" size="small" />
                  </TableCell>

                  <TableCell align="right"></TableCell>
                  <TableCell align="right">
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<UploadFileIcon />}
                      onClick={(e) => {
                        e.stopPropagation();
                        setUploadClientId(client._id);
                      }}
                    >
                      Update XML
                    </Button>
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
            fetchFiledClients(search);
          }}
        />
      )}
      {uploadClientId && (
        <UploadXmlModal
          client={clients.find((c) => c._id === uploadClientId)}
          onClose={() => setUploadClientId(null)}
          onSuccess={() => {
            setUploadClientId(null);
            fetchFiledClients(search);
          }}
        />
      )}
    </Box>
  );
}
