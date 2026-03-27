import { generateId } from "./userId.mjs";

export function generateShareCode() {
  return Math.random().toString(36).slice(2, 8);
}

export function makeMatch({ hostUserId, rulesetId }) {
  if (!hostUserId) {
    throw new Error("hostUserId is required");
  }

  if (!rulesetId) {
    throw new Error("rulesetId is required");
  }

  return {
    id: generateId("match"),
    hostUserId,
    guestUserId: null,
    rulesetId,
    hostChoice: null,
    guestChoice: null,
    result: null,
    shareCode: generateShareCode()
  };
}

export function applyPlayerChoice(match, userId, choice) {
  if (userId === match.hostUserId) {
    return {
      ...match,
      hostChoice: choice
    };
  }

  if (userId === match.guestUserId) {
    return {
      ...match,
      guestChoice: choice
    };
  }

  throw new Error("User is not part of this match");
}

export function resolveMatch(match, ruleset) {
  if (!match.hostChoice || !match.guestChoice) {
    return {
      ...match,
      result: null
    };
  }

  if (match.hostChoice === match.guestChoice) {
    return {
      ...match,
      result: "draw"
    };
  }

  const hostWinsAgainst = ruleset.rules[match.hostChoice] || [];
  const hostWins = hostWinsAgainst.includes(match.guestChoice);

  return {
    ...match,
    result: hostWins ? "host" : "guest"
  };
}