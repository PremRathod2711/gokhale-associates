import CA from "../../models/CA.js";

export default async (req, res) => {
  try {
    const caId = req.user.userId;

    const ca = await CA.findById(caId).select("-password");
    if (!ca) {
      return res.status(404).json({
        message: "CA not found"
      });
    }

    return res.status(200).json({
      data: ca
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error"
    });
  }
};
