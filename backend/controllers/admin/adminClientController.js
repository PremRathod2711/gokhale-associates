import Client from "../../models/Client.js";

/**
 * GET DELETED CLIENT
 */
export const getDeletedClientsForAdmin = async (req, res) => {
  try {
    const { search } = req.query;

    const query = {
      is_deleted: true,
    };

    if (search && search.trim()) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { panNumber: { $regex: search, $options: "i" } },
      ];
    }

    const clients = await Client.find(query)
      .select("name email panNumber status createdAt")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      count: clients.length,
      data: clients,
    });
  } catch (err) {
    console.error("getDeletedClientsForAdmin:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * SOFT DELETE CLIENT
 */
export const softDeleteClient = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);

    if (!client) return res.status(404).json({ message: "Client not found" });

    if (client.is_deleted)
      return res.status(400).json({ message: "Client already deleted" });

    client.is_deleted = true;
    await client.save();

    return res.status(200).json({
      message: "Client deleted successfully",
    });
  } catch {
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * RESTORE DELETE CLIENT
 */
export const restoreSoftDeletedClient = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);

    if (!client) return res.status(404).json({ message: "Client not found" });

    if (!client.is_deleted)
      return res.status(400).json({ message: "Client is not deleted" });

    client.is_deleted = false;
    await client.save();

    return res.status(200).json({
      message: "Client restored successfully",
    });
  } catch {
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * FORCE DELETE CLIENT
 */
export const forceDeleteClient = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);

    if (!client)
      return res.status(404).json({ message: "Client not found" });

    if (!client.is_deleted)
      return res.status(400).json({
        message: "Client must be deleted before permanent deletion"
      });

    await client.deleteOne();

    return res.status(200).json({
      message: "Client permanently deleted"
    });
  } catch {
    return res.status(500).json({ message: "Internal server error" });
  }
};

