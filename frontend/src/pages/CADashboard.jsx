import ProtectedRoute from "../auth/ProtectedRoute";
import DashboardLayout from "../layouts/DashboardLayout";

export default function CADashboard() {
  return (
    <ProtectedRoute role="CA">
      <DashboardLayout />
    </ProtectedRoute>
  );
}
