import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Stack,
  Typography,
  Paper,
} from "@mui/material";
import api from "../api/axios";
import { useSnackbar } from "../ui/snackbar";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useEffect } from "react";

export default function Login() {
  const { showSnackbar } = useSnackbar();

  const [role, setRole] = useState("admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [capsLock, setCapsLock] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const validate = () => {
    const err = {};
    if (!email.trim()) err.email = "Email is required";
    if (!password.trim()) err.password = "Password is required";
    return err;
  };

  useEffect(() => {
    const timer = setTimeout(() => setShowLoader(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const isFormValid = email.trim() && password.trim();

  const handleLogin = async () => {
    if (loading) return;

    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);
      setErrors({});

      const endpoint =
        role === "admin"
          ? "/admin/login"
          : role === "associate"
          ? "/associate/login"
          : "/ca/login";

      await api.post(endpoint, { email, password });

      showSnackbar({ message: "Login successful", severity: "success" });

      window.location.href =
        role === "admin"
          ? "/admin"
          : role === "associate"
          ? "/associate"
          : "/ca";
    } catch (err) {
      showSnackbar({
        message: err.response?.data?.message || "Invalid credentials",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{
        background: "linear-gradient(135deg, #e0f2fe, #f8fafc)",
      }}
    >
      {showLoader ? (
        /* CENTER PAGE LOADER */
        <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
          <CircularProgress size={46} />
          <Typography variant="body2" color="text.secondary">
            Loading...
          </Typography>
        </Box>
      ) : (
        /* LOGIN CARD */
        <Paper
          elevation={4}
          sx={{
            width: 420,
            p: 4,
            borderRadius: 2.5,
          }}
        >
          <Typography variant="h5" fontWeight={600} mb={1}>
            Welcome
          </Typography>

          <Typography variant="body2" color="text.secondary" mb={3}>
            Sign in to continue
          </Typography>

          <Stack spacing={3}>
            <TextField
              select
              label="Login as"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              fullWidth
            >
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="associate">Associate</MenuItem>
              <MenuItem value="ca">CA</MenuItem>
            </TextField>

            <TextField
              label="Email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!!errors.email}
              helperText={errors.email}
              fullWidth
              onKeyDown={(e) => {
                if (e.key === "Enter") handleLogin();
              }}
            />

            <TextField
              label="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!errors.password}
              helperText={capsLock ? "Caps Lock is ON" : errors.password}
              fullWidth
              onKeyDown={(e) => {
                setCapsLock(e.getModifierState("CapsLock"));
                if (e.key === "Enter") handleLogin();
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword((p) => !p)}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              variant="contained"
              size="large"
              onClick={handleLogin}
              disabled={!email.trim() || !password.trim() || loading}
              sx={{
                py: 1.2,
                fontWeight: 600,
                borderRadius: 1.5,
                backgroundColor: "#2563eb",
                "&:hover": {
                  backgroundColor: "#1e40af",
                },
              }}
            >
              {loading ? (
                <CircularProgress size={22} color="inherit" />
              ) : (
                "Login"
              )}
            </Button>
          </Stack>
        </Paper>
      )}
    </Box>
  );
}
