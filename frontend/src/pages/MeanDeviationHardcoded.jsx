import React from "react";

export default function MeanDeviationHardcoded() {
  const tableData = [
    { range: "10-20", fi: 5 },
    { range: "20-30", fi: 8 },
    { range: "30-40", fi: 7 }
  ];

  // Step 1: Compute midpoints and add to rows
  const enrichedData = tableData.map((row) => {
    const [min, max] = row.range.split("-").map(Number);
    const midpoint = (min + max) / 2;
    return { ...row, midpoint };
  });

  // Step 2: Calculate mean
  const totalFreq = enrichedData.reduce((sum, row) => sum + row.fi, 0);
  const mean =
    enrichedData.reduce((sum, row) => sum + row.fi * row.midpoint, 0) /
    totalFreq;

  // Step 3: Compute deviation and fi * |di|
  const finalData = enrichedData.map((row) => {
    const deviation = Math.abs(row.midpoint - mean);
    const fiDi = row.fi * deviation;
    return { ...row, deviation: deviation.toFixed(2), fiDi: fiDi.toFixed(2) };
  });

  const totalFiDi = finalData.reduce((sum, row) => sum + parseFloat(row.fiDi), 0);
  const meanDeviation = (totalFiDi / totalFreq).toFixed(2);

  return (
    <div className="max-w-2xl mx-auto text-sm">
      <h2 className="text-lg font-bold mb-4 text-blue-700">📊 Mean Deviation (Hardcoded)</h2>

      {/* Frequency Table */}
      <table className="table-auto border border-collapse w-full mb-6 text-center">
        <thead className="bg-blue-100">
          <tr>
            <th className="border px-2 py-1">Class Interval</th>
            <th className="border px-2 py-1">fᵢ</th>
            <th className="border px-2 py-1">Midpoint (xᵢ)</th>
            <th className="border px-2 py-1">|xᵢ - Mean|</th>
            <th className="border px-2 py-1">fᵢ × |xᵢ - Mean|</th>
          </tr>
        </thead>
        <tbody>
          {finalData.map((row, idx) => (
            <tr key={idx}>
              <td className="border px-2 py-1">{row.range}</td>
              <td className="border px-2 py-1">{row.fi}</td>
              <td className="border px-2 py-1">{row.midpoint}</td>
              <td className="border px-2 py-1">{row.deviation}</td>
              <td className="border px-2 py-1">{row.fiDi}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Summary */}
      <div className="bg-green-50 p-4 rounded shadow text-green-700 font-medium">
        <p>Total Frequency (∑fᵢ): {totalFreq}</p>
        <p>Mean: {mean.toFixed(2)}</p>
        <p>Total fᵢ × |xᵢ - Mean| (∑fᵢ|dᵢ|): {totalFiDi.toFixed(2)}</p>
        <p className="text-lg mt-2">
          👉 Mean Deviation = ∑fᵢ|xᵢ - Mean| / ∑fᵢ ={" "}
          <strong className="text-blue-700">{meanDeviation}</strong>
        </p>
      </div>
    </div>
  );
}
