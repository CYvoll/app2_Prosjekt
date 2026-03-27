import {
  createRuleset,
  getAllRulesets,
  shareRuleset
} from "../services/rulesetService.mjs";

class RulesetForm extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <section class="panel">
        <h2>Rulesets</h2>

        <div class="form-row">
          <input id="ruleset-name" placeholder="Ruleset name" />
          <button id="create-ruleset">Create ruleset</button>
        </div>

        <div class="button-row">
          <button id="load-rulesets">Load rulesets</button>
        </div>

        <ul id="ruleset-list" class="ruleset-list"></ul>
        <p id="ruleset-output"></p>
      </section>
    `;

    const output = this.querySelector("#ruleset-output");
    const list = this.querySelector("#ruleset-list");

    this.querySelector("#create-ruleset").addEventListener("click", async () => {
      try {
        const ownerId = localStorage.getItem("currentUserId");

        if (!ownerId) {
          throw new Error("Create or log in as a user first");
        }

        const name = this.querySelector("#ruleset-name").value.trim();

        const ruleset = await createRuleset({ ownerId, name });

        output.textContent = `Created ruleset: ${ruleset.name}`;
      } catch (error) {
        output.textContent = error.message;
      }
    });

    this.querySelector("#load-rulesets").addEventListener("click", async () => {
      try {
        const rulesets = await getAllRulesets();

        list.innerHTML = "";

        for (const ruleset of rulesets) {
          const item = document.createElement("li");
          item.className = "ruleset-item";

          item.innerHTML = `
            <div class="ruleset-info">
              <strong>${ruleset.name}</strong>
              <span>${ruleset.isPublic ? "Public" : "Private"}</span>
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

          list.appendChild(item);
        }

        this.querySelectorAll(".select-ruleset").forEach((button) => {
          button.addEventListener("click", () => {
            localStorage.setItem("currentRulesetId", button.dataset.id);
            localStorage.setItem("currentRulesetName", button.dataset.name);

            output.textContent = `Selected ruleset: ${button.dataset.name}`;
            window.dispatchEvent(new CustomEvent("ruleset-changed"));
          });
        });

        this.querySelectorAll(".share-ruleset").forEach((button) => {
          button.addEventListener("click", async () => {
            try {
              await shareRuleset(button.dataset.id);
              output.textContent = "Ruleset shared";
            } catch (error) {
              output.textContent = error.message;
            }
          });
        });
      } catch (error) {
        output.textContent = error.message;
      }
    });
  }
}

customElements.define("ruleset-form", RulesetForm);