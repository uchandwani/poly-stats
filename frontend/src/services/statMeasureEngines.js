// --- Core Engines (define first to avoid circular references) ---

const MD_Para = {
  inputType: "parameter",
  summaryKeys: ["mean", "meandeviation"],
  intervalLabel: "Parameter",
  expectedColumns: ["fixi", "absDiff", "fiAbsDiff"],

  summaryStats: (rows) => {
    const totalFi = rows.reduce((a, r) => a + Number(r.fi), 0);
    const mean = rows.reduce((a, r) => a + r.xi * r.fi, 0) / totalFi;
    const md = rows.reduce((a, r) => a + r.fi * Math.abs(r.xi - mean), 0) / totalFi;
    return {
      mean: Number.isFinite(mean) ? mean.toFixed(2) : "-",
      meandeviation: Number.isFinite(md) ? md.toFixed(2) : "-"
    };
  },

  generateInitialRows: (xiList = [], fiList = []) =>
    xiList.map((xi, i) => ({
      xi,
      fi: fiList[i] ?? "",
      fixi: "",
      absDiff: "",
      fiAbsDiff: ""
    })),

  generateExpectedRows: (xiList = [], fiList = []) => {
    const totalFi = fiList.reduce((sum, f) => sum + f, 0);
    const mean = xiList.reduce((sum, xi, i) => sum + xi * fiList[i], 0) / totalFi;
    return xiList.map((xi, i) => {
      const fi = fiList[i];
      const absDiff = Math.abs(xi - mean);
      return {
        xi,
        fi,
        fixi: fi * xi,
        absDiff,
        fiAbsDiff: fi * absDiff
      };
    });
  },

  generateTotalRow: (rows, columns) => {
    const sumColumn = (rows, key) => rows.reduce((sum, r) => sum + Number(r[key] || 0), 0);
    const totalRow = {};
    columns.forEach((col) => {
      if (["fixi", "fiAbsDiff", "fi"].includes(col.key)) {
        totalRow[col.key] = sumColumn(rows, col.key).toFixed(2);
      } else {
        totalRow[col.key] = col.key === "xi" ? "Σ" : "";
      }
    });
    return totalRow;
  },

  tableConfig: {
    columns: [
      { key: "xi", label: "xᵢ (Value)", editable: false },
      { key: "fi", label: "fᵢ (Frequency)", editable: true },
      { key: "fixi", label: "fᵢ·xᵢ", editable: true },
      { key: "absDiff", label: "|xᵢ − x̄|", editable: true },
      { key: "fiAbsDiff", label: "fᵢ·|xᵢ − x̄|", editable: true }
    ],
    expectedColumns: ["fixi", "absDiff", "fiAbsDiff"],
    enableValidation: true
  }
};

const MeanDeviation = {
  inputType: "grouped",
  summaryKeys: ["mean", "meandeviation"],

  summaryStats: (rows) => {
    const totalFi = rows.reduce((a, r) => a + Number(r.fi), 0);
    const mean = rows.reduce((a, r) => a + r.xi * r.fi, 0) / totalFi;
    const md = rows.reduce((a, r) => a + r.fi * Math.abs(r.xi - mean), 0) / totalFi;
    return {
      mean: Number.isFinite(mean) ? mean.toFixed(2) : "-",
      meandeviation: Number.isFinite(md) ? md.toFixed(2) : "-"
    };
  },

  generateInitialRows: (classIntervals = [], frequencies = []) =>
    classIntervals.map((ci, i) => {
      const [a, b] = ci.split("-").map(Number);
      const xi = ((a + b) / 2).toFixed(1);
      return {
        ci,
        fi: frequencies[i] ?? "",
        xi,
        fixi: "",
        absDiff: "",
        fiAbsDiff: ""
      };
    }),

  generateExpectedRows: (classIntervals = [], frequencies = []) => {
    const mids = classIntervals.map((ci) => {
      const [a, b] = ci.split("-").map(Number);
      return (a + b) / 2;
    });
    const totalFi = frequencies.reduce((sum, f) => sum + f, 0);
    const mean = mids.reduce((sum, m, i) => sum + m * frequencies[i], 0) / totalFi;

    return classIntervals.map((ci, i) => {
      const xi = mids[i];
      const fi = frequencies[i];
      return {
        ci,
        fi,
        xi,
        fixi: fi * xi,
        absDiff: Math.abs(xi - mean),
        fiAbsDiff: fi * Math.abs(xi - mean)
      };
    });
  },

  generateTotalRow: (rows, columns) => {
    const sumColumn = (rows, key) => rows.reduce((sum, r) => sum + Number(r[key] || 0), 0);
    const totalRow = {};
    columns.forEach((col) => {
      if (col.key === "ci") totalRow[col.key] = "Σ";
      else if (["fi", "fixi", "fiAbsDiff"].includes(col.key)) {
        totalRow[col.key] = sumColumn(rows, col.key).toFixed(2);
      } else {
        totalRow[col.key] = "";
      }
    });
    return totalRow;
  },

  tableConfig: {
    columns: [
      { key: "ci", label: "Class Interval", editable: false },
      { key: "fi", label: "Frequency (fᵢ)", editable: true },
      { key: "xi", label: "Midpoint (xᵢ)", editable: false },
      { key: "fixi", label: "fᵢ·xᵢ", editable: true },
      { key: "absDiff", label: "|xᵢ − x̄|", editable: true },
      { key: "fiAbsDiff", label: "fᵢ·|xᵢ − x̄|", editable: true }
    ],
    expectedColumns: ["fixi", "absDiff", "fiAbsDiff"],
    enableValidation: true
  }
};

