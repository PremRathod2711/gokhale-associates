import Client from "../../models/Client.js";
import CLIENT_STATUS from "../../config/clientStatus.js";

export const adminEditBillingController = async (req, res) => {
  try {
    const adminId = req.user.userId;
    const { clientId } = req.params;
    const { billingAmount } = req.body;

    if (!billingAmount || billingAmount <= 0)
      return res.status(400).json({
        message: "Valid billing amount required"
      });

    const client = await Client.findOne({
      _id: clientId,
      status: CLIENT_STATUS.BILLED
    });

    if (!client)
      return res.status(404).json({
        message: "Client not found or invalid state"
      });

    client.billingAmount = billingAmount;
    client.handledByAdmin = adminId;

    await client.save();

    return res.status(200).json({
      message: "Billing updated successfully",
      data: client
    });
  } catch {
    return res.status(500).json({ message: "Internal server error" });
  }
};
