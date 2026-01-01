import ProtectedRoute from "../auth/ProtectedRoute";
import DashboardLayout from "../layouts/DashboardLayout";

export default function AssociateDashboard() {
  return (
    <ProtectedRoute role="ASSOCIATE">
      <DashboardLayout />
    </ProtectedRoute>
  );
}
