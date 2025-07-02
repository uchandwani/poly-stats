import React, { useEffect, useMemo } from "react";

export default function ValidatedInputTable({
  tableConfig,       // your config.table
  rows,              // studentRows
  setRows,           // setter
  validationResults = [],
  totalRow,          // optional Σ footer
}) {
  // ✅ Soft row colors (cyclic palette)
  const colorPalette = [
    "#f9f9f9", "#e0f2f1", "#e1f5fe", "#f3e5f5", "#fff9c4",
    "#ffe0b2", "#c8e6c9", "#dcedc8", "#f8bbd0", "#d1c4e9"
  ];

  // 🌈 Map each CI to a unique color
  const colorMap = useMemo(() => {
    return rows.reduce((map, row, i) => {
      const ci = row.ci || `row-${i}`;
      if (!map[ci]) {
        map[ci] = colorPalette[i % colorPalette.length];
      }
      return map;
    }, {});
  }, [rows]);

  useEffect(() => {
    console.log("🔍 [ValidatedInputTable] validationResults:", validationResults);
  }, [validationResults]);

  if (!tableConfig?.columns?.length) return null;
  const { columns } = tableConfig;

  const editableKeys = new Set(["fi", "fixi", "absDiff", "fiAbsDiff"]);

  const handleChange = (rowIdx, key, value) => {
    const copy = [...rows];
    copy[rowIdx] = { ...copy[rowIdx], [key]: value };
    setRows(copy);
  };

  return (
    <div className="overflow-x-auto">
      <table className="table-fixed w-auto border text-sm">
        <colgroup>
          {columns.map((_, i) => (
            <col key={i} className="w-[150px]" />
          ))}
        </colgroup>

        <thead className="bg-blue-100">
          <tr>
            {columns.map(col => (
              <th
                key={col.key}
                scope="col"
                className="px-1 py-1 text-left font-semibold text-xs"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.map((row, rowIdx) => {
            const rowColor = colorMap[row.ci] || "white";

            return (
              <tr
                key={rowIdx}
                className="hover:bg-gray-50"
                style={{ backgroundColor: rowColor }}
              >
                {columns.map(col => {
                  const status =
                    validationResults.length > 0 && validationResults[rowIdx]
                      ? validationResults[rowIdx][`${col.key}Correct`]
                      : undefined;

                  const cellBg =
                    status === true
                      ? "bg-green-100"
                      : status === false
                      ? "bg-red-100"
                      : "bg-transparent";

                  return (
                    <td
                      key={col.key}
                      className={`border px-1 py-1 text-center ${cellBg}`}
                    >
                      {editableKeys.has(col.key) ? (
                        <input
                          type="number"
                          value={row[col.key] ?? ""}
                          onChange={e =>
                            handleChange(rowIdx, col.key, e.target.value)
                          }
                          className="w-[6ch] bg-transparent outline-none text-center text-sm py-0.5"
                        />
                      ) : (
                        row[col.key]
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>

        {totalRow && (
          <tfoot>
            <tr className="font-semibold bg-gray-100">
              {columns.map(col => (
                <td
                  key={col.key}
                  className="border px-1 py-1 text-center text-sm"
                >
                  {totalRow[col.key] ?? ""}
                </td>
              ))}
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
}
