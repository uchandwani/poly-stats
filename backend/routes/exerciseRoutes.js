import express from 'express';
const router = express.Router();
import MasterExercise from '../models/MasterExercise.js';
import Exercise from '../models/Exercise.js'; // 👈 Import the detailed schema



// const generateGroupedData = require('../utils/generateGroupedData');

router.get('/by-code/:code', async (req, res) => {
  try {
    const code = req.params.code;
    console.log("🟢 Received request for code:", code);

    const master = await MasterExercise.findOne({ code });
    const detail = await Exercise.findOne({ code });

    if (!master) {
      console.log("🔴 No master exercise found for code:", code);
      return res.status(404).json({ message: 'Exercise not found' });
    }

    const fullExercise = {
      ...master.toObject(),
      ...(detail?.toObject() || {})  // merge if detail exists
    };

    // 🔁 If flagged, generate random grouped data dynamically
    /* if (fullExercise.generateRandomData && fullExercise.dataGeneration) {
      console.log("⚙️ Generating random grouped data for:", code);
      const generatedData = generateGroupedData(fullExercise.dataGeneration);
      fullExercise.generatedData = generatedData;
    } */

    res.json(fullExercise);
  } catch (err) {
    console.error("❌ Error fetching exercise:", err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// ✅ Add a log to confirm this file loads
console.log("✅ exerciseRoutes.js loaded");

router.get('/test', (req, res) => {
  console.log("🧪 /api/exercises/test route hit");
  res.send("✅ Test route is working");
});


// ✅ New route to get all exercises grouped by type
router.get('/grouped', async (req, res) => {
  try {
    const exercises = await MasterExercise.find({});
    
    const grouped = exercises.reduce((acc, item) => {
      const type = (item.type || 'other').toLowerCase(); // 🔥 normalize to lowercase
      if (!acc[type]) acc[type] = [];
      acc[type].push({
        code: item.code,
        title: item.title,
        _id: item._id
      });
      return acc;
    }, {});

    res.json(grouped);
  } catch (err) {
    console.error("❌ Error in /api/exercises/grouped:", err);
    res.status(500).json({ error: "Failed to load exercises" });
  }
});


export default router; // ✅ required!

