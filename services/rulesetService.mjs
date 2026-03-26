import { apiFetch } from "client.js";

export function createRuleset({ ownerId, name }) {
  return apiFetch("/rulesets", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ownerId, name })
  });
}

export function getAllRulesets() {
  return apiFetch("/rulesets");
}

export function shareRuleset(rulesetId) {
  return apiFetch(`/rulesets/${rulesetId}/share`, {
    method: "POST"
  });
}