// insertSamples.js

require('dotenv').config(); // ✅ Load environment variables

const mongoose = require('mongoose');
const MasterExercise = require('../models/MasterExercise');

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    return MasterExercise.insertMany([
      { type: 'Range', subtype: 'Single', counter: 1, code: 'Range_Single_01' },
      { type: 'Range', subtype: 'Comparison', counter: 1, code: 'Range_Comparison_01' },
      { type: 'MeanDiff', subtype: 'Single', counter: 1, code: 'MeanDiff_Single_01' },
    ]);
  })
  .then(() => {
    console.log('✅ Sample exercises inserted');
    mongoose.disconnect();
  })
  .catch((err) => {
    console.error('❌ Error:', err);
  });
