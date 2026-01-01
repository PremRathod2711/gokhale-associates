import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import { Outlet } from "react-router-dom";
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Typography,
  Divider,
  Avatar,
} from "@mui/material";
import PaidIcon from "@mui/icons-material/Paid";
import MenuIcon from "@mui/icons-material/Menu";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PeopleIcon from "@mui/icons-material/People";
import DescriptionIcon from "@mui/icons-material/Description";
import LogoutIcon from "@mui/icons-material/Logout";
import DeleteIcon from "@mui/icons-material/Delete";

export default function DashboardLayout() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const drawerWidth = 240;
  const collapsedWidth = 72;

  if (!user) return null;

  const logout = async () => {
    try {
      if (user?.role === "ADMIN") await api.post("/admin/logout");
      if (user?.role === "ASSOCIATE") await api.post("/associate/logout");
      if (user?.role === "CA") await api.post("/ca/logout");
    } finally {
      setUser(null);
      navigate("/");
    }
  };

  const menu = {
    ADMIN: [
      {
        label: "Signed & Billed",
        icon: PaidIcon,
        path: "/admin/signed",
      },
      {
        label: "Approved & Completed",
        icon: CheckCircleIcon,
        path: "/admin",
      },
      {
        label: "Completed",
        icon: FolderOpenIcon,
        path: "/admin/completed",
      },
      { label: "Users", icon: PeopleIcon, path: "/admin/users" },
      {
        label: "Deleted Clients",
        icon: DeleteIcon,
        path: "/admin/clients/deleted",
      },
    ],
    ASSOCIATE: [
      { label: "Clients Pending", icon: FolderOpenIcon, path: "/associate" },
      { label: "Filed Forms", icon: DescriptionIcon, path: "/associate/filed" },
      {
        label: "Approved",
        icon: CheckCircleIcon,
        path: "/associate/approved",
      },
    ],
    CA: [
      { label: "Pending Review", icon: FolderOpenIcon, path: "/ca" },
      { label: "Approved", icon: CheckCircleIcon, path: "/ca/approved" },
    ],
  };

  return (
    <Box display="flex" height="100vh" bgcolor="#f8fafc">
      {/* SIDEBAR */}
      <Drawer
        variant="permanent"
        sx={{
          width: collapsed ? collapsedWidth : drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: collapsed ? collapsedWidth : drawerWidth,
            boxSizing: "border-box",
            borderRight: "1px solid #e5e7eb",
            backgroundColor: "#ffffff",
            transition: "width 0.25s ease-in-out",
            overflowX: "hidden",
          },
        }}
      >
        {/* HEADER */}
        <Box
          display="flex"
          alignItems="center"
          justifyContent={collapsed ? "center" : "space-between"}
          px={2}
          py={1.5}
          sx={{
            transition: "all 0.25s ease-in-out",
          }}
        >
          {!collapsed && (
            <Typography
              fontWeight={700}
              fontSize={16}
              sx={{
                whiteSpace: "nowrap",
                transition: "opacity 0.2s ease",
              }}
            >
              CA Workflow
            </Typography>
          )}

          <IconButton onClick={() => setCollapsed(!collapsed)}>
            <MenuIcon />
          </IconButton>
        </Box>

        <Divider />

        {/* MENU */}
        <List sx={{ px: 1 }}>
          {menu[user.role]?.map((item) => {
            const active = location.pathname === item.path;

            const Icon = item.icon;

            return (
              <ListItemButton
                key={item.path}
                onClick={() => navigate(item.path)}
                selected={active}
                sx={{
                  mb: 0.5,
                  borderRadius: 2,
                  justifyContent: collapsed ? "center" : "flex-start",
                  transition: "all 0.2s ease-in-out",
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: collapsed ? "auto" : 40,
                    color: active ? "#2563eb" : "#475569",
                    transition: "margin 0.2s ease",
                  }}
                >
                  <Icon />
                </ListItemIcon>

                {!collapsed && (
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontSize: 14,
                      fontWeight: active ? 600 : 500,
                    }}
                    sx={{
                      whiteSpace: "nowrap",
                      transition: "opacity 0.2s ease",
                    }}
                  />
                )}
              </ListItemButton>
            );
          })}
        </List>

        <Box flexGrow={1} />

        <Divider />

        {/* USER SECTION */}
        <Box p={2}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent={collapsed ? "center" : "flex-start"}
            mb={1}
            sx={{
              transition: "all 0.25s ease-in-out",
            }}
          >
            <Avatar
              sx={{
                width: 36,
                height: 36,
                bgcolor: "#2563eb",
                fontSize: 14,
              }}
            >
              {user.name?.[0]}
            </Avatar>

            {!collapsed && (
              <Box ml={1} sx={{ transition: "opacity 0.2s ease" }}>
                <Typography fontSize={13} fontWeight={600}>
                  {user.name}
                </Typography>
                <Typography fontSize={12} color="text.secondary">
                  {user.role}
                </Typography>
              </Box>
            )}
          </Box>

          <ListItemButton
            onClick={logout}
            sx={{
              borderRadius: 2,
              justifyContent: collapsed ? "center" : "flex-start",
              color: "#dc2626",
              transition: "all 0.2s ease-in-out",
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: collapsed ? "auto" : 40,
                color: "#dc2626",
              }}
            >
              <LogoutIcon />
            </ListItemIcon>

            {!collapsed && (
              <ListItemText
                primary="Sign out"
                primaryTypographyProps={{ fontSize: 14 }}
              />
            )}
          </ListItemButton>
        </Box>
      </Drawer>

      {/* CONTENT */}
      <Box
        flexGrow={1}
        p={3}
        overflow="auto"
        sx={{
          transition: "margin 0.25s ease-in-out",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
