import express from "express";
import authBaseMiddleware from "../middlewares/authBaseMiddleware.js";

const router = express.Router();

router.get("/me", authBaseMiddleware, (req, res) => {
  res.json({
    data: req.user
  });
});

export default router;
