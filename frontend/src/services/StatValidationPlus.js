// services/StatValidationPlus.js

export function validateStatTable({ inputs, expected, columns, measure = "MeanDeviation" }) {
  if (!Array.isArray(inputs) || !Array.isArray(expected)) return [];

  return inputs.map((input, idx) => {
    const expectedRow = expected[idx] || {};
    const result = {};

    for (const col of columns) {
      const key = col.key;
      const studentVal = input[key];
      const expectedVal = expectedRow[key];

      // 🔒 Skip non-editable columns (e.g., "ci", "xi", etc.)
      if (!col.editable) continue;

      // ❌ Skip empty or missing values gracefully
      if (
        studentVal === "" ||
        studentVal === undefined ||
        expectedVal === "" ||
        expectedVal === undefined ||
        expectedVal === null
      ) {
        result[`${key}Correct`] = null;
        continue;
      }

      const roundedStudent = Number(parseFloat(studentVal).toFixed(2));
      const roundedExpected = Number(parseFloat(expectedVal).toFixed(2));

      result[`${key}Correct`] = roundedStudent === roundedExpected;
    }

    return result;
  });
}


export function validateSummaryStats({ inputs, expected }) {
  const result = {};
  for (const key in expected) {
    const studentVal = inputs[key];
    const expectedVal = expected[key];

    if (
      studentVal === "" ||
      studentVal === undefined ||
      expectedVal === "" ||
      expectedVal === undefined
    ) {
      result[`${key}Correct`] = null;
      continue;
    }

    const roundedStudent = +parseFloat(studentVal).toFixed(2);
    const roundedExpected = +parseFloat(expectedVal).toFixed(2);
    result[`${key}Correct`] = roundedStudent === roundedExpected;
  }

  return result;
}
