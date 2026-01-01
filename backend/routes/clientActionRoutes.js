import express from "express";
const router = express.Router();

// Middlewares
import associateAuth from "../middlewares/associateAuthMiddleware.js";
import caAuth from "../middlewares/caAuthMiddleware.js";
import adminAuth from "../middlewares/adminAuthMiddleware.js";

// Controllers
import {
  addClientController,
  uploadFormDraftController,
  markFormFilledController,
  submitBillingController,
  caApproveController,
  adminApproveBillingController,
  markPaymentDoneController,
} from "../controllers/clientActions/clientActionController.js";

import { updateFormDraftController } from "../controllers/associate/updateFormDraftController.js";
import { closeClientController } from "../controllers/clientActions/clientActionController.js";

// ---------------- ASSOCIATE ACTIONS ----------------
router.post("/associate/add-client", associateAuth, addClientController);
router.post(
  "/associate/upload-draft/:clientId",
  associateAuth,
  uploadFormDraftController
);
router.post(
  "/associate/update-draft/:clientId",
  associateAuth,
  updateFormDraftController
);

router.post(
  "/associate/form-filled/:clientId",
  associateAuth,
  markFormFilledController
);
router.post(
  "/associate/submit-bill/:clientId",
  associateAuth,
  submitBillingController
);

// ---------------- CA ACTIONS ----------------
router.post("/ca/approve/:clientId", caAuth, caApproveController);

// ---------------- ADMIN ACTIONS ----------------
router.post(
  "/admin/approve-billing/:clientId",
  adminAuth,
  adminApproveBillingController
);
router.post(
  "/admin/payment-done/:clientId",
  adminAuth,
  markPaymentDoneController
);

router.post(
  "/admin/close-client/:clientId",
  adminAuth,
  closeClientController
);

export default router;
