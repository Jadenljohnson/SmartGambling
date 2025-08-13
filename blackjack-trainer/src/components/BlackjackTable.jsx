
import React from "react";
import { getCardImageFileName } from "../utils/cardUtils";
function Card({ str_card }) {
  const str_filename = getCardImageFileName(str_card);
  console.log(str_filename)
  return (
    <img
      src={`/cards/${str_filename}`}
      alt={str_card}
      style={{ width: "60px", marginRight: "0.5rem" }}
    />
  );
}

export default function BlackjackTable({ arr_dealerHand, arr_playerHand }) {
  return (
    <div
      style={{
        backgroundImage: `url("/table/table.jpg")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        borderRadius: "1rem",
        padding: "2rem",
        minHeight: "400px",
        color: "white",
        boxShadow: "0 0 20px rgba(0,0,0,0.3)",
      }}
    >
      <h3>Dealer</h3>
      <div style={{ display: "flex", marginBottom: "2rem" }}>
        {arr_dealerHand.map((str_card, i) => (
          <Card key={`dealer-${i}`} str_card={str_card} />
        ))}
      </div>

      <h3>Player</h3>
      <div style={{ display: "flex" }}>
        {arr_playerHand.map((str_card, i) => (
          <Card key={`player-${i}`} str_card={str_card} />
        ))}
      </div>
    </div>
  );
}
