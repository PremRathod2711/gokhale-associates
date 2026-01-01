import express from "express";
import CA from "../models/CA.js";
import authBaseMiddleware from "../middlewares/authBaseMiddleware.js";

const router = express.Router();

router.get("/cas", authBaseMiddleware, async (req, res) => {
  const cas = await CA.find().select("name email");
  res.json({ data: cas });
});

export default router;