const SD_Para = {
  inputType: "parameter",
  summaryKeys: ["mean", "variance", "standarddeviation", "cv"],
  expectedColumns: ["fixi", "squaredDiff", "fiSquaredDiff"],

  summaryStats: (rows) => {
    const totalFi = rows.reduce((a, r) => a + Number(r.fi), 0);
    const mean = rows.reduce((a, r) => a + r.xi * r.fi, 0) / totalFi;
    const variance = rows.reduce((a, r) => a + r.fi * Math.pow(r.xi - mean, 2), 0) / totalFi;
    const sd = Math.sqrt(variance);
    const cv = (sd / mean) * 100;
    return {
      mean: Number.isFinite(mean) ? mean.toFixed(2) : "-",
      variance: Number.isFinite(variance) ? variance.toFixed(2) : "-",
      standarddeviation: Number.isFinite(sd) ? sd.toFixed(2) : "-",
      cv: Number.isFinite(cv) ? cv.toFixed(2) : "-"
    };
  },

  generateInitialRows: (xiList = [], fiList = []) =>
    xiList.map((xi, i) => ({
      xi,
      fi: fiList[i] ?? "",
      fixi: "",
      squaredDiff: "",
      fiSquaredDiff: ""
    })),

  generateExpectedRows: (xiList = [], fiList = []) => {
    const totalFi = fiList.reduce((sum, f) => sum + f, 0);
    const mean = xiList.reduce((sum, xi, i) => sum + xi * fiList[i], 0) / totalFi;
    return xiList.map((xi, i) => {
      const fi = fiList[i];
      const squaredDiff = Math.pow(xi - mean, 2);
      return {
        xi,
        fi,
        fixi: fi * xi,
        squaredDiff,
        fiSquaredDiff: fi * squaredDiff
      };
    });
  },

  generateTotalRow: (rows, columns) => {
    const sumColumn = (rows, key) => rows.reduce((sum, r) => sum + Number(r[key] || 0), 0);
    const totalRow = {};
    columns.forEach((col) => {
      if (["fi", "fixi", "fiSquaredDiff"].includes(col.key)) {
        totalRow[col.key] = sumColumn(rows, col.key).toFixed(2);
      } else if (col.key === "xi") {
        totalRow[col.key] = "Σ";
      } else {
        totalRow[col.key] = "";
      }
    });
    return totalRow;
  },

  tableConfig: {
    columns: [
      { key: "xi", label: "xᵢ (Value)", editable: false },
      { key: "fi", label: "fᵢ (Frequency)", editable: true },
      { key: "fixi", label: "fᵢ·xᵢ", editable: true },
      { key: "squaredDiff", label: "(xᵢ − x̄)²", editable: true },
      { key: "fiSquaredDiff", label: "fᵢ·(xᵢ − x̄)²", editable: true }
    ],
    expectedColumns: ["fixi", "squaredDiff", "fiSquaredDiff"],
    enableValidation: true
  }
};

