import {
  createClient,
  fileClientForm,
  moveToPendingReview,
  caApproveClient,
  submitBilling,
  adminApproveBilling,
  completeClient,
  closeClient
} from "../../services/clientServices.js";

/**
 * ASSOCIATE — Add Client
 */
export const addClientController = async (req, res) => {
  try {
    const client = await createClient({
      ...req.body,
      associateId: req.user.userId,
    });

    return res.status(201).json({
      message: "Client added successfully",
      data: client,
    });
  } catch (err) {
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      const messages = {
        email: "Email already exists",
        phone: "Phone already exists",
        panNumber: "PAN already exists",
      };

      return res.status(409).json({
        message: messages[field] || "Duplicate value",
      });
    }

    return res.status(400).json({
      message: err.message,
    });
  }
};

/**
 * ASSOCIATE — Upload XML draft
 */
export const uploadFormDraftController = async (req, res) => {
  try {
    const { xmlPath } = req.body;
    if (!xmlPath) {
      return res.status(400).json({ message: "XML path is required" });
    }

    const client = await fileClientForm({
      clientId: req.params.clientId,
      xmlPath,
      associateId: req.user.userId
    });

    return res.status(200).json({
      message: "Form draft uploaded",
      data: client
    });
  } catch (err) {
    return res.status(400).json({
      message: err.message
    });
  }
};

/**
 * ASSOCIATE — FORM FILLED → move to CA review
 */
export const markFormFilledController = async (req, res) => {
  try {
    const { caId } = req.body;
    if (!caId) {
      return res.status(400).json({ message: "CA ID is required" });
    }

    const client = await moveToPendingReview({
      clientId: req.params.clientId,
      caId,
      associateId: req.user.userId
    });

    return res.status(200).json({
      message: "Client sent for CA review",
      data: client
    });
  } catch (err) {
    return res.status(400).json({
      message: err.message
    });
  }
};

/**
 * ASSOCIATE — Submit Billing
 */
export const submitBillingController = async (req, res) => {
  try {
    const { billingAmount, formSigned } = req.body;

    const client = await submitBilling({
      clientId: req.params.clientId,
      billingAmount,
      formSigned,
      associateId: req.user.userId
    });

    return res.status(200).json({
      message: "Billing submitted",
      data: client
    });
  } catch (err) {
    return res.status(400).json({
      message: err.message
    });
  }
};

/**
 * CA — Approve Client
 */
export const caApproveController = async (req, res) => {
  try {
    const { remark } = req.body;
    if (!remark) {
      return res.status(400).json({ message: "Remark is required" });
    }

    const client = await caApproveClient({
      clientId: req.params.clientId,
      remark,
      caId: req.user.userId
    });

    return res.status(200).json({
      message: "Client approved by CA",
      data: client
    });
  } catch (err) {
    return res.status(400).json({
      message: err.message
    });
  }
};

/**
 * ADMIN — Approve Billing
 */
export const adminApproveBillingController = async (req, res) => {
  try {
    const client = await adminApproveBilling({
      clientId: req.params.clientId,
      adminId: req.user.userId
    });

    return res.status(200).json({
      message: "Billing approved by admin",
      data: client
    });
  } catch (err) {
    return res.status(400).json({
      message: err.message
    });
  }
};

/**
 * ADMIN — Mark Payment Done
 */
export const markPaymentDoneController = async (req, res) => {
  try {
    const { clientId } = req.params;
    const { billingAmountCollectedDate } = req.body;

    if (!billingAmountCollectedDate) {
      return res.status(400).json({
        message: "billingAmountCollectedDate is required"
      });
    }

    const client = await completeClient({
      clientId,
      billingAmountCollectedDate
    });

    return res.status(200).json({
      message: "Client marked as completed",
      data: client
    });
  } catch (err) {
    return res.status(400).json({
      message: err.message
    });
  }
};

/**
 * Admin — Close Client
 */
export const closeClientController = async (req, res) => {
  try {
    const { clientId } = req.params;
    const { remark } = req.body;

    const client = await closeClient({
      clientId,
      adminId: req.user.userId,
      remark
    });

    return res.status(200).json({
      message: "Client closed successfully",
      data: client
    });
  } catch (err) {
    return res.status(400).json({
      message: err.message
    });
  }
};
