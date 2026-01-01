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

    if (!client) return res.status(404).json({ message: "Client not found" });

    let allowedFields = [];

    if (
      client.status !== CLIENT_STATUS.PENDING &&
      client.status !== CLIENT_STATUS.FILED
    ) {
      return res.status(400).json({
        message: "Client data is locked after CA review",
      });
    }

    if (client.status === CLIENT_STATUS.PENDING) {
      allowedFields = ["name", "email", "phone", "panNumber", "documents"];
    } else if (client.status === CLIENT_STATUS.FILED) {
      allowedFields = ["formDraft", "documents"];
    } else {
      return res.status(400).json({
        message: "Client cannot be edited in this state",
      });
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
    return res.status(500).json({ message: "Internal server error" });
  }
};
