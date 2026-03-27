import { createGame } from "../services/gameService.mjs";

class GameUI extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <section class="panel">
        <h2>Play vs AI</h2>
        <p>Choose your move:</p>

        <div class="button-row">
          <button data-choice="rock">Rock</button>
          <button data-choice="paper">Paper</button>
          <button data-choice="scissors">Scissors</button>
        </div>

        <p id="result"></p>
      </section>
    `;

    this.querySelectorAll("button[data-choice]").forEach((button) => {
      button.addEventListener("click", () => {
        this.play(button.dataset.choice);
      });
    });
  }

  async play(choice) {
    const resultEl = this.querySelector("#result");

    try {
      const userId = localStorage.getItem("currentUserId");
      const rulesetId = localStorage.getItem("currentRulesetId") || "offline-default";

      if (!userId) {
        throw new Error("Create or log in as a user first");
      }

      const game = await createGame({
        userId,
        rulesetId,
        choice
      });

      const offlineText = game.offline ? " (offline mode)" : "";

      resultEl.textContent =
        `You chose ${game.playerChoice}. ` +
        `AI chose ${game.opponentChoice}. ` +
        `Result: ${game.result}${offlineText}`;

      window.dispatchEvent(
        new CustomEvent("game-played", { detail: game })
      );
    } catch (error) {
      resultEl.textContent = error.message;
    }
  }
}

customElements.define("game-ui", GameUI);