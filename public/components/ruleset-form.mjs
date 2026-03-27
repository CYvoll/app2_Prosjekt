import {
  createRuleset,
  getAllRulesets,
  shareRuleset
} from "../services/rulesetService.mjs";
import { t } from "../lang/i18n.mjs";

class RulesetForm extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <section class="panel">
        <h2>Rulesets</h2>

        <div class="form-row">
          <label for="ruleset-name">Ruleset name</label>
          <input id="ruleset-name" placeholder="Classic RPS" />
        </div>

        <div class="form-row">
          <label for="ruleset-symbols">Symbols (comma separated)</label>
          <input id="ruleset-symbols" placeholder="rock, paper, scissors" />
        </div>

        <div class="form-row rules-textarea-row">
          <label for="ruleset-rules">Rules (JSON)</label>
          <textarea id="ruleset-rules" rows="8" placeholder='{"rock":["scissors"],"paper":["rock"],"scissors":["paper"]}'></textarea>
        </div>

        <div class="button-row">
          <button id="create-ruleset">Create ruleset</button>
          <button id="load-rulesets">Load rulesets</button>
        </div>

        <p id="ruleset-output" aria-live="polite"></p>
        <ul id="ruleset-list" class="ruleset-list"></ul>
      </section>
    `;

    this.output = this.querySelector("#ruleset-output");
    this.list = this.querySelector("#ruleset-list");

    this.querySelector("#create-ruleset").addEventListener("click", async () => {
      await this.handleCreateRuleset();
    });

    this.querySelector("#load-rulesets").addEventListener("click", async () => {
      await this.handleLoadRulesets();
    });
  }

  async handleCreateRuleset() {
    try {
      const ownerId = localStorage.getItem("currentUserId");
      const name = this.querySelector("#ruleset-name").value.trim();
      const symbols = this.querySelector("#ruleset-symbols").value.trim();
      const rules = this.querySelector("#ruleset-rules").value.trim();

      if (!ownerId) {
        throw new Error(t("createOrLoginFirst"));
      }

      if (!name) {
        throw new Error("Ruleset name is required");
      }

      if (!symbols) {
        throw new Error("Symbols are required");
      }

      if (!rules) {
        throw new Error("Rules JSON is required");
      }

      this.output.textContent = "Creating ruleset...";

      const ruleset = await createRuleset({
        ownerId,
        name,
        symbols,
        rules
      });

      this.output.textContent = `Created ruleset: ${ruleset.name}`;

      await this.handleLoadRulesets();
    } catch (error) {
      console.error("Create ruleset failed:", error);
      this.output.textContent = error.message || "Could not create ruleset";
    }
  }

  async handleLoadRulesets() {
    try {
      this.output.textContent = t("loadingRulesets");
      this.list.innerHTML = "";

      const rulesets = await getAllRulesets();

      if (!Array.isArray(rulesets)) {
        throw new Error("Rulesets response was not an array");
      }

      if (rulesets.length === 0) {
        this.output.textContent = t("noRulesetsFound");
        return;
      }

      this.output.textContent = `Loaded ${rulesets.length} ruleset(s)`;

      for (const ruleset of rulesets) {
        const item = document.createElement("li");
        item.className = "ruleset-item";

        const symbolsText = Array.isArray(ruleset.symbols)
          ? ruleset.symbols.join(", ")
          : "No symbols";

        const rulesText = ruleset.rules
          ? JSON.stringify(ruleset.rules)
          : "{}";

        const isSelected =
          localStorage.getItem("currentRulesetId") === ruleset.id;

        item.innerHTML = `
          <div class="ruleset-info">
            <strong>${ruleset.name}</strong>
            <span><strong>Symbols:</strong> ${symbolsText}</span>
            <span><strong>Rules:</strong> <code>${rulesText}</code></span>
            <span>${ruleset.isPublic ? "Public" : "Private"}</span>
            ${isSelected ? `<span class="selected-label">Selected</span>` : ""}
          </div>

          <div class="button-row">
            <button
              data-id="${ruleset.id}"
              data-name="${ruleset.name}"
              class="select-ruleset"
            >
              Select
            </button>

            <button
              data-id="${ruleset.id}"
              class="share-ruleset"
            >
              Share
            </button>
          </div>
        `;

        this.list.appendChild(item);
      }

      this.attachItemEvents();
    } catch (error) {
      console.error("Load rulesets failed:", error);
      this.output.textContent = error.message || t("couldNotLoadRulesets");
    }
  }

  attachItemEvents() {
    this.querySelectorAll(".select-ruleset").forEach((button) => {
      button.addEventListener("click", () => {
        localStorage.setItem("currentRulesetId", button.dataset.id);
        localStorage.setItem("currentRulesetName", button.dataset.name);

        this.output.textContent = `${t("rulesetSelected")} ${button.dataset.name}`;
        window.dispatchEvent(new CustomEvent("ruleset-changed"));

        this.handleLoadRulesets();
      });
    });

    this.querySelectorAll(".share-ruleset").forEach((button) => {
      button.addEventListener("click", async () => {
        try {
          await shareRuleset(button.dataset.id);
          this.output.textContent = t("rulesetShared");
          await this.handleLoadRulesets();
        } catch (error) {
          console.error("Share ruleset failed:", error);
          this.output.textContent = error.message || "Could not share ruleset";
        }
      });
    });
  }
}

customElements.define("ruleset-form", RulesetForm);