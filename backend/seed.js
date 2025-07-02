const mongoose = require('mongoose');
const MasterExercise = require('./models/MasterExercise');

// 🔗 Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/poly-stats')
  .then(() => {
    console.log(`✅ MongoDB connected to DB: ${mongoose.connection.name}`);
    return seedData(); // Return promise
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

async function seedData() {
  try {

    await MasterExercise.deleteMany({});
    console.log("🗑️  Existing MasterExercise records deleted");


     const exercises = [
   {
      code: "Range_Single_01",
      slug: "range-single-01",
      title: "Range - Single Set",
      type: "range",
      subtype: "single",
      description: "Calculate range for a single dataset.",
      question: "Find the range of [5, 10, 15, 20]",
      inputFormat: "array",
      solutionSteps: "1. Max - Min"
    },
    {
      code: "Mean_01",
      slug: "mean-deviation-01",
      title: "Mean Deviation - Single",
      type: "mean",
      subtype: "single",
      description: "Compute the mean deviation from a given dataset.",
      question: "Find mean deviation of [10, 12, 15, 18]",
      inputFormat: "array",
      solutionSteps: "1. Calculate Mean\n2. Subtract mean from each value\n3. Take absolute values\n4. Average them"
    },
    {
      code: "SD_Compare_01",
      slug: "standard-deviation-compare-01",
      title: "Standard Deviation Comparison",
      type: "sd",
      subtype: "compare",
      description: "Compare the variability of two datasets using SD.",
      question: "Compare SD of [10, 20, 30] vs [12, 22, 32]",
      inputFormat: "array-compare",
      solutionSteps: "1. Find mean for both\n2. Calculate SD for both\n3. Compare values"
    }, 

     {
      code: "Insights_01",
      slug: "Insights_01",
      title: "Insights & Reflections",
      type: "Overall",
      subtype: "Insights",
      description: "An overall analysis task that helps synthesize concepts across statistical topics.",
      question: "Reflect on the trends and variability observed across different exercises and summarize key takeaways.",
      inputFormat: "array-compare",
      solutionSteps: "",
  
    },
    {
  code: "Range_Single_02",
  slug: "range-single-02",
  title: "Range - Single Set 02",
  type: "range",
  subtype: "single",
  description: "Find the range of a basic dataset.",
  question: "Find the range of [3, 7, 11, 14]",
  inputFormat: "array",
  solutionSteps: "1. Max - Min"
},
{
  code: "Range_Single_03",
  slug: "range-single-03",
  title: "Range - Single Set 03",
  type: "range",
  subtype: "single",
  description: "Determine the range of given numbers.",
  question: "Find the range of [6, 12, 15, 21]",
  inputFormat: "array",
  solutionSteps: "1. Max - Min"
},
{
  code: "Range_Single_04",
  slug: "range-single-04",
  title: "Range - Single Set 04",
  type: "range",
  subtype: "single",
  description: "Range practice for a sample dataset.",
  question: "Find the range of [1, 8, 9, 14]",
  inputFormat: "array",
  solutionSteps: "1. Max - Min"
},
{
  code: "Range_Single_05",
  slug: "range-single-05",
  title: "Range - Single Set 05",
  type: "range",
  subtype: "single",
  description: "Calculate range from list.",
  question: "Find the range of [2, 4, 10, 18]",
  inputFormat: "array",
  solutionSteps: "1. Max - Min"
},

// --------- Additional Mean Exercises ---------
{
  code: "Mean_02",
  slug: "mean-deviation-02",
  title: "Mean Deviation - Single 02",
  type: "mean",
  subtype: "single",
  description: "Mean deviation practice.",
  question: "Find mean deviation of [9, 11, 13, 17]",
  inputFormat: "array",
  solutionSteps: "Same steps as Mean_01"
},
{
  code: "Mean_03",
  slug: "mean-deviation-03",
  title: "Mean Deviation - Single 03",
  type: "mean",
  subtype: "single",
  description: "Mean deviation example with small values.",
  question: "Find mean deviation of [6, 8, 10, 12]",
  inputFormat: "array",
  solutionSteps: "Same steps as Mean_01"
},
{
  code: "Mean_04",
  slug: "mean-deviation-04",
  title: "Mean Deviation - Single 04",
  type: "mean",
  subtype: "single",
  description: "Mean deviation calculation from a set.",
  question: "Find mean deviation of [4, 5, 7, 9]",
  inputFormat: "array",
  solutionSteps: "Same steps as Mean_01"
},
{
  code: "Mean_05",
  slug: "mean-deviation-05",
  title: "Mean Deviation - Single 05",
  type: "mean",
  subtype: "single",
  description: "Basic practice with mean deviation.",
  question: "Find mean deviation of [20, 22, 25, 30]",
  inputFormat: "array",
  solutionSteps: "Same steps as Mean_01"
},

// --------- Additional SD Exercises ---------
{
  code: "SD_02",
  slug: "standard-deviation-compare-02",
  title: "Standard Deviation Comparison 02",
  type: "sd",
  subtype: "compare",
  description: "Compare SD between two datasets.",
  question: "Compare SD of [8, 10, 12] vs [9, 11, 13]",
  inputFormat: "array-compare",
  solutionSteps: "Same steps as SD_Compare_01"
},
{
  code: "SD_03",
  slug: "standard-deviation-compare-03",
  title: "Standard Deviation Comparison 03",
  type: "sd",
  subtype: "compare",
  description: "SD comparison for small datasets.",
  question: "Compare SD of [3, 6, 9] vs [4, 7, 10]",
  inputFormat: "array-compare",
  solutionSteps: "Same steps as SD_Compare_01"
},
{
  code: "SD_04",
  slug: "standard-deviation-compare-04",
  title: "Standard Deviation Comparison 04",
  type: "sd",
  subtype: "compare",
  description: "Compare standard deviation of values.",
  question: "Compare SD of [1, 2, 3] vs [2, 3, 4]",
  inputFormat: "array-compare",
  solutionSteps: "Same steps as SD_Compare_01"
},
{
  code: "SD_05",
  slug: "standard-deviation-compare-05",
  title: "Standard Deviation Comparison 05",
  type: "sd",
  subtype: "compare",
  description: "SD analysis task.",
  question: "Compare SD of [5, 10, 15] vs [7, 14, 21]",
  inputFormat: "array-compare",
  solutionSteps: "Same steps as SD_Compare_01"
},

// --------- Additional Insights Exercises ---------
{
  code: "Insights_02",
  slug: "insights-02",
  title: "Insights & Reflections 02",
  type: "overall",
  subtype: "insights",
  description: "Reflect on your progress across exercises.",
  question: "Summarize key takeaways from last two exercises.",
  inputFormat: "text",
  solutionSteps: ""
},
{
  code: "Insights_03",
  slug: "insights-03",
  title: "Insights & Reflections 03",
  type: "overall",
  subtype: "insights",
  description: "Identify learnings from comparisons.",
  question: "What did you learn while comparing SD and Mean?",
  inputFormat: "text",
  solutionSteps: ""
},
{
  code: "Insights_04",
  slug: "insights-04",
  title: "Insights & Reflections 04",
  type: "overall",
  subtype: "insights",
  description: "Discuss where range is useful vs SD.",
  question: "Discuss which metric you find more useful—Range or SD—and why.",
  inputFormat: "text",
  solutionSteps: ""
},
{
  code: "Insights_05",
  slug: "insights-05",
  title: "Insights & Reflections 05",
  type: "overall",
  subtype: "insights",
  description: "Reflections on statistics",
  question: "Write a summary on the importance of measuring dispersion.",
  inputFormat: "text",
  solutionSteps: ""
}

      // Add more exercises here
    ];

    await MasterExercise.insertMany(exercises);
    console.log("✅ Exercises seeded");
    mongoose.disconnect();
  } catch (err) {
    console.error("❌ MongoDB seed error:", err);
    mongoose.disconnect();
    process.exit(1);
  }
}
