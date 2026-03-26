import { createRuleset, getAllRulesets, shareRuleset } from "../logic/rulesetService.js";

class RulesetForm extends HTMLElement {
  async connectedCallback() {
    this.innerHTML = `
      <section>
        <h2>Rulesets</h2>
        <input id="ruleset-name" placeholder="Ruleset name" />
        <button id="create-ruleset">Create ruleset</button>
        <button id="load-rulesets">Load rulesets</button>
        <ul id="ruleset-list"></ul>
        <p id="ruleset-output"></p>
      </section>
    `;

    const output = this.querySelector("#ruleset-output");
    const list = this.querySelector("#ruleset-list");

    this.querySelector("#create-ruleset").addEventListener("click", async () => {
      try {
        const ownerId = localStorage.getItem("currentUserId");
        if (!ownerId) throw new Error("Create a user first");

        const name = this.querySelector("#ruleset-name").value;
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
          item.innerHTML = `
            <strong>${ruleset.name}</strong>
            <button data-id="${ruleset.id}" class="select-ruleset">Select</button>
            <button data-id="${ruleset.id}" class="share-ruleset">Share</button>
          `;
          list.appendChild(item);
        }

        this.querySelectorAll(".select-ruleset").forEach((button) => {
          button.addEventListener("click", () => {
            localStorage.setItem("currentRulesetId", button.dataset.id);
            output.textContent = "Ruleset selected";
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