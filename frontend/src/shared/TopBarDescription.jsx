// src/components/TopBarDescription.jsx
import React from "react";

export default function TopBarDescription({ text }) {
  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 p-3 mb-4 rounded">
      <p className="text-sm">{text}</p>
    </div>
  );
}
