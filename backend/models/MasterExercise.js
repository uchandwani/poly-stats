import mongoose from "mongoose";

const MasterExerciseSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  title: String,
  category: String,
  type: String,  // e.g., "mean", "range", "sd"
  number: Number,
  description: String,
  tags: [String],
  isActive: { type: Boolean, default: true },
  difficulty: { type: String, enum: ["easy", "medium", "hard"], default: "medium" },
  createdAt: { type: Date, default: Date.now }
});

// ✅ Use const here
const MasterExercise = mongoose.models.MasterExercise || mongoose.model("MasterExercise", MasterExerciseSchema);

export default MasterExercise;
