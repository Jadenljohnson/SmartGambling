import React, {useState} from "react";
import { getOptimalMove } from "../utils/BlackjackStrat";
const arr_cardOptions = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
const arr_moves = ["Hit", "Stand", "Double", "Split"];
function getRandomCard() {
  const index = Math.floor(Math.random() * arr_cardOptions.length);
  return arr_cardOptions[index];
}
function getRandomHand() {
  return [getRandomCard(), getRandomCard()];
}
export default function GuessPage() {
  const [arr_playerHand, setArr_playerHand] = useState(getRandomHand());
  const [str_dealerCard, setStr_dealerCard] = useState(getRandomCard());
  const [str_guess, setStr_guess] = useState("");
  const [str_feedback, setStr_feedback] = useState("");
  const [str_correctMove, setStr_correctMove] = useState("");

  const handleGuessSubmit = () => {
    const str_correct = getOptimalMove({ arr_playerHand, str_dealerCard });
    setStr_correctMove(str_correct);

    if (str_correct.includes(str_guess)) {
      setStr_feedback("Correct!");
    } else {
      setStr_feedback("Incorrect.");
    }
  };

  const handleNewHand = () => {
    setArr_playerHand(getRandomHand());
    setStr_dealerCard(getRandomCard());
    setStr_guess("");
    setStr_feedback("");
    setStr_correctMove("");
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Guess the Optimal Move</h2>

      <p>Player Hand: {arr_playerHand.join(", ")}</p>
      <p>Dealer Upcard: {str_dealerCard}</p>

      <label>Your Guess:</label>
      <select value={str_guess} onChange={e => setStr_guess(e.target.value)}>
        <option value="">-- Choose --</option>
        {arr_moves.map(move => (
          <option key={move} value={move}>{move}</option>
        ))}
      </select>

      <button style={{ marginLeft: "1rem" }} onClick={handleGuessSubmit} disabled={!str_guess}>
        Submit Guess
      </button>

      {str_feedback && (
        <div style={{ marginTop: "1rem" }}>
          <p>{str_feedback}</p>
          <p>Correct Move: <strong>{str_correctMove}</strong></p>
          <button onClick={handleNewHand}>Try Another</button>
        </div>
      )}
    </div>
  );
}