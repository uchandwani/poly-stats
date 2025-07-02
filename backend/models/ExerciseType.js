const mongoose = require('mongoose');

const exerciseTypeSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true, // e.g., "MeanDiff_Comparison_01"
  },
  type: {
    type: String,
    required: true, // e.g., "MeanDiff", "Range", "Data"
  },
  subtype: {
    type: String,
    required: true, // e.g., "Comparison", "Single"
  },
  counter: {
    type: Number,
    required: true, // e.g., 1, 2
  },
  description: {
    type: String,
    default: "", // optional explanation
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ExerciseType', exerciseTypeSchema);
