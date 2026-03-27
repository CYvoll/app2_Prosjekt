import { getLeaderboard } from "../services/userService.mjs";

class Leaderboard extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <section class="panel">
        <h3>Leaderboard</h3>
        <button id="load-leaderboard">Load leaderboard</button>
        <ol id="leaderboard-list" class="leaderboard-list"></ol>
        <p id="leaderboard-message"></p>
      </section>
    `;

    this.querySelector("#load-leaderboard").addEventListener("click", () => {
      this.loadLeaderboard();
    });

    window.addEventListener("game-played", () => {
      this.loadLeaderboard();
    });
  }

  async loadLeaderboard() {
    const list = this.querySelector("#leaderboard-list");
    const message = this.querySelector("#leaderboard-message");
    const currentUserId = localStorage.getItem("currentUserId");

    list.innerHTML = "";
    message.textContent = "Loading...";

    try {
      const leaderboard = await getLeaderboard();

      if (leaderboard.length === 0) {
        message.textContent = "No users yet";
        return;
      }

      message.textContent = "";

      leaderboard.forEach((user, index) => {
        const item = document.createElement("li");
        item.className = "leaderboard-item";

        if (user.id === currentUserId) {
          item.classList.add("current-user");
        }

        item.innerHTML = `
          <span class="rank">#${index + 1}</span>
          <span class="name">${user.username}</span>
          <span class="wins">${user.wins} wins</span>
          <span class="total">${user.totalGames} games</span>
        `;

        list.appendChild(item);
      });
    } catch (error) {
      message.textContent = "Could not load leaderboard";
    }
  }
}

customElements.define("leaderboard-ui", Leaderboard);