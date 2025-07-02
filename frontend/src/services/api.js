// src/services/api.js
import { BASE } from "../config";
import { API_BASE } from "../services/apiBase";


export async function fetchExercise(id) {
  try {
    const res = await fetch(`${BASE}/exercises/${id}`);
    if (!res.ok) throw new Error(`Status ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error(`❌ Failed to fetch exercise for code=${id}:`, err.message);
    return null;
  }
}

export async function fetchResponse(exId, userId) {
  try {
    const res = await fetch(`${BASE}/responses/${exId}?userId=${userId}`);
    if (!res.ok) throw new Error(`Status ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error(`❌ Failed to fetch response for code=${exId}, user=${userId}:`, err.message);
    return null;
  }
}

export async function submitResponse(exId, userId, answer) {
  try {
    const res = await fetch(`${BASE}/responses`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ exerciseId: exId, userId, answer }),
    });
    if (!res.ok) throw new Error(`Status ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error(`❌ Failed to submit response for code=${exId}, user=${userId}:`, err.message);
    return null;
  }
}

export async function fetchSubmission(exId, userId) {
  console.log(`📤 Calling fetchSubmission with exId="${exId}" and userId="${userId}"`);
  const url = `${BASE}/submissions/by-student?code=${exId}&student=${userId}`;
  console.log(`🌐 Fetching: ${url}`);

  try {
    const res = await fetch(url);
    console.log(`📥 Response status: ${res.status}`);

    if (res.status === 404) {
      console.warn("📭 No saved submission found — returning null");
      return null;
    }

    if (!res.ok) {
      console.error(`❌ Server error: ${res.statusText}`);
      throw new Error(`Status ${res.status}`);
    }

    const data = await res.json();
    console.log("✅ Submission data received:", data);
    return data;
  } catch (err) {
    console.error(`❌ Failed to fetch submission for code="${exId}", user="${userId}":`, err.message);
    return null;
  }
}

export async function saveSubmission(exId, userId, analysisText) {
  try {
    const res = await fetch(`${BASE}/submissions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        exerciseCode: exId,
        studentId: userId,
        analysisText,
        isFinal: false,
      }),
    });
    if (!res.ok) throw new Error(`Status ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error(`❌ Failed to save draft for code=${exId}, user=${userId}:`, err.message);
    return null;
  }
}

export async function submitSubmission(exId, userId, analysisText) {
  try {
    const res = await fetch(`${BASE}/submissions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        exerciseCode: exId,
        studentId: userId,
        analysisText,
        isFinal: true,
      }),
    });
    if (!res.ok) throw new Error(`Status ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error(`❌ Failed to submit final for code=${exId}, user=${userId}:`, err.message);
    return null;
  }
}
