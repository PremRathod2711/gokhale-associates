import Client from "../../models/Client.js";
import CLIENT_STATUS from "../../config/clientStatus.js";

export const associateEditClientController = async (req, res) => {
  try {
    const associateId = req.user.userId;
    const { clientId } = req.params;

    const client = await Client.findOne({
      _id: clientId,
      createdBy: associateId,
    });

    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    if (
        client.status !== CLIENT_STATUS.PENDING &&
        client.status !== CLIENT_STATUS.FILED
    ) {
      return res.status(400).json({
        message: "Client data is locked after CA review",
      });
    }

    if (req.body.email) {
      const exists = await Client.findOne({
        _id: { $ne: clientId },
        email: req.body.email.toLowerCase(),
        is_deleted: false,
      });

      if (exists) {
        return res.status(409).json({ message: "Email already exists" });
      }
    }

    if (req.body.phone) {
      const exists = await Client.findOne({
        _id: { $ne: clientId },
        phone: req.body.phone,
        is_deleted: false,
      });

      if (exists) {
        return res.status(409).json({ message: "Phone already exists" });
      }
    }

    if (req.body.panNumber) {
      const exists = await Client.findOne({
        _id: { $ne: clientId },
        panNumber: req.body.panNumber.toUpperCase(),
        is_deleted: false,
      });

      if (exists) {
        return res.status(409).json({ message: "PAN already exists" });
      }
    }


    if (req.body.email) req.body.email = req.body.email.toLowerCase();
    if (req.body.panNumber) req.body.panNumber = req.body.panNumber.toUpperCase();

    let allowedFields = [];

    if (client.status === CLIENT_STATUS.PENDING) {
      allowedFields = ["name", "email", "phone", "panNumber", "documents"];
    } else if (client.status === CLIENT_STATUS.FILED) {
      allowedFields = ["formDraft", "documents"];
    }

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        client[field] = req.body[field];
      }
    });

    await client.save();

    return res.status(200).json({
      message: "Client updated successfully",
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

    return res.status(500).json({ message: "Internal server error" });
  }
};
