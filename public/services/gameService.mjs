import { apiFetch } from "./client.mjs";

function randomChoice(symbols) {
  const index = Math.floor(Math.random() * symbols.length);
  return symbols[index];
}

function calculateResult(playerChoice, opponentChoice, rules) {
  if (playerChoice === opponentChoice) {
    return "draw";
  }

  const winsAgainst = rules[playerChoice] || [];

  if (winsAgainst.includes(opponentChoice)) {
    return "win";
  }

  return "loss";
}

function getFallbackRuleset() {
  return {
    id: "offline-default",
    symbols: ["rock", "paper", "scissors"],
    rules: {
      rock: ["scissors"],
      paper: ["rock"],
      scissors: ["paper"]
    }
  };
}

export async function createGame({ userId, rulesetId, choice }) {
  try {
    return await apiFetch("/games", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userId,
        rulesetId,
        choice
      })
    });
  } catch (error) {
    const ruleset = getFallbackRuleset();
    const opponentChoice = randomChoice(ruleset.symbols);
    const result = calculateResult(choice, opponentChoice, ruleset.rules);

    return {
      id: `offline_${Date.now()}`,
      userId,
      rulesetId: ruleset.id,
      playerChoice: choice,
      opponentChoice,
      result,
      offline: true
    };
  }
}