import React, { useMemo } from "react";

// Soft pastel colors (cyclic)
const colorPalette = [
  "#f9f9f9", "#e0f2f1", "#e1f5fe", "#f3e5f5", "#fff9c4",
  "#ffe0b2", "#c8e6c9", "#dcedc8", "#f8bbd0", "#d1c4e9"
];

export default function ProblemHeader({ config, useColor = true }) {
  console.log("The config entry passed is", config);

  if (!config) {
    console.warn("🚫 ProblemHeader: config is undefined.");
    return null;
  }

  const {
    title = "Untitled Problem",
    description = "",
    intervals = [],
    freqs = [],
  } = config;

  const hasData = intervals.length && freqs.length;

  if (!hasData) {
    console.warn("⚠️ No data to display in ProblemHeader table.");
    return null;
  }

  // 🟦 Color mapping logic
  const colorMap = useMemo(() => {
    return intervals.reduce((map, interval, i) => {
      map[interval] = colorPalette[i % colorPalette.length];
      return map;
    }, {});
  }, [intervals]);

  const colorClass = useColor ? "text-blue-700" : "text-black";

  return (
    <div className="mb-6 w-full overflow-x-auto">
      <h3 className={`text-center font-semibold text-lg mb-2 ${colorClass}`}>
        {title}
      </h3>

      {description && (
        <p className="text-center text-sm text-gray-600 mb-2">{description}</p>
      )}

      <table className="text-sm border border-collapse border-gray-300 w-full text-center">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-3 py-2 font-semibold">C.I →</th>
            {intervals.map((ci, i) => (
              <th
                key={`interval-${i}`}
                className="border px-3 py-2"
                style={{
                  backgroundColor: useColor ? colorMap[ci] : undefined,
                }}
              >
                {ci}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border px-3 py-2 font-semibold">
              f<sub>i</sub>
            </td>
            {freqs.map((f, i) => (
              <td
                key={`freq-${i}`}
                className="border px-3 py-2"
                style={{
                  backgroundColor: useColor ? colorMap[intervals[i]] : undefined,
                }}
              >
                {f}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
