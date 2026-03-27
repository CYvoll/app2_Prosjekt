import { messages } from "./messages.mjs";

export function getCurrentLanguage() {
  return navigator.language.toLowerCase().startsWith("no") ? "no" : "en";
}

export function t(key) {
  const lang = getCurrentLanguage();
  return messages[lang]?.[key] || messages.en[key] || key;
}