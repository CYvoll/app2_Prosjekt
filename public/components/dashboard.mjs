import { getStats } from "../services/userService.mjs";

class AppDashboard extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <section class="panel">
        <h2>Dashboard</h2>

        <div class="dashboard-top" id="dashboard-top">
          <div class="mini-panel">
            <h3>Session</h3>
            <p id="current-user">No user selected</p>
            <button id="logout-btn">Log out</button>
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

        <div class="dashboard-layout">
          <div class="dashboard-game">
            <game-ui></game-ui>
          </div>

          <aside class="dashboard-side">
            <leaderboard-ui></leaderboard-ui>
            <user-stats></user-stats>
          </aside>
        </div>
      </section>
    `;

    this.querySelector("#logout-btn").addEventListener("click", () => {
      localStorage.removeItem("currentUserId");
      this.refresh();
      window.dispatchEvent(new CustomEvent("user-changed"));
    });

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

    currentUser.textContent = username
      ? `Logged in as: ${username}`
      : "No user selected";

    currentRuleset.textContent = rulesetName || "No ruleset selected";

    if (!userId) {
      quickStats.textContent = "Wins: - | Losses: - | Draws: -";
      return;
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