import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";

import connectDB from "./utils/db.js";

import adminRoutes from "./routes/adminRoutes.js";
import associateRoutes from "./routes/associateRoutes.js";
import caRoutes from "./routes/caRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import clientActionRoutes from "./routes/clientActionRoutes.js";
import publicRoutes from "./routes/publicRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();
const app = express();

// DB
connectDB();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true
  })
);

app.use(express.json({ type: "*/*" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

// Routes
app.use("/api/admin", adminRoutes);
app.use("/api/associate", associateRoutes);
app.use("/api/ca", caRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/client-actions", clientActionRoutes);
app.use("/api/public", publicRoutes);
app.use("/api/auth", authRoutes);


// Health check
app.get("/", (req, res) => {
  res.json({ message: "Backend running successfully" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
