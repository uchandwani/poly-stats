// backend/models/StudentResponse.js
import mongoose from "mongoose";

const StudentResponseSchema = new mongoose.Schema({
  exerciseId: { type: String, required: true },
  userId: { type: String, required: true },
  answer: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const StudentResponse = mongoose.model("StudentResponse", StudentResponseSchema);
export default StudentResponse;