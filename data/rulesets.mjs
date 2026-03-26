import { memoryStore } from "./memoryStore.mjs";

export function create(ruleset) {
  memoryStore.rulesets[ruleset.id] = ruleset;
  return ruleset;
}

export function getById(id) {
  return memoryStore.rulesets[id] || null;
}

export function getAll() {
  return Object.values(memoryStore.rulesets);
}

export function update(id, updates) {
  const existing = memoryStore.rulesets[id];
  if (!existing) return null;

  const updated = {
    ...existing,
    ...updates
  };

  memoryStore.rulesets[id] = updated;
  return updated;
}

export function share(id) {
  return update(id, { isPublic: true });
}

export function getPublic() {
  return Object.values(memoryStore.rulesets).filter((ruleset) => ruleset.isPublic);
}