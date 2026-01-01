import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Stack,
  Typography,
  Chip,
  Box,
} from "@mui/material";

import ConfirmDialog from "../components/ConfirmDialog";
import GlobalSearch from "../components/GlobalSearch";
import {
  fetchClients,
  restoreClient,
  forceDeleteClient,
} from "../services/adminClientApi";
import { useSnackbar } from "../ui/snackbar";

export default function AdminDeletedClients() {
  const [clients, setClients] = useState([]);
  const [action, setAction] = useState(null);
  const [clientId, setClientId] = useState(null);
  const [search, setSearch] = useState("");

  const { showSnackbar } = useSnackbar();

  const loadClients = async () => {
    const res = await fetchClients({ deleted: true, search });
    setClients(res.data.data);
  };

  useEffect(() => {
    loadClients();
  }, [search]);

  const openDialog = (type, id) => {
    setAction(type);
    setClientId(id);
  };

  const closeDialog = () => {
    setAction(null);
    setClientId(null);
  };

  const handleConfirm = async () => {
    try {
      if (action === "restore") await restoreClient(clientId);
      if (action === "force") await forceDeleteClient(clientId);
      showSnackbar({
        message: "Action Successfully Completed",
        severity: "success",
      });
      closeDialog();
      loadClients();
    } catch {
      showSnackbar({
        message: "Action Failed",
        severity: "error",
      });
    }
  };

  return (
    <>
      <Typography variant="h5" gutterBottom>
        Deleted Clients
      </Typography>

      {/* SEARCH */}
      <Box mb={2}>
        <GlobalSearch
          value={search}
          onChange={setSearch}
          placeholder="Search deleted clients"
        />
      </Box>
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
              <TableCell  sx={{ fontWeight: 600 }}>Name</TableCell>
              <TableCell  sx={{ fontWeight: 600 }}>Email</TableCell>
              <TableCell  sx={{ fontWeight: 600 }}>PAN</TableCell>
              <TableCell  sx={{ fontWeight: 600 }}>Status</TableCell>
              <TableCell  sx={{ fontWeight: 600 }}>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {clients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography color="text.secondary">
                    No deleted clients found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              clients.map((c) => (
                <TableRow key={c._id}>
                  <TableCell>{c.name}</TableCell>
                  <TableCell>{c.email}</TableCell>
                  <TableCell>{c.panNumber}</TableCell>
                  <TableCell>
                    <Chip label={c.status} />
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <Button
                        color="success"
                        variant="contained"
                        onClick={() => openDialog("restore", c._id)}
                      >
                        Restore
                      </Button>
                      <Button
                        color="error"
                        variant="contained"
                        onClick={() => openDialog("force", c._id)}
                      >
                        Force Delete
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <ConfirmDialog
        open={!!action}
        title="Confirm Action"
        message={`Are you sure you want to ${action} this client?`}
        onConfirm={handleConfirm}
        onClose={closeDialog}
      />
    </>
  );
}
