import { createGame } from "../services/gameService.mjs";

class GameUI extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <section class="panel">
        <h2>Play</h2>
        <p>Select a move:</p>
        <div class="button-row">
          <button data-choice="rock">Rock</button>
          <button data-choice="paper">Paper</button>
          <button data-choice="scissors">Scissors</button>
        </div>
        <p id="result"></p>
      </section>
    `;

    this.querySelectorAll("button[data-choice]").forEach((btn) => {
      btn.addEventListener("click", () => {
        this.play(btn.dataset.choice);
      });
    });
  }

  async play(choice) {
    try {
      const userId = localStorage.getItem("currentUserId");
      const rulesetId = localStorage.getItem("currentRulesetId") || "default";

      if (!userId) {
        this.querySelector("#result").textContent = "Create a user first";
        return;
      }

      const game = await createGame({ userId, rulesetId, choice });

      this.querySelector("#result").textContent =
        `You chose ${game.playerChoice}, opponent chose ${game.opponentChoice}. Result: ${game.result}`;

      window.dispatchEvent(new CustomEvent("game-played", { detail: game }));
    } catch (error) {
      this.querySelector("#result").textContent = error.message || "Game failed";
    }
  }
}

customElements.define("game-ui", GameUI);