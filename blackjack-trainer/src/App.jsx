import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import TrainerPage from "./pages/TrainerPage";
import GuessPage from "./pages/GuessPage";

export default function App() {
  return (
    <div style={{ padding: "2rem" }}>
      <nav style={{ marginBottom: "2rem" }}>
        <Link to="/" style={{ marginRight: "1rem" }}>Trainer</Link>
        <Link to="/guess">Guess the Move</Link>
      </nav>

      <Routes>
        <Route path="/" element={<TrainerPage />} />
        <Route path="/guess" element={<GuessPage />} />
      </Routes>
    </div>
  );
}
