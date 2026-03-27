import { messages } from "../lang/messages.mjs";

function detectLanguage(acceptLanguage = "") {
  return acceptLanguage.toLowerCase().startsWith("no") ? "no" : "en";
}

export default function i18n(req, res, next) {
  const lang = detectLanguage(req.headers["accept-language"] || "");

  req.lang = lang;
  req.t = messages[lang] || messages.en;

  next();
}