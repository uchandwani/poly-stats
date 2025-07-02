import React, { useEffect, useState } from "react";

import {
  TopBarDescription,
  ProblemHeader,
  InstructionSidebar,
  StudentAnalysisBox,
} from "../shared";

import StatSummaryFormEnhanced from "../components/StatSummaryFormEnhanced";
import { fetchSubmission } from "../services/api";

export default function RangeMeasure({ code = "Range_01", studentId = "Student1" }) {
  const [config, setConfig] = useState({});
  const [expectedSummary, setExpectedSummary] = useState({});
  const [studentSummary, setStudentSummary] = useState({});
  const [validationResults, setValidationResults] = useState(null);
  const [studentNote, setStudentNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
  async function loadExerciseAndSubmission() {
    try {
      const res = await fetch(`/api/exercises/by-code/${code}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      console.log("✅ Exercise data loaded:", data);

      const intervals = data.classIntervals || [];
      const freqs = data.frequencies || [];

      if (!intervals.length || !freqs.length) {
        console.warn("⚠️ Missing or empty intervals/freqs for", code);
      }

      setConfig({
        statMeasure: "Range",
        topBar: data.description,
        meta: {
          title: data.title || "Dataset A",
          description: data.questionText || "Grouped frequency distribution",
          intervals,
          freqs,
        },
        summaryTitle: data.summaryTitle ?? "Summary Statistics",
        summaryKeys: data.summaryKeys ?? ["range", "coefficientOfRange"],
        analysisPrompt: data.analysisPrompt ?? "",
        instructions: data.instructions ?? [],
        intervalLabel: data.intervalLabel ?? "Class Interval",
        frequencyBarLabel: data.frequencyBarLabel ?? "Frequency",
      });

      // ✅ Load saved submission if exists
      const saved = await fetchSubmission(code, studentId);
      console.log("✅ Saved submission loaded:", saved);

      if (saved) {
        setStudentNote(saved.analysisText || "");
        setStudentSummary(saved.summaryStats || {});
        setValidationResults([]);
      }
    } catch (err) {
      console.error("❌ Error loading exercise or submission:", err);
      setLoadError("⚠️ Failed to load exercise. Please try again later.");
    }
  }

  loadExerciseAndSubmission();
}, [code, studentId]);


  useEffect(() => {
  const { classIntervals = [] } = config;

  if (classIntervals.length) {
    const lowerBounds = classIntervals.map(ci => parseFloat(ci.split("-")[0]));
    const upperBounds = classIntervals.map(ci => parseFloat(ci.split("-")[1]));

    const min = Math.min(...lowerBounds);
    const max = Math.max(...upperBounds);
    const range = max - min;
    const coefficientOfRange = (range / (max + min)) * 100;

    const summary = { range: range.toFixed(2), coefficientOfRange: coefficientOfRange.toFixed(2) };
    console.log("📊 Computed summary:", summary);
    setExpectedSummary(summary);
  }
}, [config]);


  const handleValidateSummary = () => {
    const results = {};
    for (const key of config.summaryKeys || []) {
      const studentVal = parseFloat(studentSummary[key]);
      const expectedVal = parseFloat(expectedSummary[key]);
      results[key] = Math.abs(studentVal - expectedVal) < 0.01;
    }
    setValidationResults(results);
  };

  const handleSubmit = async (isFinal) => {
  try {
    setIsSubmitting(true);
    const res = await fetch("/api/submissions/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        exerciseCode: code,
        studentId,
        analysisText: studentNote,
        summaryStats: studentSummary, // Only one dataset, no A/B split
        isFinal,
      }),
    });

    const result = await res.json();
    if (!result.ok) throw new Error(result.error);

    alert(isFinal ? "✅ Submission saved!" : "💾 Draft saved!");
  } catch (err) {
    console.error("❌ Submission error:", err);
    alert("❌ Error saving submission.");
  } finally {
    setIsSubmitting(false);
  }
};


  return (
    <div className="p-6 space-y-8 max-w-screen-md mx-auto">


      <div className="bg-yellow-50 border border-yellow-300 rounded p-4 mb-6">
        <h2 className="text-lg font-semibold mb-2 text-yellow-900">📘 Problem Statement</h2>
        {config.topBar && <TopBarDescription text={config.topBar} />}
      </div>
     

      {config.meta?.intervals?.length && config.meta?.freqs?.length ? (
        <ProblemHeader config={config.meta} />
      ) : (
        <p className="text-sm text-red-500">⚠️ No data to display in header table.</p>
      )}

      {config.instructions?.length > 0 && (
        <InstructionSidebar instructions={config.instructions} />
      )}

      <h2 className="font-bold text-lg mt-4">{config.summaryTitle}</h2>

      <StatSummaryFormEnhanced
        expectedStats={expectedSummary}
        statMeasure="range"
        summaryKeys={config.summaryKeys}
        studentSummary={studentSummary}
        setStudentSummary={setStudentSummary}
        validationResults={validationResults}
      />

      
       {/* Analysis Box */}
  <StudentAnalysisBox
    studentNote={studentNote}
    setStudentNote={setStudentNote}
    prompt={config.analysisPrompt}
  />

  {/* Submit Buttons */}
  <div className="mt-4 flex gap-4">
    <button
      onClick={() => handleSubmit(false)}
      className="px-4 py-2 bg-blue-300 text-white rounded"
      disabled={isSubmitting}
    >
      {isSubmitting ? "⏳ Saving…" : "💾 Save Draft"}
    </button>
    <button
      onClick={() => handleSubmit(true)}
      className="px-4 py-2 bg-blue-500 text-white rounded"
      disabled={isSubmitting}
    >
      {isSubmitting ? "⏳ Submitting…" : "✅ Submit Final"}
    </button>
  </div>
</div> 
);

}
