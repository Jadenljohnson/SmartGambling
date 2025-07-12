
import { hardStrategy_noncount } from "./BlackjackstratTable.js";
import { softStrategy_noncount } from "./BlackjackstratTable.js";
import { pairStrategy_noncount } from "./BlackjackstratTable.js";
import { hardDeviations } from "./BlackjackstratTable.js";
import { softDeviations } from "./BlackjackstratTable.js";
import { pairDeviations } from "./BlackjackstratTable.js";
import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
function normalize(card) {
  if (["J", "Q", "K"].includes(card)) return "10";
  return card;
}

function calculateHandValue(hand) {
  let total = 0;
  let aces = 0;
  for (let card of hand) {
    card = normalize(card);
    if (card === "A") {
      aces++;
      total += 11;
    } else {
      total += parseInt(card);
    }
  }
  while (total > 21 && aces > 0) {
    total -= 10;
    aces--;
  }
  return total;
}

function isPair(hand) {
  return hand.length === 2 && normalize(hand[0]) === normalize(hand[1]);
}

function isSoft(hand) {
  return hand.includes("A") && calculateHandValue(hand) <= 21;
}

function findDeviation(handType, playerKey, dealerCard, trueCount) {
  const deviationSets = {
    hard: hardDeviations,
    soft: softDeviations,
    pair: pairDeviations,
  };
  const deviations = deviationSets[handType] || [];
  for (const dev of deviations) {
    if (dev.player === playerKey && dev.dealer === dealerCard) {
      const condition = dev.condition.replace(/TC/g, trueCount);
      if (eval(condition)) return dev.action;
    }
  }
  return null;
}

export function getOptimalMove({
  playerHand,
  dealerCard,
  canSplit = true,
  canDouble = true,
  trueCount = null,
}) {
  dealerCard = normalize(dealerCard);
  const total = calculateHandValue(playerHand);

  // Pair logic
  if (isPair(playerHand)) {
    const pairValue = normalize(playerHand[0]) + normalize(playerHand[1]);
    if (trueCount !== null) {
      const deviation = findDeviation("pair", pairValue, dealerCard, trueCount);
      if (deviation) return deviation;
    }
    return pairStrategy_noncount[normalize(playerHand[0])]?.[dealerCard] || "Hit";
  }

  // Soft total logic
  if (isSoft(playerHand) && total >= 13 && total <= 20) {
    if (trueCount !== null) {
      const playerKey = normalize(playerHand.includes("A") ? playerHand[0] === "A" ? playerHand[0] + normalize(playerHand[1]) : normalize(playerHand[0]) + "A" : "");
      const deviation = findDeviation("soft", playerKey, dealerCard, trueCount);
      if (deviation) return deviation;
    }
    return softStrategy_noncount[total]?.[dealerCard] || "Hit";
  }

  // Hard total logic
  if (trueCount !== null) {
    const deviation = findDeviation("hard", total.toString(), dealerCard, trueCount);
    if (deviation) return deviation;
  }
  return hardStrategy_noncount[total]?.[dealerCard] || "Hit";
}

const rl = readline.createInterface({ input, output });

console.log("🃏 Blackjack Strategy Tester");

try {
  const handStr = await rl.question("Enter your hand (space-separated): ");
  const dealer = await rl.question("Enter dealer upcard: ");
  const tcStr = await rl.question("Enter true count (or blank): ");

  const hand = handStr.trim().split(" ");
  const dealerCard = dealer.trim().toUpperCase();
  const trueCount = tcStr.trim() === "" ? null : parseInt(tcStr.trim());

  const result = getOptimalMove({
    playerHand: hand,
    dealerCard,
    trueCount,
  });

  console.log(`\n✅ Optimal Move: ${result}`);
} catch (err) {
  console.error("❌ Error:", err);
} finally {
  rl.close();
}