// services/statSummaryEnginePlus.js

export function calculateSummaryStats(rows, statMeasure = "MeanDeviation") {
  if (!Array.isArray(rows) || rows.length === 0) return {};

  let sumFi = 0, sumFixi = 0;

  rows.forEach(row => {
    sumFi += +row.fi;
    sumFixi += +row.fixi;
  });

  const mean = Math.round((sumFixi / sumFi) * 100) / 100;

  // ✅ Standard Deviation Path
  if (statMeasure === "StandardDeviation") {
    let sumFiSquaredDiff = 0;
    rows.forEach(row => {
      sumFiSquaredDiff += +row.fiSquaredDiff || 0;
    });

    const variance = Math.round((sumFiSquaredDiff / sumFi) * 100) / 100;
    const sd = Math.round(Math.sqrt(variance) * 100) / 100;
    const cv = Math.round((sd / mean) * 10000) / 100;

    return {
      mean,
      variance,
      standarddeviation: sd,
      cv
    };
  }

  // ✅ Mean Deviation Path (default)
  let sumFiAbsDiff = 0;
  rows.forEach(row => {
    sumFiAbsDiff += +row.fiAbsDiff || 0;
  });

  const meanDev = Math.round((sumFiAbsDiff / sumFi) * 100) / 100;

  return {
    mean,
    meandeviation: meanDev
  };
}
