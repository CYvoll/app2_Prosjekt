import { getStats } from "../services/userService.mjs";

class UserStats extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <section class="panel">
        <h3>Your Stats</h3>
        <div id="stats" class="stats-grid">
          <div class="stat-card"><span class="label">Wins</span><span id="wins">-</span></div>
          <div class="stat-card"><span class="label">Losses</span><span id="losses">-</span></div>
          <div class="stat-card"><span class="label">Draws</span><span id="draws">-</span></div>
          <div class="stat-card"><span class="label">Total games</span><span id="total">-</span></div>
        </div>
        <p id="stats-message"></p>
        <button id="refresh-stats">Refresh stats</button>
      </section>
    `;

    this.loadStats();

    this.querySelector("#refresh-stats").addEventListener("click", () => {
      this.loadStats();
    });

    window.addEventListener("game-played", () => {
      this.loadStats();
    });
  }

  async loadStats() {
    const userId = localStorage.getItem("currentUserId");
    const message = this.querySelector("#stats-message");

    if (!userId) {
      message.textContent = "No user selected";
      this.renderStats({ wins: "-", losses: "-", draws: "-", total: "-" });
      return;
    }

    try {
      const stats = await getStats(userId);
      this.renderStats(stats);
      message.textContent = "";
    } catch (error) {
      message.textContent = "Could not load stats";
    }
  }

  renderStats(stats) {
    this.querySelector("#wins").textContent = stats.wins;
    this.querySelector("#losses").textContent = stats.losses;
    this.querySelector("#draws").textContent = stats.draws;
    this.querySelector("#total").textContent = stats.total;
  }
}

customElements.define("user-stats", UserStats);