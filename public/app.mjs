import "./components/user-form.mjs";
import "./components/ruleset-form.mjs";
import "./components/game-ui.mjs";
import "./components/user-stats.mjs";
import "./components/leaderboard.mjs";
import "./components/multiplayer-ui.mjs";
import "./components/dashboard.mjs";

if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    try {
      await navigator.serviceWorker.register("/service-worker.js");
      console.log("Service worker registered");
    } catch (error) {
      console.error("Service worker registration failed:", error);
    }
  });
}