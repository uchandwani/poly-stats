import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/Header.css";
import { fetchGroupedExercises } from "../api/exerciseService";

// Reverse mapping for menu display labels
const menuTitles = {
  range: "Range",
  mean: "Mean Deviation",
  sd: "Standard Deviation",
  overall: "Insights",
};

// Map from menu title to type keys used in DB and codeMap
const typeKeyMap = {
  "Range": "range",
  "Mean Deviation": "mean",
  "Standard Deviation": "sd",
  "Insights": "overall",
};

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();

  const [activeMenu, setActiveMenu] = useState("Welcome");
  const [codeMap, setCodeMap] = useState({
    range: [],
    mean: [],
    sd: [],
    overall: [],
  });

  // Try loading from localStorage, else fallback to guest
  let user = null;
  try {
    const raw = localStorage.getItem("user");
    user = raw && raw !== "undefined" ? JSON.parse(raw) : null;
  } catch (err) {
    console.warn("⚠️ Failed to parse user from localStorage", err);
    user = null;
  }

  // Inject guest user if not logged in
  if (!user) {
    user = { username: "Guest", role: "guest" };
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", "guest-token");
  }

  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    async function loadExerciseCodes() {
      const grouped = await fetchGroupedExercises();
      setCodeMap({
        range: grouped.range?.map((ex) => ex.code) || [],
        mean: grouped.mean?.map((ex) => ex.code) || [],
        sd: grouped.sd?.map((ex) => ex.code) || [],
        overall: grouped.insights?.map((ex) => ex.code) || [],
      });
    }

    loadExerciseCodes();

    if (location.pathname.includes("Range_")) setActiveMenu("Range");
    else if (location.pathname.includes("Mean_")) setActiveMenu("Mean Deviation");
    else if (location.pathname.includes("SD_")) setActiveMenu("Standard Deviation");
    else if (location.pathname.includes("Insights_")) setActiveMenu("Insights");
    else setActiveMenu("Welcome");
  }, [location]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleExerciseClick = (index) => {
    const typeKey = typeKeyMap[activeMenu];
    const codeList = codeMap[typeKey] || [];
    const code = codeList[index];
    if (code) navigate(`/exercise/${code}`);
  };

  return (
    <header className="header">
      <div className="nav-left">
        <div className="nav-links">
          <Link to={`/exercise/${codeMap.range?.[0] || ""}`}>Range</Link>
          <Link to={`/exercise/${codeMap.mean?.[0] || ""}`}>Mean Deviation</Link>
          <Link to={`/exercise/${codeMap.sd?.[0] || ""}`}>Standard Deviation</Link>
          <Link to={`/exercise/${codeMap.overall?.[0] || ""}`}>Insights</Link>
        </div>
      </div>

      <h1 className="text-lg font-semibold">{activeMenu}</h1>

      <div className="nav-right">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            className="bg-white text-blue-800 font-bold w-6 h-6 text-xs rounded hover:bg-blue-100"
            onClick={() => handleExerciseClick(n - 1)}
          >
            {n}
          </button>
        ))}

        {isLoggedIn ? (
          <>
            <span className="user-role">{user.username} ({user.role})</span>
            {user.role !== "guest" ? (
              <button onClick={handleLogout} className="auth-link">Logout</button>
            ) : null}
          </>
        ) : (
          <Link to="/" className="auth-link">Login</Link>
        )}
      </div>
    </header>
  );
}
