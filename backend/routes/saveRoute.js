// routes/saveRoute.js
const express = require("express");
const router = express.Router();
const Submission = require("../models/Submission");
const dbConnect = require("../lib/dbConnect");

// Ensure MongoDB is connected (optional if already globally connected)
dbConnect();

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

    const filter = { exerciseCode, studentId };
    const update = {
      submittedAt: new Date(),
      isFinal,
      analysisText,
      tableInputs,
      summaryStats,
    };

    const result = await Submission.findOneAndUpdate(filter, update, {
      upsert: true,
      new: true,
    });

    res.status(200).json({ ok: true, data: result });
  } catch (err) {
    console.error("❌ Save submission error:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

export default router; // ✅ required!
