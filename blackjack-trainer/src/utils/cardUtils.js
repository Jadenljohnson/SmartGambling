export function getCardImageFileName(str_rank, str_suit = null) {
  const randomInt = Math.floor(Math.random()*4) + 1;
  const suitMap = {
    1: "clubs",
    2: "diamonds",
    3: "spades",
    4: "hearts",
  };
  const rankMap = {
    J: "jack",
    Q: "queen",
    K: "king",
    A: "ace",
  };
  const str_convertedRank = rankMap[str_rank] || str_rank;
  str_suit = suitMap[randomInt];
  return `${str_convertedRank}_of_${str_suit}.png`;
}
