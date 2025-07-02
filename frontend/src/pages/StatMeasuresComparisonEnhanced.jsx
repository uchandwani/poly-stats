import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import {
  TopBarDescription,
  ProblemHeader,
  InstructionSidebar,
  StudentAnalysisBox,
} from "../shared";
import ValidatedInputTable from "../components/ValidatedInputTable";
import StatSummaryFormEnhanced from "../components/StatSummaryFormEnhanced";
import { statEngines } from "../services/statMeasureEngines";
import { fetchSubmission } from "../services/api";
import { validateStatTable } from "../services/StatValidationPlus";
import { calculateSummaryStats } from "../services/statSummaryEnginePlus";

export default function StatMeasuresComparisonEnhanced() {
  const { code } = useParams();
  const userJson = localStorage.getItem("user");
  const user = userJson ? JSON.parse(userJson) : null;
  const studentId = user?.username || "demo-student";
  const baseURL = import.meta.env.VITE_API_BASE_URL;

  const [config, setConfig] = useState(null);
  const [studentRowsA, setStudentRowsA] = useState([]);
  const [studentRowsB, setStudentRowsB] = useState([]);
  const [validationResultsA, setValidationResultsA] = useState([]);
  const [validationResultsB, setValidationResultsB] = useState([]);
  const [studentSummaryA, setStudentSummaryA] = useState({});
  const [studentSummaryB, setStudentSummaryB] = useState({});
  const [studentNote, setStudentNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadExerciseAndSubmission() {
      try {
        const res = await fetch(`/api/exercises/by-code/${code}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        console.log("📦 Exercise loaded:", data);

        const { statMeasureA, statMeasureB } = data;
        const engineA = statEngines[statMeasureA];
        const engineB = statEngines[statMeasureB];
        if (!engineA || !engineB) throw new Error("❌ Invalid stat engines");

        const configData = data.configData ?? {};
        const isGroupedA = engineA.inputType === "grouped";
        const isGroupedB = engineB.inputType === "grouped";
        const isParamA = engineA.inputType === "parameter";
        const isParamB = engineB.inputType === "parameter";

        let intervalsA = [], freqsA = [];
        let intervalsB = [], freqsB = [];

        if (isGroupedA) {
          intervalsA = configData.classIntervalsA || data.classIntervalsA || data.xiListA || [];
          freqsA = configData.frequenciesA || data.frequenciesA || data.fiListA || [];
        } else if (isParamA) {
           intervalsA = (data.xiListA || []).map(Number);
          freqsA = data.fiListA || [];
        }

        if (isGroupedB) {
          intervalsB = configData.classIntervalsB || data.classIntervalsB || data.xiListB || [];
          freqsB = configData.frequenciesB || data.frequenciesB || data.fiListB || [];
        } else if (isParamB) {
          intervalsB = (data.xiListB || []).map(Number);
          freqsB = data.fiListB || [];
        }

        const datasetA = {
            classIntervals: intervalsA,
            frequencies: freqsA,
          };

          const datasetB = {
            classIntervals: intervalsB,
            frequencies: freqsB,
          };


        console.log("🧪 intervalsA:", intervalsA);
        console.log("🧪 freqsA:", freqsA);
        console.log("🧪 intervalsB:", intervalsB);
        console.log("🧪 freqsB:", freqsB);

        const blankRowsA = engineA.generateInitialRows(intervalsA, freqsA);
        const blankRowsB = engineB.generateInitialRows(intervalsB, freqsB);

        setConfig({
          topBar: data.description,
            metaA: {
            title: "Dataset A",
            description: "Grouped frequency distribution",
            intervals: datasetA.classIntervals,
            freqs: datasetA.frequencies,
            },
            metaB: {
              title: "Dataset B",
              description: "Grouped frequency distribution",
              intervals: datasetB.classIntervals,
              freqs: datasetB.frequencies,
            },
          tableA: engineA.tableConfig,
          tableB: engineB.tableConfig,
          summaryTitle: data.summaryTitle,
          summaryKeysA: engineA.summaryKeys,
          summaryKeysB: engineB.summaryKeys,
          statMeasureA,
          statMeasureB,
          analysisPrompt: data.analysisPrompt,
          instructions: data.instructions,
          dataTableLabel: data.dataTableLabel ?? "Data Tables",
        });

        


        const saved = await fetchSubmission(code, studentId);
        if (saved?.tableInputs?.A?.length || saved?.tableInputs?.B?.length) {
          setStudentNote(saved.analysisText || "");
          setStudentRowsA(saved.tableInputs.A || []);
          setStudentRowsB(saved.tableInputs.B || []);
          setStudentSummaryA(saved.summaryStats?.A || {});
          setStudentSummaryB(saved.summaryStats?.B || {});
        } else {
          setStudentRowsA(blankRowsA);
          setStudentRowsB(blankRowsB);
        }
      } catch (err) {
        console.error("❌ Error loading comparison exercise:", err);
      }
    }

    loadExerciseAndSubmission();
  }, [code, studentId]);

  const engineA = useMemo(() => statEngines[config?.statMeasureA], [config]);
  const engineB = useMemo(() => statEngines[config?.statMeasureB], [config]);

  const expectedRowsA = useMemo(() => {
    if (!config) return [];
    return engineA.generateExpectedRows(config.metaA.intervals, config.metaA.freqs);
  }, [config, engineA]);

  const expectedRowsB = useMemo(() => {
    if (!config) return [];
    return engineB.generateExpectedRows(config.metaB.intervals, config.metaB.freqs);
  }, [config, engineB]);

  const expectedSummaryA = useMemo(() => {
    if (!expectedRowsA.length) return {};
    return calculateSummaryStats(expectedRowsA, config.statMeasureA);
  }, [expectedRowsA, config]);

  const expectedSummaryB = useMemo(() => {
    if (!expectedRowsB.length) return {};
    return calculateSummaryStats(expectedRowsB, config.statMeasureB);
  }, [expectedRowsB, config]);

  const handleValidation = () => {
    const resultsA = validateStatTable({
      inputs: studentRowsA,
      expected: expectedRowsA,
      columns: config.tableA.columns,
      statMeasure: config.statMeasureA,
    });

    const resultsB = validateStatTable({
      inputs: studentRowsB,
      expected: expectedRowsB,
      columns: config.tableB.columns,
      statMeasure: config.statMeasureB,
    });

    setValidationResultsA(resultsA);
    setValidationResultsB(resultsB);
  };

  const handleSubmit = async (isFinal) => {
    try {
      setIsSubmitting(true);
      const res = await fetch(`${baseURL}/submissions/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          exerciseCode: code,
          studentId,
          analysisText: studentNote,
          tableInputs: { A: studentRowsA, B: studentRowsB },
          summaryStats: { A: studentSummaryA, B: studentSummaryB },
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

  if (!config) return <p className="p-4">⏳ Loading comparison exercise…</p>;

 return (
  <div className="p-6 space-y-8 max-w-screen-xl mx-auto">
  <TopBarDescription text={config.topBar} />

  {/* Problem Headers Side by Side */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <ProblemHeader config={config.metaA} />
    <ProblemHeader config={config.metaB} />
  </div>

  {/* Instructions */}
  <InstructionSidebar instructions={config.instructions} />

  {/* Data Tables */}
  <h2 className="font-bold text-lg">{config.dataTableLabel}</h2>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
    {/* Table A */}
    <div className="space-y-2">
      <ValidatedInputTable
        tableConfig={config.tableA}
        rows={studentRowsA}
        setRows={setStudentRowsA}
        validationResults={validationResultsA}
      />
      <button
        onClick={handleValidation}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        ✅ Validate Dataset A
      </button>
    </div>

    {/* Table B */}
    <div className="space-y-2">
      <ValidatedInputTable
        tableConfig={config.tableB}
        rows={studentRowsB}
        setRows={setStudentRowsB}
        validationResults={validationResultsB}
      />
      <button
        onClick={handleValidation}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        ✅ Validate Dataset B
      </button>
    </div>
  </div>

  {/* Summary Section */}
  <h2 className="font-bold text-lg mt-4">{config.summaryTitle}</h2>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <StatSummaryFormEnhanced
      expectedStats={expectedSummaryA}
      statMeasure={config.statMeasureA}
      summaryKeys={config.summaryKeysA}
      studentSummary={studentSummaryA}
      setStudentSummary={setStudentSummaryA}
    />
    <StatSummaryFormEnhanced
      expectedStats={expectedSummaryB}
      statMeasure={config.statMeasureB}
      summaryKeys={config.summaryKeysB}
      studentSummary={studentSummaryB}
      setStudentSummary={setStudentSummaryB}
    />
  </div>

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