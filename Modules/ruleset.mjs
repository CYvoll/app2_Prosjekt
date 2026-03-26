import { generateId } from "./id.mjs";

export function makeRuleset({ ownerId, name, symbols, rules }) {
  if (!ownerId) {
    throw new Error("ownerId is required");
  }

  if (!name || typeof name !== "string") {
    throw new Error("Ruleset name is required");
  }

  const finalSymbols = Array.isArray(symbols) && symbols.length >= 3
    ? symbols
    : ["rock", "paper", "scissors"];

  const finalRules = rules || {
    rock: ["scissors"],
    paper: ["rock"],
    scissors: ["paper"]
  };

  return {
    id: generateId("ruleset"),
    ownerId,
    name,
    symbols: finalSymbols,
    rules: finalRules,
    isPublic: false
  };
}