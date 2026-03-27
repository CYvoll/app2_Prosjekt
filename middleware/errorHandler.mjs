export default function makeUser({ username, acceptTos }, t) {
  if (!username || typeof username !== "string") {
    throw new Error(t.usernameRequired);
  }

  if (acceptTos !== true) {
    throw new Error(t.tosRequired);
  }

  return {
    id: generateId("user"),
    username,
    consentToS: true
  };
}