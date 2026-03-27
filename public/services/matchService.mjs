import { apiFetch } from "./client.mjs";

export function createMatch({ hostUserId, rulesetId }) {
  return apiFetch("/matches", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ hostUserId, rulesetId })
  });
}

export function getMatchByShareCode(shareCode) {
  return apiFetch(`/matches/share/${encodeURIComponent(shareCode)}`);
}

export function getMatchById(matchId) {
  return apiFetch(`/matches/${matchId}`);
}

export function joinMatch(matchId, guestUserId) {
  return apiFetch(`/matches/${matchId}/join`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ guestUserId })
  });
}

export function playMatch(matchId, userId, choice) {
  return apiFetch(`/matches/${matchId}/play`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, choice })
  });
}