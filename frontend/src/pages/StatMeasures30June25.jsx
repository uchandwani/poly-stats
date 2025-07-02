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

export default function StatMeasures() {
  const { code } = useParams();
  const userJson = localStorage.getItem("user");
  const user = userJson ? JSON.parse(userJson) : null;
  const studentId = user?.username || "demo-student";
  const baseURL = import.meta.env.VITE_API_BASE_URL;

  const [config, setConfig] = useState(null);
  const [studentRows, setStudentRows] = useState([]);
  const [validationResults, setValidationResults] = useState([]);
  const [studentNote, setStudentNote] = useState("");
  const [studentSummary, setStudentSummary] = useState({});
  const [totalRow, setTotalRow] = useState({});
  const [loadError, setLoadError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 🧠 Derived config engine and data
  const engine = useMemo(() => statEngines[config?.statMeasure], [config?.statMeasure]);
  const { intervals = [], freqs = [] } = config?.meta ?? {};
  const columns = config?.table?.columns ?? [];

  const expectedRows = useMemo(() => {
    if (!intervals.length || !freqs.length || !columns.length || !engine) return [];
    return engine.generateExpectedRows(intervals, freqs);
  }, [intervals, freqs, columns, engine]);

  const expectedSummary = useMemo(() => {
    if (!expectedRows.length || !config?.statMeasure) return {};
    return calculateSummaryStats(expectedRows, config.statMeasure);
  }, [expectedRows, config?.statMeasure]);

  useEffect(() => {
    if (engine && expectedRows.length) {
      const totals = engine.generateTotalRow(expectedRows, columns);
      setTotalRow(totals);
    }
  }, [expectedRows, columns, engine]);

  useEffect(() => {
    async function loadExerciseAndSubmission() {
      try {
        const res = await fetch(`/api/exercises/by-code/${code}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        console.log("✅ Exercise data loaded:", data);

        const measure = data.statMeasure;
        const engine = statEngines[measure];
        if (!engine) throw new Error(`❌ Unknown stat engine: ${measure}`);

        const intervals = data.configData?.values ?? data.configData?.classIntervals ?? data.classIntervals ?? [];
        const freqs = data.configData?.frequencies ?? data.frequencies ?? [];

        if (!intervals.length || !freqs.length) {
          console.warn("⚠️ Missing or empty intervals/freqs for", code);
        }

       const blankRows = (() => {
          if (!engine) return [];

          // ✅ Safety guard based on declared inputType
          if (engine.inputType === "grouped") {
            return engine.generateInitialRows(intervals, freqs);
          } else if (engine.inputType === "parameter") {
            return engine.generateInitialRows(
              data.configData?.xiList || data.configData?.values || [],
              data.configData?.frequencies ?? []
            );
          } else {
            console.warn("⚠️ Unknown inputType:", engine.inputType);
            return [];
          }
        })();


        console.log("📊 Blank rows generated:", blankRows);

        setConfig({
          statMeasure: measure,
          topBar: data.description,
          meta: {
            title: data.title,
            description: data.questionText,
            intervals,
            freqs,
          },
          table: engine.tableConfig,
          summaryTitle: data.summaryTitle,
          summaryKeys: engine.summaryKeys,
          analysisPrompt: data.analysisPrompt,
          instructions: data.instructions,
          intervalLabel: data.intervalLabel ?? "Class Interval", // ✅ Add this line
          frequencyBarLabel: data.frequencyBarLabel ?? "Distribution",
          dataTableLabel: data.dataTableLabel ?? "Data Table",
          instructionsLabel: data.instructionsLabel ?? "Instructions",
        });

        const saved = await fetchSubmission(code, studentId);
        console.log("✅ Saved submission loaded:", saved);

        if (saved?.tableInputs?.length) {
          setStudentNote(saved.analysisText || "");
          setStudentRows(saved.tableInputs || []);
          setStudentSummary(saved.summaryStats || {});
          setValidationResults([]);
        } else {
          setStudentRows(blankRows);
        }
      } catch (err) {
        console.error("❌ Error loading exercise or submission:", err);
        setLoadError("⚠️ Failed to load exercise. Please try again later.");
      }
    }

    loadExerciseAndSubmission();
  }, [code, studentId]);

  const handleValidation = () => {
    if (!engine?.generateExpectedRows) return;
    const expected = engine.generateExpectedRows(intervals, freqs);
    const results = validateStatTable({
      inputs: studentRows,
      expected,
      columns,
      statMeasure: config.statMeasure,
    });
    setValidationResults(results);
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
          tableInputs: studentRows,
          summaryStats: studentSummary,
          isFinal,
        }),
      });
      const result = await res.json();
      if (!result.ok) throw new Error(result.error);
      alert(isFinal ? "✅ Submission saved!" : "💾 Draft saved!");
    } catch (err) {
      console.error("❌ Error saving submission:", err);
      alert("❌ Error saving submission. See console.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ⚠️ Early exit UI
  if (loadError) return <p className="p-4 text-red-600">{loadError}</p>;
  if (!config) return <p className="p-4">⏳ Loading…</p>;


  return (
    <div className="p-4 space-y-6">
      <TopBarDescription text={config.topBar} />
      
      <ProblemHeader config={config?.meta} />

      <div className="flex gap-6">
        <InstructionSidebar instructions={config.instructions} />

        <div className="flex-1">
          <h2 className="font-bold text-lg mb-2">{config.dataTableLabel}</h2>

          <ValidatedInputTable
            tableConfig={config.table}
            rows={studentRows}
            setRows={setStudentRows}
            validationResults={validationResults}
            totalRow={totalRow}
          />

          <div className="mt-4 flex gap-4">
            <button
              onClick={handleValidation}
              className="px-4 py-2 bg-blue-400 text-white rounded"
            >
              ✅ Validate
            </button>
          </div>

          {!!config.summaryKeys?.length && (
            <div className="mt-6">
              <h2 className="font-bold text-lg">{config.summaryTitle}</h2>
              <StatSummaryFormEnhanced
                expectedStats={expectedSummary}
                statMeasure={config.statMeasure}
                summaryKeys={config.summaryKeys}
                studentSummary={studentSummary}
                setStudentSummary={setStudentSummary}
              />
            </div>
          )}

          <StudentAnalysisBox
            studentNote={studentNote}
            setStudentNote={setStudentNote}
            prompt={config.analysisPrompt}
          />

          <div className="mt-6 flex gap-4">
            <button
              onClick={() => handleSubmit(false)}
              className="px-4 py-2 bg-blue-300 text-white rounded"
              disabled={isSubmitting}
            >
              {isSubmitting ? "⏳ Saving…" : "💾 Save Draft"}
            </button>
            <button
              onClick={() => handleSubmit(true)}
              className="px-4 py-2 bg-blue-400 text-white rounded"
              disabled={isSubmitting}
            >
              {isSubmitting ? "⏳ Submitting…" : "✅ Submit Final"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
