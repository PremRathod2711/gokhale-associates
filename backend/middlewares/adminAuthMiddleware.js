import authBaseMiddleware from "./authBaseMiddleware.js";

const adminAuthMiddleware = (req, res, next) => {
  authBaseMiddleware(req, res, () => {
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({
        message: "Admin access required"
      });
    }
    next();
  });
};

export default adminAuthMiddleware;
