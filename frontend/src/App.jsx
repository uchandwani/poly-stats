import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Header from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";
import MasterExerciseUI from "./pages/MasterExerciseUI";
import MeanDeviationConfig from "./components/MeanDeviationConfig";
import MeanDeviationComparison from "./components/MeanDeviationComparison";
import StatMeasures from "./pages/StatMeasures"; // ✅
import StatMeasuresComp from "./pages/StatMeasuresCompare";
import ExerciseRouter from "./pages/ExerciseRouter";


function App() {
  return (
    <div className="max-w-screen-lg mx-auto">
      <Header />
      <Routes>
        {/* Public Login Route */}
        <Route path="/" element={<LoginPage />} />

        {/* Redirect plain /exercise to first default code */}
        <Route path="/exercise" element={<Navigate to="/exercise/Range_01" />} />
        <Route
          path="/exercise/Mean_05"
          element={<MeanDeviationComparison />}
        />
      
        {/* Protected Route for exercises */}
       <Route
          path="/exercise/:code"
          element={
            <ProtectedRoute>
              <ExerciseRouter />
            </ProtectedRoute>
            }
        />

 
        {/* Optional: Catch-all fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;




{/* function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}  */}


