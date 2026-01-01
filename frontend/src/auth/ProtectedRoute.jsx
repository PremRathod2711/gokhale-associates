import { useEffect, useState } from "react";
import api from "../api/axios";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, role }) {
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const normalizedRole = role.toUpperCase();

        if (normalizedRole === "ADMIN") {
          await api.get("/admin/me");
        } else if (normalizedRole === "ASSOCIATE") {
          await api.get("/associate/me");
        } else if (normalizedRole === "CA") {
          await api.get("/ca/me");
        }

        setAllowed(true);
      } catch {
        setAllowed(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [role]);

  if (loading) return null;
  if (!allowed) return <Navigate to="/login" replace />;

  return children;
}
