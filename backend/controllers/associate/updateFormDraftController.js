import { updateClientForm } from "../../services/clientServices.js";

export const updateFormDraftController = async (req, res) => {
  try {
    const { xmlPath } = req.body;

    if (!xmlPath) {
      return res.status(400).json({ message: "XML path is required" });
    }

    const client = await updateClientForm({
      clientId: req.params.clientId,
      xmlPath,
      associateId: req.user.userId,
    });

    return res.status(200).json({
      message: "Form draft updated",
      data: client,
    });
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    });
  }
};
