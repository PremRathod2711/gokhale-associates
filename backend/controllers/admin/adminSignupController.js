import { validationResult } from "express-validator";
import Admin from "../../models/Admin.js";

export async function adminSignupController(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const existing = await Admin.findOne({ email: req.body.email });
  if (existing)
    return res.status(409).json({ message: "Admin already exists" });

  await Admin.create(req.body);
  res.status(201).json({ message: "Admin signup successful" });
}
