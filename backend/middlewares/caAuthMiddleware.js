import authBaseMiddleware from "./authBaseMiddleware.js";

const caAuthMiddleware = (req, res, next) => {
  authBaseMiddleware(req, res, () => {
    if (req.user.role !== "CA") {
      return res.status(403).json({
        message: "CA access required"
      });
    }
    next();
  });
};

export default caAuthMiddleware;
