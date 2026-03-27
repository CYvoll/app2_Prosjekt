import { apiFetch } from "./client.mjs";

export function createRuleset({ ownerId, name, symbols, rules }) {
  return apiFetch("/rulesets", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ownerId,
      name,
      symbols,
      rules
    })
  });
}

export function getAllRulesets() {
  return apiFetch("/rulesets");
}

export function getRulesetById(rulesetId) {
  return apiFetch(`/rulesets/${rulesetId}`);
}

export function shareRuleset(rulesetId) {
  return apiFetch(`/rulesets/${rulesetId}/share`, {
    method: "POST"
  });
}