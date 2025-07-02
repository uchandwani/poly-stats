// models/Submission.js
import mongoose from "mongoose";

const SubmissionSchema = new mongoose.Schema({
  exerciseCode: { type: String, required: true },
  studentId: { type: String, required: true },
  analysisText: { type: String },
  tableInputs:  { type: Array, default: [] },
  summaryStats: { type: Object, default: {} },
  isFinal:      { type: Boolean, default: false },
  submittedAt:  { type: Date, default: Date.now },
}, { timestamps: true });


const Submission = mongoose.models.Submission || mongoose.model("Submission", SubmissionSchema);

export default Submission;
