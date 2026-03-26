import { generateId } from "./userId.mjs";

export function getRandomChoice(symbols) {
  const index = Math.floor(Math.random() * symbols.length);
  return symbols[index];
}

export function calculateResult(playerChoice, opponentChoice, rules) {
  if (playerChoice === opponentChoice) return "draw";

  const winsAgainst = rules[playerChoice] || [];

  if (winsAgainst.includes(opponentChoice)) {
    return "win";
  }

  return "loss";
}

export function makeGame({ userId, ruleset, choice }) {
  const opponentChoice = getRandomChoice(ruleset.symbols);

  const result = calculateResult(
    choice,
    opponentChoice,
    ruleset.rules
  );

  return {
    id: generateId("game"),
    userId,
    rulesetId: ruleset.id,
    playerChoice: choice,
    opponentChoice,
    result
  };
}