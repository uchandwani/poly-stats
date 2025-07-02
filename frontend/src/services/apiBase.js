// src/utils/apiBase.js

const isLocal = window.location.hostname === "localhost";

export const API_BASE = isLocal
  ? "/api"
  : import.meta.env.VITE_API_BASE_URL || "https://my-app-data.loca.lt/api";

export const AUTH_BASE = isLocal
  ? "/auth" // Vite proxy for local dev (auth)
  : "https://my-auth-service.loca.lt"; // Production (GitHub Pages)
