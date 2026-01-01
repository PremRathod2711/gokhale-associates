import express from "express";
const router = express.Router();

// Middleware
import associateAuthMiddleware from "../middlewares/associateAuthMiddleware.js";

// Validators
import { associateSignupValidator } from "../validators/associate/associateSignupValidator.js";
import { associateLoginValidator } from "../validators/associate/associateLoginValidator.js";

// Controllers
import { associateSignupController } from "../controllers/associate/associateSignupController.js";
import { associateLoginController } from "../controllers/associate/associateLoginController.js";
import { associateLogoutController } from "../controllers/associate/associateLogoutController.js";
import { getAssociateDetailsController } from "../controllers/associate/getAssociateDetailsController.js";
import { associateEditClientController } from "../controllers/associate/associateEditClientController.js";
import { updateFormDraftController } from "../controllers/associate/updateFormDraftController.js";

// ---------------- AUTH ----------------
router.post("/signup", associateSignupValidator, associateSignupController);
router.post("/login", associateLoginValidator, associateLoginController);
router.post("/logout", associateAuthMiddleware, associateLogoutController);
router.get("/me", associateAuthMiddleware, getAssociateDetailsController);

// Associate
router.patch("/edit/:clientId", associateAuthMiddleware, associateEditClientController);

export default router;
