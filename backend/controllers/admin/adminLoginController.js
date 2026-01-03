import { validationResult } from "express-validator";
import Admin from "../../models/Admin.js";
import { signToken } from "../../services/jwtService.js";

export async function adminLoginController(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { email, password } = req.body;
  const admin = await Admin.findOne({ email });

  if (!admin || !(await admin.comparePassword(password)))
    return res.status(401).json({ message: "Invalid credentials" });

  const token = signToken({ userId: admin._id, role: admin.role });

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
    maxAge: 24 * 60 * 60 * 1000
  });

  res.json({ message: "Login successful" });
}
