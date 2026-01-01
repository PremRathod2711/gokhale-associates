import CA from "../../models/CA.js";
export default async (req, res) => {
  const existing = await CA.findOne({ email: req.body.email });
  if (existing)
    return res.status(409).json({ message: "CA already exists" });

  await CA.create(req.body);
  res.status(201).json({ message: "CA signup successful" });
};
