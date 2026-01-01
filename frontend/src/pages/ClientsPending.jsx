import { useEffect, useState } from "react";
import api from "../api/axios";
import AddClientModal from "./AddClientModal";
import UploadXmlModal from "./UploadXmlModal";
import ClientStatusModal from "./ClientStatusModal";
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import GlobalSearch from "../components/GlobalSearch";
import EditClientModal from "../components/EditClientModal";

export default function ClientsPending() {
  const [clients, setClients] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [activeClientId, setActiveClientId] = useState(null);
  const [uploadClientId, setUploadClientId] = useState(null);
  const [search, setSearch] = useState("");
  const [editClient, setEditClient] = useState(null);

  const fetchClients = async () => {
    const res = await api.get("/dashboard/section/PENDING", {
      params: { search },
    });

    setClients(res.data.data);
  };

  useEffect(() => {
    fetchClients();
  }, [search]);

  return (
    <>
      {/* HEADER */}
      <Box
        mb={4}
        display="flex"
        alignItems="flex-start"
        justifyContent="space-between"
      >
        <Box>
          <Typography variant="h4" fontWeight={600}>
            Clients Pending
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Pending: {clients.length}
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<PersonAddIcon />}
          onClick={() => setShowAdd(true)}
        >
          Add Client
        </Button>
      </Box>

      {/* SEARCH */}
      <Box mb={2}>
        <GlobalSearch
          value={search}
          onChange={setSearch}
          placeholder="Search by name, email, PAN"
        />
      </Box>

      {/* EMPTY STATE */}
      {clients.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: "center" }}>
          <Typography variant="h6" fontWeight={500}>
            No pending clients
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={1}>
            Add a new client to get started
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
                    <Chip label={client.status} color="warning" size="small" />
                  </TableCell>

                  <TableCell align="right">
                    <Box display="flex" gap={1} justifyContent="flex-end">
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditClient(client);
                        }}
                      >
                        Edit
                      </Button>

                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<UploadFileIcon />}
                        onClick={(e) => {
                          e.stopPropagation();
                          setUploadClientId(client._id);
                        }}
                      >
                        Upload XML
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* MODALS */}
      {showAdd && (
        <AddClientModal
          onClose={() => setShowAdd(false)}
          onSuccess={() => {
            setShowAdd(false);
            fetchClients();
          }}
        />
      )}

      {activeClientId && (
        <ClientStatusModal
          clientId={activeClientId}
          onClose={() => setActiveClientId(null)}
          onSuccess={() => {
            setActiveClientId(null);
            fetchClients();
          }}
        />
      )}

      {uploadClientId && (
        <UploadXmlModal
          clientId={uploadClientId}
          onClose={() => setUploadClientId(null)}
          onSuccess={fetchClients}
        />
      )}

      {editClient && (
        <EditClientModal
          client={editClient}
          onClose={() => setEditClient(null)}
          onSuccess={() => {
            setEditClient(null);
            fetchClients();
          }}
        />
      )}
    </>
  );
}
