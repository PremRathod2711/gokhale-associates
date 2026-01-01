import { validationResult } from "express-validator";
import Associate from "../../models/Associate.js";
import { signToken } from "../../services/jwtService.js";

export async function associateLoginController(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const associate = await Associate.findOne({ email: req.body.email });
  if (!associate || !(await associate.comparePassword(req.body.password)))
    return res.status(401).json({ message: "Invalid credentials" });

  const token = signToken({ userId: associate._id, role: associate.role });

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000
  });

  res.json({ message: "Login successful" });
}
