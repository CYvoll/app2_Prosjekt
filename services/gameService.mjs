import { apiFetch } from "client.js";

export function createGame({ userId, rulesetId, choice }) {
  return apiFetch("/games", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, rulesetId, choice })
  });
}

export function getStats(userId) {
  return apiFetch(`/games/user/${userId}/stats`);
}