import express from "express";
import Submission from "../models/Submission.js";

const router = express.Router();

router.get("/get", async (req, res) => {
  const { exerciseCode, studentId } = req.query;
  try {
    const submission = await Submission.findOne({ exerciseCode, studentId });
    res.status(200).json({ ok: true, submission });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

router.get("/by-student", async (req, res) => {
  const { code, student } = req.query;
  console.log("🟢 API hit: /by-student", { code, student });

  if (!code || !student) {
    console.warn("❌ Missing parameters");
    return res.status(400).json({ message: "Missing required parameters" });
  }

  try {
    const filter = { exerciseCode: code, studentId: student };
    console.log("🔍 Query filter:", filter);

    const submission = await Submission.findOne(filter);
    console.log("📦 Mongo result:", submission);

    if (!submission) {
      console.warn("📭 No submission found");
      return res.status(404).json({ message: "Submission not found" });
    }

    console.log("✅ Submission retrieved:", submission);
    res.json(submission);
  } catch (err) {
    console.error("💥 Error retrieving submission:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});



export default router; // ✅ required!



