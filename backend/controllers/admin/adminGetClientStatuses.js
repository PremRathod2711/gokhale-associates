import CLIENT_STATUS from "../../config/clientStatus.js";

export const adminGetClientStatuses = (req, res) => {
  return res.status(200).json({
    data: Object.values(CLIENT_STATUS),
  });
};
