import Client from "../../models/Client.js";
import Associate from "../../models/Associate.js";
import CA from "../../models/CA.js";
import CLIENT_STATUS from "../../config/clientStatus.js";

export const getUsersList = async (req, res) => {
  try {
    const { type } = req.params;
    const { search, status } = req.query;

    let query = {};

    if (search) {
      query.$or = [
        { name: new RegExp(search, "i") },
        { email: new RegExp(search, "i") },
        { panNumber: new RegExp(search, "i") },
      ];
    }

    let users;

    switch (type) {
      case "clients": {
        const clientQuery = {
          ...query,
          is_deleted: false, 
        };

        if (status && Object.values(CLIENT_STATUS).includes(status)) {
          clientQuery.status = status;
        }

        users = await Client.find(clientQuery)
          .select("name email panNumber status createdAt")
          .sort({ createdAt: -1 });
        break;
      }

      case "associates":
        users = await Associate.find(query)
          .select("name email phone role createdAt")
          .sort({ createdAt: -1 });
        break;

      case "cas":
        users = await CA.find(query)
          .select("name email phone role createdAt")
          .sort({ createdAt: -1 });
        break;

      default:
        return res.status(400).json({
          message: "Invalid user type",
        });
    }

    return res.status(200).json({
      count: users.length,
      data: users,
    });
  } catch (err) {
    console.error("getUsersList:", err);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getUserDetails = async (req, res) => {
  try {
    const { type, id } = req.params;

    let user;

    switch (type) {
      case "clients":
        user = await Client.findById(id)
          .populate("createdBy", "name email")
          .populate("assignedCA", "name email")
          .populate("handledByAdmin", "name email");
        break;

      case "associates":
        user = await Associate.findById(id).select("-password");
        break;

      case "cas":
        user = await CA.findById(id).select("-password");
        break;

      default:
        return res.status(400).json({
          message: "Invalid user type",
        });
    }

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      data: user,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
