import { getStats } from "../services/userService.mjs";

class AppDashboard extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <section class="panel">
        <h2>Dashboard</h2>

        <div class="dashboard-top">
          <div class="mini-panel">
            <h3>Session</h3>
            <p id="current-user">No user selected</p>
          </div>

          <div class="mini-panel">
            <h3>Selected Ruleset</h3>
            <p id="current-ruleset">No ruleset selected</p>
          </div>

          <div class="mini-panel">
            <h3>Quick Stats</h3>
            <p id="quick-stats">Wins: - | Losses: - | Draws: -</p>
          </div>
        </div>

        <div id="dashboard-message" class="dashboard-message"></div>

        <div id="dashboard-layout" class="dashboard-layout">
          <div class="dashboard-game">
            <game-ui></game-ui>
          </div>

          <aside class="dashboard-side">
            <user-stats></user-stats>
            <leaderboard-ui></leaderboard-ui>
          </aside>
        </div>
      </section>
    `;

    window.addEventListener("user-changed", () => this.refresh());
    window.addEventListener("ruleset-changed", () => this.refresh());
    window.addEventListener("game-played", () => this.refresh());

    this.refresh();
  }

  async refresh() {
    const userId = localStorage.getItem("currentUserId");
    const username = localStorage.getItem("currentUsername");
    const rulesetName = localStorage.getItem("currentRulesetName");

    const currentUser = this.querySelector("#current-user");
    const currentRuleset = this.querySelector("#current-ruleset");
    const quickStats = this.querySelector("#quick-stats");
    const dashboardMessage = this.querySelector("#dashboard-message");
    const dashboardLayout = this.querySelector("#dashboard-layout");

    currentUser.textContent = username
      ? `Logged in as: ${username}`
      : "No user selected";

    currentRuleset.textContent = rulesetName || "No ruleset selected";

    if (!userId) {
      quickStats.textContent = "Wins: - | Losses: - | Draws: -";
      dashboardMessage.textContent = "Create or log in as a user to play.";
      dashboardLayout.style.display = "none";
      return;
    }

    dashboardLayout.style.display = "grid";

    if (!rulesetName) {
      dashboardMessage.textContent = "Select a ruleset before playing.";
    } else {
      dashboardMessage.textContent = "";
    }

    try {
      const stats = await getStats(userId);
      quickStats.textContent =
        `Wins: ${stats.wins} | Losses: ${stats.losses} | Draws: ${stats.draws}`;
    } catch {
      quickStats.textContent = "Could not load stats";
    }
  }
}

customElements.define("app-dashboard", AppDashboard);