import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./auth/Login";

import AdminDashboard from "./pages/AdminDashboard";
import AssociateDashboard from "./pages/AssociateDashboard";
import CADashboard from "./pages/CADashboard";

import ClientsPending from "./pages/ClientsPending";
import ApprovedForms from "./pages/ApprovedForms";
import SignedForms from "./pages/SignedForms";
import ApprovedCompletedForms from "./pages/CompletedForms";
import FiledForms from "./pages/FiledForms";
import CAPendingReview from "./pages/CAPendingReview";
import Users from "./pages/Users";
import AdminDeletedClients from "./pages/AdminDeletedClients";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route path="/admin" element={<AdminDashboard />}>
        <Route index element={<ApprovedForms />} />
        <Route path="signed" element={<SignedForms />} />
        <Route path="completed" element={<ApprovedCompletedForms />} />
        <Route path="users" element={<Users />} />
        <Route path="clients/deleted" element={<AdminDeletedClients />} />
      </Route>

      <Route path="/associate" element={<AssociateDashboard />}>
        <Route index element={<ClientsPending />} />
        <Route path="filed" element={<FiledForms />} />
        <Route path="approved" element={<ApprovedForms />} />
      </Route>

      <Route path="/ca" element={<CADashboard />}>
        <Route index element={<CAPendingReview />} />
        <Route path="approved" element={<ApprovedForms />} />
      </Route>
    </Routes>
  );
}
