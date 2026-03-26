import { memoryStore } from "./memoryStore.mjs";

export function create(user) {
  memoryStore.users[user.id] = user;
  return user;
}

export function getById(id) {
  return memoryStore.users[id] || null;
}

export function getAll() {
  return Object.values(memoryStore.users);
}

export function remove(id) {
  if (!memoryStore.users[id]) return false;
  delete memoryStore.users[id];
  return true;
}