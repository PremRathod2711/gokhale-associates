import { validationResult } from "express-validator";
import Associate from "../../models/Associate.js";

export async function associateSignupController(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const existing = await Associate.findOne({ email: req.body.email });
  if (existing)
    return res.status(409).json({ message: "Associate already exists" });

  await Associate.create(req.body);
  res.status(201).json({ message: "Associate signup successful" });
}
