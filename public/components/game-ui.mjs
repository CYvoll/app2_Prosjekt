import { createGame } from "../services/gameService.mjs";

class GameUI extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <h2>Play</h2>
      <button data-choice="rock">Rock</button>
      <button data-choice="paper">Paper</button>
      <button data-choice="scissors">Scissors</button>
      <p id="result"></p>
    `;

    this.querySelectorAll("button").forEach(btn => {
      btn.addEventListener("click", () => {
        this.play(btn.dataset.choice);
      });
    });
  }

  async play(choice) {
    const userId = localStorage.getItem("currentUserId");

    const game = await createGame({
      userId,
      rulesetId: "default",
      choice
    });

    this.querySelector("#result").textContent =
      `You chose ${game.playerChoice}, AI chose ${game.opponentChoice} → ${game.result}`;
  }
}

customElements.define("game-ui", GameUI);