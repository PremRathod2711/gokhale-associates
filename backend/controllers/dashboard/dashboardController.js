import Client from "../../models/Client.js";
import CLIENT_STATUS from "../../config/clientStatus.js";
// ---------- SEARCH ----------
const buildSearchQuery = (search) => {
  if (!search) return {};
  return {
    $or: [
      { name: new RegExp(search, "i") },
      { email: new RegExp(search, "i") },
      { panNumber: new RegExp(search, "i") },
    ],
  };
};

// ---------- ASSOCIATE DASHBOARD ----------
export const getAssociateDashboard = async (req, res) => {
  try {
    const associateId = req.user.userId;

    const sections = {
      PENDING: CLIENT_STATUS.PENDING,
      FILED: CLIENT_STATUS.FILED,
      APPROVED: CLIENT_STATUS.CA_APPROVED,
      BILLED: CLIENT_STATUS.BILLED,
    };

    const data = {};
    for (const key in sections) {
      data[key] = {
        count: await Client.countDocuments({
          createdBy: associateId,
          status: sections[key],
          is_deleted: false,
        }),
      };
    }

    return res.status(200).json({
      user: req.user,
      sections: data,
    });
  } catch {
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ---------- CA DASHBOARD ----------
export const getCADashboard = async (req, res) => {
  try {
    const caId = req.user.userId;

    return res.status(200).json({
      user: req.user,
      sections: {
        PENDING_REVIEW: await Client.countDocuments({
          assignedCA: caId,
          status: CLIENT_STATUS.PENDING_REVIEW,
          is_deleted: false,
        }),
        APPROVED: await Client.countDocuments({
          assignedCA: caId,
          status: CLIENT_STATUS.CA_APPROVED,
          is_deleted: false,
        }),
      },
    });
  } catch {
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ---------- ADMIN DASHBOARD ----------
export const getAdminDashboard = async (req, res) => {
  try {
    return res.status(200).json({
      user: req.user,
      sections: {
        SIGNED_AND_BILLED: await Client.countDocuments({
          status: CLIENT_STATUS.BILLED,
          is_deleted: false,
        }),
        APPROVED_AND_BILLED: await Client.countDocuments({
          status: CLIENT_STATUS.ADMIN_APPROVED,
          is_deleted: false,
        }),
        COMPLETED: await Client.countDocuments({
          status: CLIENT_STATUS.COMPLETED,
          is_deleted: false,
        }),
        CLOSED: await Client.countDocuments({
          status: CLIENT_STATUS.CLOSED,
          is_deleted: false,
        }),
        USERS: true,
      },
    });
  } catch {
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ---------- SECTION LIST ----------
export const getClientsBySection = async (req, res) => {
  try {
    const { status } = req.params;
    const { search } = req.query;
    const { role, userId } = req.user;

    const query = { status, is_deleted: false, ...buildSearchQuery(search) };

    if (role === "ASSOCIATE") query.createdBy = userId;
    if (role === "CA") query.assignedCA = userId;

    const clients = await Client.find(query).select(
      "name email phone panNumber status closedAt closedBy remarks billingAmount formDraft billingAmountCollectedDate "
    );

    return res.status(200).json({
      count: clients.length,
      data: clients,
    });
  } catch {
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ---------- CLIENT DETAILS ----------
export const getClientDetails = async (req, res) => {
  try {
    const { role, userId } = req.user;

    const client = await Client.findById(req.params.id)
      .populate("createdBy", "name email")
      .populate("assignedCA", "name email")
      .populate("handledByAdmin", "name email");

    if (!client) return res.status(404).json({ message: "Client not found" });

    if (client.is_deleted) {
      return res.status(404).json({ message: "Client not found" });
    }

    // visibility check
    if (role === "ASSOCIATE" && client.createdBy._id.toString() !== userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    if (role === "CA" && client.assignedCA?._id.toString() !== userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    return res.status(200).json({ data: client });
  } catch {
    return res.status(500).json({ message: "Internal server error" });
  }
};
