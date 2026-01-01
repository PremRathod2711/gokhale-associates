import CA from "../../models/CA.js";
import { signToken } from "../../services/jwtService.js";

export default async (req, res) => {
  const ca = await CA.findOne({ email: req.body.email });
  if (!ca || !(await ca.comparePassword(req.body.password)))
    return res.status(401).json({ message: "Invalid credentials" });

  const token = signToken({ userId: ca._id, role: ca.role });

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000
  });

  res.json({ message: "Login successful" });
};
