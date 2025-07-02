import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
//import submissionGetRoutes from "./routes/submissionRoutes_get.js";

import authRoutes from "./routes/authRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";
import exerciseRoutes from "./routes/exerciseRoutes.js";
import submissionRoutes from "./routes/submissionRoutes.js";
import responseRoutes from "./routes/responseRoutes.js";
import protectedRoutes from "./routes/protectedRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// ✅ Log every request
app.use((req, res, next) => {
  console.log(`🌐 Incoming request: ${req.method} ${req.url}`);
  next();
});

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connection established"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ API Routes
app.use('/api/auth', authRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/exercises', exerciseRoutes);
app.use('/api/submissions', submissionRoutes);
//app.use("/api/submissions", submissionGetRoutes);
app.use('/api/responses', responseRoutes);
app.use('/api/protected', protectedRoutes);

// ✅ Health Check
app.get("/", (req, res) => {
  res.send("Backend API is running");
});

// ✅ Fallback
app.all('*', (req, res) => {
  console.log(`🔍 Unknown route: ${req.method} ${req.url}`);
  res.status(404).send("Fallback route hit");
});

// ✅ Start
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
