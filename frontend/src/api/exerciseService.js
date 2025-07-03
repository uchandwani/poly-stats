// src/api/exerciseService.js
const BASE_URL = "https://poly-stats.onrender.com"; 

export async function fetchGroupedExercises() {
  try {
    
    const res = await fetch(`${BASE_URL}/api/exercises/grouped`)
    if (!res.ok) throw new Error("Failed to fetch grouped exercises");

    const data = await res.json();

    // Ensure fallback to empty arrays
    return {
      range: data.range || [],
      mean: data.mean || [],
      sd: data.sd || [],
      insights: data.overall || data.insights || [], // fallback in case your DB uses 'overall'
    };
  } catch (err) {
    console.error("❌ Error fetching grouped exercises:", err);
    return {
      range: [],
      mean: [],
      sd: [],
      insights: [],
    };
  }
}
