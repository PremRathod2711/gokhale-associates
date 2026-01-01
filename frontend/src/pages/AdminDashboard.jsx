import ProtectedRoute from "../auth/ProtectedRoute";
import DashboardLayout from "../layouts/DashboardLayout";

export default function AdminDashboard() {
  return (
    <ProtectedRoute role="ADMIN">
      <DashboardLayout />
    </ProtectedRoute>
  );
}
