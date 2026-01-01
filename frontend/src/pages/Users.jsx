import { useEffect, useState } from "react";
import api from "../api/axios";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Button,
  Stack,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import GlobalSearch from "../components/GlobalSearch";
import ConfirmDialog from "../components/ConfirmDialog";
import { useSnackbar } from "../ui/snackbar";
import ClientDetailsModal from "../components/ClientDetailsModal";

export default function Users() {
  const [type, setType] = useState("clients");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [statuses, setStatuses] = useState([]);

  // Close modal
  const [closeOpen, setCloseOpen] = useState(false);
  const [closeRemark, setCloseRemark] = useState("");
  const [closingClientId, setClosingClientId] = useState(null);

  // Delete modal
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingClientId, setDeletingClientId] = useState(null);

  //View Modal
  const [viewOpen, setViewOpen] = useState(false);
  const [viewClientId, setViewClientId] = useState(null);

  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    if (type !== "clients") return;

    api
      .get("/admin/client-statuses")
      .then((res) => setStatuses(res.data.data))
      .catch(console.error);
  }, [type]);

  const fetchUsers = async () => {
    setLoading(true);

    const res = await api.get(`/admin/users/${type}`, {
      params: { search, status },
    });

    setUsers(res.data.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, [type, search, status]);

  // ---------- CLOSE ----------
  const openCloseModal = (id) => {
    setClosingClientId(id);
    setCloseRemark("");
    setCloseOpen(true);
  };

  const handleCloseClient = async () => {
    if (!closeRemark.trim()) {
      showSnackbar({
        message: "Close remark is required",
        severity: "warning",
      });
      return;
    }

    try {
      await api.post(`/client-actions/admin/close-client/${closingClientId}`, {
        remark: closeRemark,
      });

      showSnackbar({
        message: "Client closed successfully",
        severity: "success",
      });

      setCloseOpen(false);
      setClosingClientId(null);
      setCloseRemark("");

      await fetchUsers();
    } catch {
      showSnackbar({
        message: "Failed to close client",
        severity: "error",
      });
    }
  };

  // ---------- DELETE ----------
  const confirmDelete = (id) => {
    setDeletingClientId(id);
    setDeleteOpen(true);
  };

  const handleDelete = async () => {
    try {
      await api.patch(`/admin/clients/soft-delete/${deletingClientId}`);

      showSnackbar({
        message: "Client deleted",
        severity: "success",
      });

      setDeleteOpen(false);
      await fetchUsers();
    } catch {
      showSnackbar({
        message: "Delete failed",
        severity: "error",
      });
    }
  };

  // View
  const openViewModal = (id) => {
    if (type !== "clients") return;
    setViewClientId(id);
    setViewOpen(true);
  };

  if (loading) {
    return (
      <Box p={3}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      {/* HEADER */}
      <Box
        mb={4}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
      >
        <Box>
          <Typography variant="h5" fontWeight={600}>
            Users
          </Typography>
          <Typography color="text.secondary">
            Manage clients, associates, and CAs
          </Typography>
        </Box>

        <Box width={220}>
          <FormControl fullWidth size="small">
            <InputLabel>User Type</InputLabel>
            <Select
              value={type}
              label="User Type"
              onChange={(e) => {
                setType(e.target.value);
                setStatus("");
                setSearch("");
              }}
            >
              <MenuItem value="clients">Clients</MenuItem>
              <MenuItem value="associates">Associates</MenuItem>
              <MenuItem value="cas">CAs</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* SEARCH + STATUS */}
      <Box mb={3} display="flex" gap={2}>
        <GlobalSearch
          value={search}
          onChange={setSearch}
          placeholder={`Search ${type}`}
        />

        {type === "clients" && (
          <FormControl size="small" sx={{ width: 220 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={status}
              label="Status"
              onChange={(e) => setStatus(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              {statuses.map((s) => (
                <MenuItem key={s} value={s}>
                  {s.replaceAll("_", " ")}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </Box>

      {/* TABLE */}
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
              <TableCell sx={{ fontWeight: 600 }}>
                {type === "clients" ? "Status" : "Role"}
              </TableCell>
              {type === "clients" && (
                <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
              )}
            </TableRow>
          </TableHead>

          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={type === "clients" ? 4 : 3} align="center">
                  No data
                </TableCell>
              </TableRow>
            ) : (
              users.map((u) => (
                <TableRow
                  key={u._id}
                  hover
                  sx={{ cursor: "pointer" }}
                  onClick={() => type === "clients" && openViewModal(u._id)}
                >
                  <TableCell>{u.name}</TableCell>
                  <TableCell>{u.email}</TableCell>

                  <TableCell>
                    {type === "clients" ? (
                      <Chip label={u.status} size="small" />
                    ) : (
                      u.role
                    )}
                  </TableCell>

                  {type === "clients" && (
                    <TableCell>
                      {u.status === "CLOSED" ? (
                        <Typography variant="caption" color="text.secondary">
                          —
                        </Typography>
                      ) : (
                        <Stack direction="row" spacing={1}>
                          <Button
                            size="small"
                            color="warning"
                            variant="outlined"
                            onClick={(e) => {
                              e.stopPropagation();
                              openCloseModal(u._id);
                            }}
                          >
                            Close
                          </Button>

                          <Button
                            size="small"
                            color="error"
                            variant="contained"
                            onClick={(e) => {
                              e.stopPropagation();
                              confirmDelete(u._id);
                            }}
                          >
                            Delete
                          </Button>
                        </Stack>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* CLOSE MODAL */}
      <Dialog
        open={closeOpen}
        onClose={() => setCloseOpen(false)}
        maxWidth={false}
        fullWidth
        PaperProps={{
          sx: {
            width: 600,
          },
        }}
      >
        <DialogTitle>Close Client</DialogTitle>

        <DialogContent>
          <TextField
            multiline
            minRows={5}
            fullWidth
            label="Close Remark"
            value={closeRemark}
            onChange={(e) => setCloseRemark(e.target.value)}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setCloseOpen(false)}>Cancel</Button>
          <Button
            color="warning"
            variant="contained"
            onClick={handleCloseClient}
          >
            Confirm Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* DELETE CONFIRM */}
      <ConfirmDialog
        open={deleteOpen}
        title="Confirm Delete"
        message="Are you sure you want to delete this client?"
        onConfirm={handleDelete}
        onClose={() => setDeleteOpen(false)}
      />

      {/* VIEW */}
      <ClientDetailsModal
        open={viewOpen}
        clientId={viewClientId}
        onClose={() => {
          setViewOpen(false);
          setViewClientId(null);
        }}
      />
    </Box>
  );
}
