// File: seed/seedExercises.js or similar

const mongoose = require("mongoose");
const Exercise = require("../models/Exercise"); // adjust path as needed

const seedMean01 = {
  code: "Mean_01",
  generateRandomData: true, // 🔥 key flag for grouped generation

  dataGeneration: {
    dataCount: 100,
    minValue: 20,
    maxValue: 100,
    intervalSize: 10,
    distribution: "uniform",
    decimalPlaces: 0
  },

  instructions: [
    "Group the generated raw data into class intervals of 10.",
    "Create a frequency table and compute the Mean using mid-points."
  ],

  summaryTitle: "Mean from Grouped Data",
  tableColumns: [
    "Class Interval",    // e.g., "20-30"
    "Frequency",         // fᵢ
    "Mid-point",         // xᵢ
    "fᵢxᵢ",              // fᵢxᵢ
    "|xᵢ - x̄|",          // absolute deviation
    "fᵢ|xᵢ - x̄|"        // weighted absolute deviation
  ]
  analysisPrompt: "Explain how grouping affects the mean. Is the result sensitive to interval boundaries?"
};
