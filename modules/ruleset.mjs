import { generateId } from "./userId.mjs";

export function makeRuleset({ ownerId, name, symbols, rules }, t = {}) {
  const messages = {
    rulesetNameRequired: t.rulesetNameRequired || "Ruleset name is required",
    ownerIdRequired: t.ownerIdRequired || "ownerId is required",
    symbolsRequired: t.symbolsRequired || "At least 3 symbols are required",
    invalidRulesJson: t.invalidRulesJson || "Rules must be valid JSON",
    invalidRulesReference:
      t.invalidRulesReference || "Rules contain references to unknown symbols",
    ...t
  };

  if (!ownerId) {
    throw new Error(messages.ownerIdRequired);
  }

  if (!name || typeof name !== "string") {
    throw new Error(messages.rulesetNameRequired);
  }

  const parsedSymbols = parseSymbols(symbols);

  if (parsedSymbols.length < 3) {
    throw new Error(messages.symbolsRequired);
  }

  const parsedRules = parseRules(rules, messages.invalidRulesJson);

  validateRules(parsedSymbols, parsedRules, messages.invalidRulesReference);

  return {
    id: generateId("ruleset"),
    ownerId,
    name,
    symbols: parsedSymbols,
    rules: parsedRules,
    isPublic: false
  };
}

function parseSymbols(symbolsInput) {
  if (Array.isArray(symbolsInput)) {
    return symbolsInput
      .map((symbol) => String(symbol).trim())
      .filter(Boolean);
  }

  if (typeof symbolsInput === "string") {
    return symbolsInput
      .split(",")
      .map((symbol) => symbol.trim())
      .filter(Boolean);
  }

  return [];
}

function parseRules(rulesInput, errorMessage) {
  if (typeof rulesInput === "object" && rulesInput !== null) {
    return rulesInput;
  }

  if (typeof rulesInput === "string") {
    try {
      return JSON.parse(rulesInput);
    } catch {
      throw new Error(errorMessage);
    }
  }

  throw new Error(errorMessage);
}

function validateRules(symbols, rules, errorMessage) {
  const symbolSet = new Set(symbols);

  for (const symbol of Object.keys(rules)) {
    if (!symbolSet.has(symbol)) {
      throw new Error(errorMessage);
    }

    const defeats = rules[symbol];

    if (!Array.isArray(defeats)) {
      throw new Error(errorMessage);
    }

    for (const target of defeats) {
      if (!symbolSet.has(target)) {
        throw new Error(errorMessage);
      }
    }
  }
}