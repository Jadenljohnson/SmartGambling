import { hardStrategy_noncount } from "./BlackjackstratTable.js";
import { softStrategy_noncount } from "./BlackjackstratTable.js";
import { pairStrategy_noncount } from "./BlackjackstratTable.js";
import { hardDeviations } from "./BlackjackstratTable.js";
import { softDeviations } from "./BlackjackstratTable.js";
import { pairDeviations } from "./BlackjackstratTable.js";

function normalize(str_card) {
  if (["J", "Q", "K"].includes(str_card)) return "10";
  return str_card;
}

function calculateHandValue(arr_hand) {
  let int_total = 0;
  let int_aces = 0;
  for (let str_card of arr_hand) {
    str_card = normalize(str_card);
    if (str_card === "A") {
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

function isPair(arr_hand) {
  return arr_hand.length === 2 && normalize(arr_hand[0]) === normalize(arr_hand[1]);
}

function isSoft(arr_hand) {
  return arr_hand.includes("A") && calculateHandValue(arr_hand) <= 21;
}

function findDeviation(str_handType, str_playerKey, str_dealerCard, int_trueCount) {
  const obj_deviationSets = {
    hard: hardDeviations,
    soft: softDeviations,
    pair: pairDeviations,
  };
  const arr_deviations = obj_deviationSets[str_handType] || [];
  for (const obj_dev of arr_deviations) {
    if (obj_dev.player === str_playerKey && obj_dev.dealer === str_dealerCard) {
      const str_condition = obj_dev.condition.replace(/TC/g, int_trueCount);
      if (eval(str_condition)) return obj_dev.action;
    }
  }
  return null;
}

export function getOptimalMove({
  arr_playerHand,
  str_dealerCard,
  bool_canSplit = true,
  bool_canDouble = true,
  int_trueCount = null,
}) {
  str_dealerCard = normalize(str_dealerCard);
  const int_total = calculateHandValue(arr_playerHand);
  if (int_total == 21) {
    return "Stand"
  }

  // Pair logic
  if (isPair(arr_playerHand)) {
    const str_pairValue = normalize(arr_playerHand[0]) + normalize(arr_playerHand[1]);
    if (int_trueCount !== null) {
      const str_deviation = findDeviation("pair", str_pairValue, str_dealerCard, int_trueCount);
      if (str_deviation) return str_deviation;
    }
    const str_pairResponse = pairStrategy_noncount[normalize(arr_playerHand[0])]?.[str_dealerCard];
    if (str_pairResponse === "NoSplit") {
      // Fallback to hard strategy
      const int_total = calculateHandValue(arr_playerHand);
      if (int_trueCount !== null) {
        const str_dev = findDeviation("hard", int_total.toString(), str_dealerCard, int_trueCount);
        if (str_dev) return str_dev;
      }
      return hardStrategy_noncount[int_total]?.[str_dealerCard] || "Hit";
    }
    return str_pairResponse || "Hit";
  }

  // Soft total logic
  if (isSoft(arr_playerHand) && int_total >= 13 && int_total <= 20) {
    if (int_trueCount !== null) {
      const str_playerKey = normalize(
        arr_playerHand.includes("A")
          ? arr_playerHand[0] === "A"
            ? arr_playerHand[0] + normalize(arr_playerHand[1])
            : normalize(arr_playerHand[0]) + "A"
          : ""
      );
      const str_deviation = findDeviation("soft", str_playerKey, str_dealerCard, int_trueCount);
      if (str_deviation) return str_deviation;
    }
    return softStrategy_noncount[int_total]?.[str_dealerCard] || "Hit";
  }

  // Hard total logic
  if (int_trueCount !== null) {
    const str_deviation = findDeviation("hard", int_total.toString(), str_dealerCard, int_trueCount);
    if (str_deviation) return str_deviation;
  }
  return hardStrategy_noncount[int_total]?.[str_dealerCard] || "Hit";
}

