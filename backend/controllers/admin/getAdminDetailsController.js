import Admin from "../../models/Admin.js";

export async function getAdminDetailsController(req, res) {
  try {
    const adminId = req.user.userId;

    if (!adminId) {
      return res.status(401).json({
        message: "Unauthorized"
      });
    }

    const admin = await Admin.findById(adminId).select("-password");

    if (!admin) {
      return res.status(404).json({
        message: "Admin not found"
      });
    }

    return res.status(200).json({
      data: admin
    });
  } catch (err) {
    console.error("getAdminDetailsController:", err);
    return res.status(500).json({
      message: "Internal server error"
    });
  }
}
