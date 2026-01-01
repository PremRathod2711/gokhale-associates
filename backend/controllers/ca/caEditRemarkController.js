import Client from "../../models/Client.js";
import CLIENT_STATUS from "../../config/clientStatus.js";

export const caEditRemarkController = async (req, res) => {
  try {
    const caId = req.user.userId;
    const { clientId } = req.params;
    const { remark } = req.body;

    if (!remark)
      return res.status(400).json({ message: "Remark is required" });

    const client = await Client.findOne({
      _id: clientId,
      assignedCA: caId,
      status: CLIENT_STATUS.PENDING_REVIEW
    });

    if (!client)
      return res.status(404).json({
        message: "Client not found or invalid state"
      });

    client.remarks.push({
      remark,
      byRole: "CA",
      byUser: caId
    });

    await client.save();

    return res.status(200).json({
      message: "Remark added successfully",
      data: client
    });
  } catch {
    return res.status(500).json({ message: "Internal server error" });
  }
};
