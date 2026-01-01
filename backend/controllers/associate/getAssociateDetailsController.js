import Associate from "../../models/Associate.js";

export async function getAssociateDetailsController(req, res) {
  try {
    const associateId = req.user.userId;

    const associate = await Associate.findById(associateId).select("-password");
    if (!associate) {
      return res.status(404).json({
        message: "Associate not found"
      });
    }

    return res.status(200).json({
      data: associate
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error"
    });
  }
}
