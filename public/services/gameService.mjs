import { apiFetch } from "./client.mjs";

export function createGame({ userId, rulesetId, choice }) {
  return apiFetch("/games", {
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
}