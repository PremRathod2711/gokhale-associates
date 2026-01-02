import Client from "../models/Client.js";
import CLIENT_STATUS from "../config/clientStatus.js";
import Admin from "../models/Admin.js";


const createClient = async ({
name,
email,
phone,
panNumber,
documents,
remarks,
associateId,
}) => {
  const normalizedEmail = email.toLowerCase();
  const normalizedPan = panNumber.toUpperCase();

  if (
      await Client.findOne({
        email: normalizedEmail,
        is_deleted: false,
      })
  ) {
    throw new Error("Email already exists");
  }

  if (
      await Client.findOne({
        phone,
        is_deleted: false,
      })
  ) {
    throw new Error("Phone already exists");
  }

  if (
      await Client.findOne({
        panNumber: normalizedPan,
        is_deleted: false,
      })
  ) {
    throw new Error("PAN already exists");
  }

  return Client.create({
    name,
    email: normalizedEmail,
    phone,
    panNumber: normalizedPan,
    documents,
    remarks: remarks
        ? [
          {
            remark: remarks,
            byRole: "ASSOCIATE",
            byUser: associateId,
          },
        ]
        : [],
    createdBy: associateId,
    status: CLIENT_STATUS.PENDING,
  });
};

const ensureNotClosed = (client) => {
  if (client.status === CLIENT_STATUS.CLOSED) {
    throw new Error("Client is closed and cannot be modified");
  }
};

const fileClientForm = async ({ clientId, xmlPath, associateId }) => {
  const client = await Client.findOne({
    _id: clientId,
    createdBy: associateId,
  });

  if (!client) throw new Error("Client not found or unauthorized");
  ensureNotClosed(client);
  if (client.status !== CLIENT_STATUS.PENDING)
    throw new Error("Client is not in PENDING state");

  client.formDraft = xmlPath;
  client.status = CLIENT_STATUS.FILED;

  return client.save();
};

const moveToPendingReview = async ({ clientId, caId, associateId }) => {
  const client = await Client.findOne({
    _id: clientId,
    createdBy: associateId,
  });

  if (!client) throw new Error("Client not found or unauthorized");
  ensureNotClosed(client);
  if (client.status !== CLIENT_STATUS.FILED)
    throw new Error("Client must be FILED before CA review");

  client.status = CLIENT_STATUS.PENDING_REVIEW;
  client.assignedCA = caId;

  return client.save();
};

const caApproveClient = async ({ clientId, remark, caId }) => {
  if (!remark) throw new Error("Remark is mandatory");

  const client = await Client.findOne({
    _id: clientId,
    assignedCA: caId,
    status: CLIENT_STATUS.PENDING_REVIEW,
  });

  if (!client) throw new Error("Client not found or unauthorized");
  ensureNotClosed(client);
  client.remarks.push({
    remark,
    byRole: "CA",
    byUser: caId,
  });

  client.status = CLIENT_STATUS.CA_APPROVED;

  return client.save();
};

const submitBilling = async ({
  clientId,
  billingAmount,
  formSigned,
  associateId,
}) => {
  if (!billingAmount || billingAmount <= 0)
    throw new Error("Valid billing amount required");
  if (!formSigned) throw new Error("Form must be signed");

  const client = await Client.findOne({
    _id: clientId,
    createdBy: associateId,
    status: CLIENT_STATUS.CA_APPROVED,
  });

  if (!client) throw new Error("Client not found or unauthorized");
  ensureNotClosed(client);
  client.billingAmount = billingAmount;
  client.formSigned = true;
  client.status = CLIENT_STATUS.BILLED;

  return client.save();
};

const adminApproveBilling = async ({ clientId, adminId }) => {
  const admin = await Admin.findById(adminId);
  if (!admin || admin.role !== "ADMIN") {
    throw new Error("Unauthorized admin");
  }

  const client = await Client.findOne({
    _id: clientId,
    status: CLIENT_STATUS.BILLED,
  });

  if (!client) {
    throw new Error("Client not found or invalid state");
  }
  ensureNotClosed(client);
  client.status = CLIENT_STATUS.ADMIN_APPROVED;
  client.handledByAdmin = adminId;

  return client.save();
};

const completeClient = async ({ clientId, billingAmountCollectedDate }) => {
  const client = await Client.findOne({
    _id: clientId,
    status: CLIENT_STATUS.ADMIN_APPROVED,
  });

  if (!client) {
    throw new Error("Client not found or invalid state");
  }
  ensureNotClosed(client);
  client.status = CLIENT_STATUS.COMPLETED;
  client.billingAmountCollectedDate = new Date(billingAmountCollectedDate);

  return client.save();
};

const updateClientForm = async ({ clientId, xmlPath, associateId }) => {
  const client = await Client.findOne({
    _id: clientId,
    createdBy: associateId,
    status: CLIENT_STATUS.FILED,
  });

  if (!client) throw new Error("Client not found or invalid state");
  ensureNotClosed(client);
  client.formDraft = xmlPath;

  return client.save();
};

const closeClient = async ({ clientId, adminId, remark }) => {
  console.log("[CLOSE CLIENT] Request received", {
    clientId,
    adminId,
    remark,
  });

  if (!remark?.trim()) {
    console.error("[CLOSE CLIENT] Missing remark");
    throw new Error("Close remark is required");
  }

  console.log("[CLOSE CLIENT] Running findOneAndUpdate");

  const updated = await Client.findOneAndUpdate(
    { _id: clientId, status: { $ne: CLIENT_STATUS.CLOSED } },
    {
      $set: {
        status: CLIENT_STATUS.CLOSED,
        closedAt: new Date(),
        closedBy: adminId,
      },
      $push: {
        remarks: {
          remark,
          byRole: "ADMIN",
          byUser: adminId,
        },
      },
    },
    { new: true }
  );

  if (!updated) {
    console.warn("[CLOSE CLIENT] Client not found or already closed", {
      clientId,
    });
    throw new Error("Client not found or already closed");
  }

  console.log("[CLOSE CLIENT] Update successful", {
    id: updated._id.toString(),
    status: updated.status,
    closedAt: updated.closedAt,
    closedBy: updated.closedBy,
    remarksCount: updated.remarks.length,
  });

  return updated;
};

export {
  createClient,
  fileClientForm,
  moveToPendingReview,
  caApproveClient,
  submitBilling,
  adminApproveBilling,
  completeClient,
  updateClientForm,
  closeClient,
};
