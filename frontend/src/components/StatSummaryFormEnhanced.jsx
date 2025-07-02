import React, { useState } from "react";

/**
 * Stat Summary Form: Editable + Validation with background color feedback
 */
export default function StatSummaryFormEnhanced({
  expectedStats = {},
  summaryKeys = [],
  statMeasure = "MeanDeviation",
  studentSummary = {},
  setStudentSummary = () => {}
}) {
  const [validationResults, setValidationResults] = useState({});

  if (!summaryKeys?.length) return null;

  const handleChange = (key, value) => {
    setStudentSummary((prev) => ({ ...prev, [key]: value }));
    setValidationResults((prev) => ({ ...prev, [key]: undefined })); // reset validation
  };

  const validateSummary = () => {
    const results = {};
    summaryKeys.forEach((key) => {
      const expected = Number(expectedStats[key]);
      const entered = Number(studentSummary[key]);
      const isValid = !isNaN(expected) && !isNaN(entered) && Math.abs(expected - entered) < 0.1;
      results[key] = isValid;
    });
    setValidationResults(results);
  };

  const getBgColor = (key) => {
    const status = validationResults[key];
    if (status === true) return "bg-green-100";
    if (status === false) return "bg-red-100";
    return "";
  };

  return (
    <div className="mt-6">
      <table className="table-auto border text-sm text-left shadow bg-white w-full">
        <thead>
          <tr className="bg-blue-100">
            <th className="px-4 py-2">Statistic</th>
            <th className="px-4 py-2">Your Answer</th>
          </tr>
        </thead>
        <tbody>
          {summaryKeys.map((key) => {
            const value = studentSummary?.[key] ?? "";
            const expected = expectedStats?.[key] ?? "";

            return (
              <tr key={key}>
                <td className="px-4 py-2 font-medium">{key}</td>
                <td className="px-4 py-2">
                  <input
                    type="number"
                    step="0.01"
                    value={value}
                    onChange={(e) => handleChange(key, e.target.value)}
                    placeholder={expected}
                    className={`w-full border px-2 py-1 rounded text-sm ${getBgColor(key)}`}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="mt-4 text-right">
        <button
          className="bg-blue-400 text-white px-4 py-2 rounded hover:bg-purple-700"
          onClick={validateSummary}
        >
          ✅ Validate Summary
        </button>
      </div>
    </div>
  );
}
