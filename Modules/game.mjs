import { generateId } from "./id.mjs";

export function getRandomChoice(symbols) {
  const index = Math.floor(Math.random() * symbols.length);
  return symbols[index];
}

export function calculateResult(playerChoice, opponentChoice, ruleset) {
  if (playerChoice === opponentChoice) {
    return "draw";
  }

  const winningAgainst = ruleset.rules[playerChoice] || [];

  if (winningAgainst.includes(opponentChoice)) {
    return "win";
  }

  return "loss";
}

export function makeGame({ userId, ruleset, choice, opponentType = "ai" }) {
  if (!userId) {
    throw new Error("userId is required");
  }

  if (!ruleset) {
    throw new Error("ruleset is required");
  }

  const opponentChoice = getRandomChoice(ruleset.symbols);
  const result = calculateResult(choice, opponentChoice, ruleset);

  return {
    id: generateId("game"),
    userId,
    rulesetId: ruleset.id,
    playerChoice: choice,
    opponentChoice,
    opponentType,
    result
  };
}