const StandardDeviation = {
  inputType: "grouped",
  summaryKeys: ["mean", "variance", "standarddeviation", "cv"],

  summaryStats: (rows) => {
    const totalFi = rows.reduce((a, r) => a + Number(r.fi), 0);
    const mean = rows.reduce((a, r) => a + r.xi * r.fi, 0) / totalFi;
    const variance = rows.reduce((a, r) => a + r.fi * Math.pow(r.xi - mean, 2), 0) / totalFi;
    const sd = Math.sqrt(variance);
    const cv = (sd / mean) * 100;
    return {
      mean: Number.isFinite(mean) ? mean.toFixed(2) : "-",
      variance: Number.isFinite(variance) ? variance.toFixed(2) : "-",
      standarddeviation: Number.isFinite(sd) ? sd.toFixed(2) : "-",
      cv: Number.isFinite(cv) ? cv.toFixed(2) : "-"
    };
  },

  generateInitialRows: (classIntervals = [], frequencies = []) =>
    classIntervals.map((ci, i) => {
      const [a, b] = ci.split("-").map(Number);
      const xi = ((a + b) / 2).toFixed(1);
      return {
        ci,
        fi: frequencies[i] ?? "",
        xi,
        fixi: "",
        squaredDiff: "",
        fiSquaredDiff: ""
      };
    }),

  generateExpectedRows: (classIntervals = [], frequencies = []) => {
    const mids = classIntervals.map((ci) => {
      const [a, b] = ci.split("-").map(Number);
      return (a + b) / 2;
    });
    const totalFi = frequencies.reduce((sum, f) => sum + f, 0);
    const mean = mids.reduce((sum, m, i) => sum + m * frequencies[i], 0) / totalFi;

    return classIntervals.map((ci, i) => {
      const xi = mids[i];
      const fi = frequencies[i];
      const squaredDiff = Math.pow(xi - mean, 2);
      return {
        ci,
        fi,
        xi,
        fixi: fi * xi,
        squaredDiff,
        fiSquaredDiff: fi * squaredDiff
      };
    });
  },

  generateTotalRow: (rows, columns) => {
    const sumColumn = (rows, key) => rows.reduce((sum, r) => sum + Number(r[key] || 0), 0);
    const totalRow = {};
    columns.forEach((col) => {
      if (col.key === "ci") totalRow[col.key] = "Σ";
      else if (["fi", "fixi", "fiSquaredDiff"].includes(col.key)) {
        totalRow[col.key] = sumColumn(rows, col.key).toFixed(2);
      } else {
        totalRow[col.key] = "";
      }
    });
    return totalRow;
  },

  tableConfig: {
    columns: [
      { key: "ci", label: "Class Interval", editable: false },
      { key: "fi", label: "Frequency (fᵢ)", editable: true },
      { key: "xi", label: "Midpoint (xᵢ)", editable: false },
      { key: "fixi", label: "fᵢ·xᵢ", editable: true },
      { key: "squaredDiff", label: "(xᵢ − x̄)²", editable: true },
      { key: "fiSquaredDiff", label: "fᵢ·(xᵢ − x̄)²", editable: true }
    ],
    expectedColumns: ["fixi", "squaredDiff", "fiSquaredDiff"],
    enableValidation: true
  }
};

const Range = {
  inputType: "grouped", // or "parameter"
  summaryKeys: ["range", "coefficientOfRange"],
  summaryTitle: "Summary Statistics",
  enableValidation: true
};


// --- Final Export ---

export const statEngines = {
  MD_Para,
  SD_Para,
  MeanDeviation,
  StandardDeviation,
  Range,

  // Auto-generated variants
  MD_Gen_Para: {
    ...MD_Para,
    inputType: "parameter"
  },
  SD_Gen_Para: {
    ...SD_Para,
    inputType: "parameter"
  },
  MD_Gen_Class: {
    ...MeanDeviation,
    inputType: "grouped"
  },
  SD_Gen_Class: {
    ...StandardDeviation,
    inputType: "grouped"
  }
};
