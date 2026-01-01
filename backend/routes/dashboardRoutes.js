import express from "express";
const router = express.Router();

// Middlewares
import associateAuth from "../middlewares/associateAuthMiddleware.js";
import caAuth from "../middlewares/caAuthMiddleware.js";
import adminAuth from "../middlewares/adminAuthMiddleware.js";

// Controllers
import {
  getAssociateDashboard,
  getCADashboard,
  getAdminDashboard,
  getClientsBySection,
  getClientDetails
} from "../controllers/dashboard/dashboardController.js";

// ---------------- DASHBOARDS ----------------
router.get("/associate", associateAuth, getAssociateDashboard);
router.get("/ca", caAuth, getCADashboard);
router.get("/admin", adminAuth, getAdminDashboard);

// ---------------- SECTION-WISE CLIENT LISTS ----------------
router.get("/section/:status", associateAuth, getClientsBySection);
router.get("/ca/section/:status", caAuth, getClientsBySection);
router.get("/admin/section/:status", adminAuth, getClientsBySection);

// ---------------- CLIENT DETAILS ----------------
router.get("/client/:id", associateAuth, getClientDetails);
router.get("/ca/client/:id", caAuth, getClientDetails);
router.get("/admin/client/:id", adminAuth, getClientDetails);

export default router;
