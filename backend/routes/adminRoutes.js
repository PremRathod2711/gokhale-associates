import express from "express";
const router = express.Router();

// Middlewares
import adminAuthMiddleware from "../middlewares/adminAuthMiddleware.js";

// Validators
import { adminSignupValidator } from "../validators/admin/adminSignupValidator.js";
import { adminLoginValidator } from "../validators/admin/adminLoginValidator.js";

// Controllers
import { adminSignupController } from "../controllers/admin/adminSignupController.js";
import { adminLoginController } from "../controllers/admin/adminLoginController.js";
import { adminLogoutController } from "../controllers/admin/adminLogoutController.js";
import { getAdminDetailsController } from "../controllers/admin/getAdminDetailsController.js";
import {
  getDeletedClientsForAdmin,
  softDeleteClient,
  restoreSoftDeletedClient,
  forceDeleteClient,
} from "../controllers/admin/adminClientController.js";

import {
  getUsersList,
  getUserDetails,
} from "../controllers/admin/adminUsersController.js";
import { adminGetClientStatuses } from "../controllers/admin/adminGetClientStatuses.js";
import { adminEditBillingController } from "../controllers/admin/adminEditBillingController.js";

// ---------------- AUTH ----------------
router.post("/signup", adminSignupValidator, adminSignupController);
router.post("/login", adminLoginValidator, adminLoginController);
router.post("/logout", adminAuthMiddleware, adminLogoutController);
router.get("/me", adminAuthMiddleware, getAdminDetailsController);

// ---------------- USERS ----------------
router.get("/users/:type", adminAuthMiddleware, getUsersList);
router.get("/users/:type/:id", adminAuthMiddleware, getUserDetails);

// -------- CLIENT MANAGEMENT --------
router.get("/clients", adminAuthMiddleware, getDeletedClientsForAdmin);
router.patch("/clients/soft-delete/:id", adminAuthMiddleware, softDeleteClient);
router.patch(
  "/clients/restore/:id",
  adminAuthMiddleware,
  restoreSoftDeletedClient
);
router.delete(
  "/clients/force-delete/:id",
  adminAuthMiddleware,
  forceDeleteClient
);

router.get("/client-statuses", adminAuthMiddleware, adminGetClientStatuses);
// Admin
router.patch(
  "/edit-billing/:clientId",
  adminAuthMiddleware,
  adminEditBillingController
);

export default router;
