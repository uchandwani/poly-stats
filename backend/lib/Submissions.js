import mongoose from "mongoose";

const SubmissionSchema = new mongoose.Schema(
  {
    exerciseCode: { type: String, required: true }, // like "MeanDeviation_01"
    studentName: { type: String },                  // optional for now
    analysisText: { type: String },

    // Optional metadata
    submittedAt: { type: Date, default: Date.now },

    // Flexible table and summary inputs
    tableData: { type: Array, default: [] },        // e.g., [{ range: '10-20', fi: 5 }, ...]
    summaryStats: { type: Object, default: {} },    // e.g., { mean: 25.5, stdDev: 5.2, ... }

  },
  { timestamps: true }
);

// Prevent model overwrite during dev
export default mongoose.models.Submission || mongoose.model("Submission", SubmissionSchema);
