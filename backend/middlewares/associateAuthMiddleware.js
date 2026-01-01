import authBaseMiddleware from "./authBaseMiddleware.js";

const associateAuthMiddleware = (req, res, next) => {
  authBaseMiddleware(req, res, () => {
    if (req.user.role !== "ASSOCIATE") {
      return res.status(403).json({
        message: "Associate access required"
      });
    }
    next();
  });
};

export default associateAuthMiddleware;
