import express from "express";
import Submission from "../models/Submission.js";

const router = express.Router();

const normalizeKeys = (obj) =>
  Object.fromEntries(Object.entries(obj || {}).map(([k, v]) => [k.toLowerCase(), v]));

// 🔵 Save full submission including tableInputs and summaryStats
router.post("/save", async (req, res) => {
  try {
    const {
      exerciseCode,
      studentId,
      analysisText,
      tableInputs,
      summaryStats,
      isFinal,
    } = req.body;

 
     console.log("📥 Received from frontend:");
    console.log("exerciseCode:", exerciseCode);
    console.log("studentId:", studentId);
    console.log("analysisText:", analysisText); // 👈 Important check
    console.log("summaryStats:", summaryStats);

    const filter = { exerciseCode, studentId };
    const update = {
      submittedAt: new Date(),
      isFinal: isFinal || false,
      analysisText,
      tableInputs,
      summaryStats: normalizeKeys(summaryStats),  // ✅ Enforce lowercase keys

    };

    const result = await Submission.findOneAndUpdate(filter, update, {
      upsert: true,
      new: true,
    });

    console.log("✅ Full submission saved via /save:", result);
    res.status(200).json({ ok: true, data: result });
  } catch (err) {
    console.error("❌ Save submission error:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

// 🔵 Fallback lightweight POST (only analysisText/isFinal)
router.post("/", async (req, res) => {
  const { exerciseCode, studentId, analysisText, isFinal } = req.body;

  if (!exerciseCode || !studentId) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const update = {
      analysisText,
      isFinal: isFinal || false,
      submittedAt: new Date(),
    };

    const options = { upsert: true, new: true, setDefaultsOnInsert: true };

    const submission = await Submission.findOneAndUpdate(
      { exerciseCode, studentId },
      update,
      options
    );

    console.log("✅ Submission saved via /:", submission);
    res.status(200).json(submission);
  } catch (err) {
    console.error("💥 Error saving submission:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// 🔵 GET via /by-student
router.get("/by-student", async (req, res) => {
  const { code, student } = req.query;
  console.log("🟢 API hit: /by-student", { code, student });

  if (!code || !student) {
    console.warn("❌ Missing parameters");
    return res.status(400).json({ message: "Missing required parameters" });
  }

  try {
    const submission = await Submission.findOne({
      exerciseCode: code,
      studentId: student,
    });

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

// 🔵 Optional fallback GET for legacy queries
router.get("/get", async (req, res) => {
  const { exerciseCode, studentId } = req.query;
  try {
    const submission = await Submission.findOne({ exerciseCode, studentId });
    res.status(200).json({ ok: true, submission });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

export default router;
