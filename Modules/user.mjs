import { generateId } from "./id.mjs";

export function makeUser({ username, acceptTos }) {
  if (!username || typeof username !== "string") {
    throw new Error("Username is required");
  }

  if (acceptTos !== true) {
    throw new Error("You must accept the Terms of Service");
  }

  return {
    id: generateId("user"),
    username,
    consentToS: true
  };
}