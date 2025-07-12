import { getOptimalMove } from "./BlackjackStrat.js";

const arr_deck = [
  "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"
];

function drawCard() {
  return arr_deck[Math.floor(Math.random() * arr_deck.length)];
}

function calculateValue(arr_hand) {
  let int_total = 0;
  let int_aces = 0;
  for (let str_card of arr_hand) {
    if (["J", "Q", "K"].includes(str_card)) int_total += 10;
    else if (str_card === "A") {
      int_aces++;
      int_total += 11;
    } else {
      int_total += parseInt(str_card);
    }
  }
  while (int_total > 21 && int_aces > 0) {
    int_total -= 10;
    int_aces--;
  }
  return int_total;
}

function simulateDealer(arr_dealerHand) {
  while (calculateValue(arr_dealerHand) < 17) {
    arr_dealerHand.push(drawCard());
  }
  return arr_dealerHand;
}

function simulatePlayer(arr_playerHand, str_dealerCard) {
  while (true) {
    const str_move = getOptimalMove({ arr_playerHand, str_dealerCard });
    if (str_move.includes("Stand")) break;
    if (str_move.includes("Hit")) {
      arr_playerHand.push(drawCard());
      if (calculateValue(arr_playerHand) > 21) break;
    } else {
      break; // Ignoring doubles/splits for simplicity
    }
  }
  return arr_playerHand;
}

export async function runMonteCarlo(arr_startingHand, str_dealerUpcard, int_sims = 10000) {
  let int_win = 0, int_push = 0, int_loss = 0;

  for (let int_i = 0; int_i < int_sims; int_i++) {
    let arr_player = [...arr_startingHand];
    let arr_dealer = [str_dealerUpcard, drawCard()];

    arr_player = simulatePlayer([...arr_player], arr_dealer[0]);
    const int_playerTotal = calculateValue(arr_player);

    if (int_playerTotal > 21) {
      int_loss++;
      continue;
    }

    arr_dealer = simulateDealer(arr_dealer);
    const int_dealerTotal = calculateValue(arr_dealer);

    if (int_dealerTotal > 21 || int_playerTotal > int_dealerTotal) int_win++;
    else if (int_dealerTotal === int_playerTotal) int_push++;
    else int_loss++;
  }

  const obj_results = {
    win: ((int_win / int_sims) * 100).toFixed(2),
    push: ((int_push / int_sims) * 100).toFixed(2),
    loss: ((int_loss / int_sims) * 100).toFixed(2),
  };

  console.log(`\n🔁 Simulated ${int_sims} hands of Blackjack`);
  console.log(`✅ Win: ${obj_results.win}%`);
  console.log(`🤝 Push: ${obj_results.push}%`);
  console.log(`❌ Loss: ${obj_results.loss}%`);

  return obj_results;
}

// Example run
runMonteCarlo(["A", "8"], "2", 10000);
