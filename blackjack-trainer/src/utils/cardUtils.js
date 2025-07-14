export function getCardImageFileName(str_rank, str_suit = "clubs") {
  const rankMap = {
    J: "jack",
    Q: "queen",
    K: "king",
    A: "ace",
  };
  const str_convertedRank = rankMap[str_rank] || str_rank;
  return `${str_convertedRank}_of_${str_suit}.png`;
}
