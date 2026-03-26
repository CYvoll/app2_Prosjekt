import { apiFetch } from "./client.mjs";

export function createUser(username, acceptTos) {
  return apiFetch("/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, acceptTos })
  });
}

export function deleteUser(userId) {
  return apiFetch(`/users/${userId}`, {
    method: "DELETE"
  });
}