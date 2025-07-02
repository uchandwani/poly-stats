import mongoose from "mongoose";

const ExerciseSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },

  // 🧠 Control modes
  generateRandomData: { type: Boolean, default: false },        // → grouped via dataGeneration
  isRawData: { type: Boolean, default: false },                 // → static raw via rawValues
  generateRandomRawData: { type: Boolean, default: false },     // → raw via rawDataGeneration

  // 🎯 For Static Grouped Data
  classIntervals: [String],    // e.g., ["0-10", "10-20", ...]
  frequencies: [Number],       // e.g., [3, 7, 10, ...]

  // 🎲 For Generated Grouped Data
  dataGeneration: {
    dataCount: Number,
    minValue: Number,
    maxValue: Number,
    intervalSize: Number,
    distribution: {
      type: String,
      enum: ['uniform', 'normal'],
      default: 'uniform'
    },
    decimalPlaces: { type: Number, default: 0 }
  },

  // 📊 For Static Raw Data
  rawValues: [Number],

  // 🧪 For Generated Raw Data
  rawDataGeneration: {
    dataCount: Number,
    minValue: Number,
    maxValue: Number,
    distribution: {
      type: String,
      enum: ['uniform', 'normal'],
      default: 'uniform'
    },
    decimalPlaces: { type: Number, default: 0 }
  },

  // 📝 Shared metadata
  instructions: [String],
  summaryTitle: String,
  tableColumns: [String],
  analysisPrompt: String
});

const Exercise = mongoose.models.Exercise || mongoose.model("Exercise", ExerciseSchema);

export default Exercise;
