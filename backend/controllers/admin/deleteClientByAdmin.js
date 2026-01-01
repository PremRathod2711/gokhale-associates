export const deleteClientByAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const client = await Client.findById(id);

    if (!client) {
      return res.status(404).json({
        message: "Client not found",
      });
    }

    await client.deleteOne();

    return res.status(200).json({
      message: "Client deleted successfully",
    });
  } catch {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
