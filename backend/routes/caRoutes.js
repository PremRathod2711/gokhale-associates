import express from "express";
const router = express.Router();

// Middleware
import caAuthMiddleware from "../middlewares/caAuthMiddleware.js";

// Validators
import { caSignupValidator } from "../validators/ca/caSignupValidator.js";
import { caLoginValidator } from "../validators/ca/caLoginValidator.js";

// Controllers
import caSignupController from "../controllers/ca/caSignupController.js";
import caLoginController from "../controllers/ca/caLoginController.js";
import caLogoutController from "../controllers/ca/caLogoutController.js";
import getCaDetailsController from "../controllers/ca/getCaDetailsController.js";
import { caEditRemarkController } from "../controllers/ca/caEditRemarkController.js";


// ---------------- AUTH ----------------
router.post("/signup", caSignupValidator, caSignupController);
router.post("/login", caLoginValidator, caLoginController);
router.post("/logout", caAuthMiddleware, caLogoutController);
router.get("/me", caAuthMiddleware, getCaDetailsController);

// CA
router.patch("/remark/:clientId", caAuthMiddleware, caEditRemarkController);

export default router;
