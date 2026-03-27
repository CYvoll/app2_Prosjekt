import { createGame } from "../services/gameService.mjs";
import { getRulesetById } from "../services/rulesetService.mjs";
import { t } from "../lang/i18n.mjs";

class GameUI extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <section class="panel">
        <h2>Play vs AI</h2>
        <p id="game-ruleset-name">No ruleset selected</p>

        <div class="button-row" id="choice-buttons"></div>

        <p id="result" aria-live="polite"></p>
      </section>
    `;

    window.addEventListener("ruleset-changed", () => this.loadRuleset());
    window.addEventListener("user-changed", () => this.loadRuleset());

    this.loadRuleset();
  }

  async loadRuleset() {
    const rulesetId = localStorage.getItem("currentRulesetId");
    const rulesetNameEl = this.querySelector("#game-ruleset-name");
    const choiceButtons = this.querySelector("#choice-buttons");
    const resultEl = this.querySelector("#result");

    choiceButtons.innerHTML = "";
    resultEl.textContent = "";

    if (!rulesetId) {
      rulesetNameEl.textContent = t("noRulesetSelected");
      return;
    }

    try {
      const ruleset = await getRulesetById(rulesetId);

      rulesetNameEl.textContent = `Ruleset: ${ruleset.name}`;

      for (const symbol of ruleset.symbols) {
        const button = document.createElement("button");
        button.textContent = symbol;
        button.dataset.choice = symbol;

        button.addEventListener("click", () => {
          this.play(symbol);
        });

        choiceButtons.appendChild(button);
      }
    } catch (error) {
      rulesetNameEl.textContent = error.message || t("couldNotLoadRulesets");
    }
  }

  async play(choice) {
    const resultEl = this.querySelector("#result");

    try {
      const userId = localStorage.getItem("currentUserId");
      const rulesetId = localStorage.getItem("currentRulesetId");

      if (!userId) {
        throw new Error(t("createOrLoginFirst"));
      }

      if (!rulesetId) {
        throw new Error(t("selectRulesetFirst"));
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