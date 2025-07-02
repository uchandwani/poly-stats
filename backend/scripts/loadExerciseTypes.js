const mongoose = require('mongoose');
const ExerciseType = require('../models/ExerciseType');
require('dotenv').config();

const masterData = [
  { code: 'Range_Single_01', type: 'Range', subtype: 'Single', counter: 1 },
  { code: 'Range_Comparison_01', type: 'Range', subtype: 'Comparison', counter: 1 },
  { code: 'MeanDiff_Single_01', type: 'MeanDiff', subtype: 'Single', counter: 1 },
  { code: 'MeanDiff_Comparison_01', type: 'MeanDiff', subtype: 'Comparison', counter: 1 },
  { code: 'MeanDiff_Comparison_02', type: 'MeanDiff', subtype: 'Comparison', counter: 2 },
  { code: 'Data_Single_01', type: 'Data', subtype: 'Single', counter: 1 },
  { code: 'Data_Single_02', type: 'Data', subtype: 'Single', counter: 2 }
];

async function loadMasterData() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await ExerciseType.deleteMany({});
    await ExerciseType.insertMany(masterData);
    console.log('✅ Master exercise types loaded.');
    mongoose.disconnect();
  } catch (err) {
    console.error('❌ Error loading master data:', err);
    mongoose.disconnect();
  }
}

loadMasterData();
