const CACHE_NAME = "rps-app-v1";

const APP_SHELL = [
  "/",
  "/index.html",
  "/app.css",
  "/app.mjs",
  "/tos.html",
  "/privacy.html",
  "/manifest.json",
  "/components/user-form.mjs",
  "/components/ruleset-form.mjs",
  "/components/game-ui.mjs",
  "/components/user-stats.mjs",
  "/components/leaderboard.mjs",
  "/components/multiplayer-ui.mjs",
  "/components/dashboard.mjs",
  "/services/client.mjs",
  "/services/userService.mjs",
  "/services/gameService.mjs",
  "/services/rulesetService.mjs",
  "/services/matchService.mjs"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request);
    })
  );
});